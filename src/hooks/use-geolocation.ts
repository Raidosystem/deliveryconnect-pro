import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'

interface GeolocationPosition {
  lat: number
  lng: number
  accuracy?: number
  timestamp: number
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
  trackingInterval?: number
  onLocationUpdate?: (position: GeolocationPosition) => void
  onError?: (error: GeolocationPositionError) => void
}

export function useGeolocation(
  enabled: boolean = false,
  options: UseGeolocationOptions = {}
) {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 0,
    trackingInterval = 5000,
    onLocationUpdate,
    onError
  } = options

  const [position, setPosition] = useState<GeolocationPosition | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isTracking, setIsTracking] = useState(false)
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown')

  // Verificar suporte a geolocalização
  const isSupported = 'geolocation' in navigator

  // Solicitar permissão e obter localização inicial
  const requestLocation = useCallback(async () => {
    if (!isSupported) {
      const errorMsg = 'Geolocalização não é suportada neste navegador'
      setError(errorMsg)
      toast.error(errorMsg)
      return null
    }

    return new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const location: GeolocationPosition = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            timestamp: Date.now()
          }
          setPosition(location)
          setError(null)
          setPermissionStatus('granted')
          resolve(location)
        },
        (err) => {
          let errorMsg = 'Erro ao obter localização'
          
          switch (err.code) {
            case err.PERMISSION_DENIED:
              errorMsg = 'Permissão de localização negada. Por favor, habilite nas configurações do navegador.'
              setPermissionStatus('denied')
              break
            case err.POSITION_UNAVAILABLE:
              errorMsg = 'Localização indisponível. Verifique se o GPS está ativado.'
              break
            case err.TIMEOUT:
              errorMsg = 'Tempo esgotado ao tentar obter localização.'
              break
          }
          
          setError(errorMsg)
          toast.error(errorMsg)
          if (onError) onError(err)
          reject(err)
        },
        {
          enableHighAccuracy,
          timeout,
          maximumAge
        }
      )
    })
  }, [isSupported, enableHighAccuracy, timeout, maximumAge, onError])

  // Iniciar rastreamento contínuo
  const startTracking = useCallback(async () => {
    if (!isSupported) {
      toast.error('Geolocalização não é suportada')
      return false
    }

    try {
      // Obter localização inicial
      await requestLocation()
      setIsTracking(true)
      toast.success('Rastreamento GPS ativado')
      return true
    } catch (err) {
      return false
    }
  }, [isSupported, requestLocation])

  // Parar rastreamento
  const stopTracking = useCallback(() => {
    setIsTracking(false)
    toast.info('Rastreamento GPS desativado')
  }, [])

  // Efeito para rastreamento contínuo
  useEffect(() => {
    if (!enabled || !isTracking || !isSupported) return

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const location: GeolocationPosition = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: Date.now()
        }
        
        setPosition(location)
        setError(null)
        
        if (onLocationUpdate) {
          onLocationUpdate(location)
        }
      },
      (err) => {
        let errorMsg = 'Erro no rastreamento GPS'
        
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMsg = 'Permissão de localização revogada'
            setPermissionStatus('denied')
            setIsTracking(false)
            break
          case err.POSITION_UNAVAILABLE:
            errorMsg = 'GPS indisponível'
            break
          case err.TIMEOUT:
            errorMsg = 'Timeout no GPS'
            break
        }
        
        setError(errorMsg)
        if (onError) onError(err)
      },
      {
        enableHighAccuracy,
        timeout,
        maximumAge,
        // Força atualização mesmo com pouca mudança
        ...(enableHighAccuracy && { maximumAge: 0 })
      }
    )

    // Cleanup
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [enabled, isTracking, isSupported, enableHighAccuracy, timeout, maximumAge, onLocationUpdate, onError])

  // Auto-iniciar se enabled for true
  useEffect(() => {
    if (enabled && !isTracking && permissionStatus !== 'denied') {
      startTracking()
    }
  }, [enabled, isTracking, permissionStatus, startTracking])

  return {
    position,
    error,
    isTracking,
    isSupported,
    permissionStatus,
    startTracking,
    stopTracking,
    requestLocation
  }
}
