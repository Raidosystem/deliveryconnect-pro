import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Motorcycle, CheckCircle, Package } from '@phosphor-icons/react'

interface DeliveryTrackingProps {
  delivery: {
    id: string
    address: string
    status: string
    motoboyName?: string
    motoboyPhone?: string
    collectedAt?: string
    estimatedArrival?: string
  }
  motoboyLocation?: { 
    lat: number
    lng: number
    accuracy?: number
    timestamp?: number
  }
  commerceLocation?: { lat: number; lng: number }
}

export function DeliveryTracking({ delivery, motoboyLocation, commerceLocation }: DeliveryTrackingProps) {
  const [distance, setDistance] = useState<string>('Calculando...')
  const [lastUpdate, setLastUpdate] = useState<string>('Aguardando...')

  // Calcular distância real entre duas coordenadas usando fórmula de Haversine
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371 // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  useEffect(() => {
    if (motoboyLocation && commerceLocation) {
      const dist = calculateDistance(
        commerceLocation.lat,
        commerceLocation.lng,
        motoboyLocation.lat,
        motoboyLocation.lng
      )
      
      if (dist < 1) {
        setDistance(`${Math.round(dist * 1000)}m`)
      } else {
        setDistance(`${dist.toFixed(1)} km`)
      }

      // Atualizar timestamp
      if (motoboyLocation.timestamp) {
        const secondsAgo = Math.floor((Date.now() - motoboyLocation.timestamp) / 1000)
        if (secondsAgo < 10) {
          setLastUpdate('Agora mesmo')
        } else if (secondsAgo < 60) {
          setLastUpdate(`${secondsAgo}s atrás`)
        } else {
          setLastUpdate(`${Math.floor(secondsAgo / 60)}min atrás`)
        }
      }
    }
  }, [motoboyLocation, commerceLocation])

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Aguardando Coleta',
          color: 'secondary' as const,
          icon: Package,
          message: 'Aguardando motoboy escanear o QR Code'
        }
      case 'collected':
        return {
          label: 'Coletado',
          color: 'default' as const,
          icon: CheckCircle,
          message: 'Motoboy coletou o pedido e está preparando a rota'
        }
      case 'in_progress':
        return {
          label: 'Em Rota',
          color: 'default' as const,
          icon: Motorcycle,
          message: 'Motoboy está a caminho do destino'
        }
      case 'completed':
        return {
          label: 'Entregue',
          color: 'secondary' as const,
          icon: CheckCircle,
          message: 'Entrega concluída com sucesso'
        }
      default:
        return {
          label: 'Desconhecido',
          color: 'secondary' as const,
          icon: Package,
          message: ''
        }
    }
  }

  const statusInfo = getStatusInfo(delivery.status)
  const StatusIcon = statusInfo.icon

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Rastreamento em Tempo Real
          </CardTitle>
          <Badge variant={statusInfo.color}>{statusInfo.label}</Badge>
        </div>
        <CardDescription>Pedido #{delivery.id}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-3">
            <StatusIcon className="w-8 h-8 text-primary" />
            <div className="flex-1">
              <p className="font-medium">{statusInfo.message}</p>
              <p className="text-sm text-muted-foreground">
                Destino: {delivery.address}
              </p>
            </div>
          </div>

          {delivery.motoboyName && (
            <div className="border-t pt-3 mt-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium flex items-center gap-2">
                    <Motorcycle className="w-4 h-4" />
                    {delivery.motoboyName}
                  </p>
                  {delivery.motoboyPhone && (
                    <p className="text-xs text-muted-foreground">
                      {delivery.motoboyPhone}
                    </p>
                  )}
                </div>
                {motoboyLocation && delivery.status === 'in_progress' && (
                  <div className="text-right">
                    <p className="text-sm font-medium text-primary">{distance}</p>
                    <p className="text-xs text-muted-foreground">de distância</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              delivery.status !== 'pending' ? 'bg-green-500' : 'bg-gray-300'
            }`} />
            <div className="flex-1">
              <p className="text-sm font-medium">QR Code Escaneado</p>
              {delivery.collectedAt && (
                <p className="text-xs text-muted-foreground">
                  {new Date(delivery.collectedAt).toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>

          <div className="ml-1.5 border-l-2 border-gray-300 h-6" />

          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              delivery.status === 'in_progress' || delivery.status === 'completed' 
                ? 'bg-green-500 animate-pulse' 
                : 'bg-gray-300'
            }`} />
            <div className="flex-1">
              <p className="text-sm font-medium">Em Rota de Entrega</p>
              {delivery.status === 'in_progress' && (
                <p className="text-xs text-muted-foreground">
                  Acompanhe a localização no mapa
                </p>
              )}
            </div>
          </div>

          <div className="ml-1.5 border-l-2 border-gray-300 h-6" />

          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              delivery.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
            }`} />
            <div className="flex-1">
              <p className="text-sm font-medium">Entrega Concluída</p>
              {delivery.estimatedArrival && delivery.status !== 'completed' && (
                <p className="text-xs text-muted-foreground">
                  Previsão: {delivery.estimatedArrival}
                </p>
              )}
            </div>
          </div>
        </div>

        {delivery.status === 'in_progress' && motoboyLocation && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary animate-pulse" />
                <p className="text-sm font-medium">Localização GPS em Tempo Real</p>
              </div>
              <Badge variant="secondary" className="text-xs">
                {lastUpdate}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                📍 Lat: {motoboyLocation.lat.toFixed(6)}, Lng: {motoboyLocation.lng.toFixed(6)}
              </p>
              {motoboyLocation.accuracy && (
                <p className="text-xs text-muted-foreground">
                  🎯 Precisão: {Math.round(motoboyLocation.accuracy)}m
                </p>
              )}
              <div className="flex items-center gap-2 mt-2 pt-2 border-t">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <p className="text-xs text-green-600 font-medium">
                  Rastreamento ativo
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
