import { useState, useRef, useEffect, useCallback } from 'react'
import jsQR from 'jsqr'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Camera, X, CheckCircle } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface QRCodeScannerProps {
  onScan: (data: any) => void
  onClose: () => void
}

export function QRCodeScanner({ onScan, onClose }: QRCodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationFrameRef = useRef<number | undefined>(undefined)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.setAttribute('playsinline', 'true')
        videoRef.current.play()
        streamRef.current = stream
        setHasPermission(true)
        setIsScanning(true)
      }
    } catch (err) {
      console.error('Erro ao acessar câmera:', err)
      setHasPermission(false)
      toast.error('Não foi possível acessar a câmera')
    }
  }

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    setIsScanning(false)
  }, [])

  const scanQRCode = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isScanning) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) {
      animationFrameRef.current = requestAnimationFrame(scanQRCode)
      return
    }

    canvas.height = video.videoHeight
    canvas.width = video.videoWidth
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    })

    if (code) {
      try {
        const data = JSON.parse(code.data)
        stopCamera()
        toast.success('QR Code lido com sucesso!')
        onScan(data)
      } catch (err) {
        console.error('QR Code inválido:', err)
        toast.error('QR Code inválido')
      }
    }

    animationFrameRef.current = requestAnimationFrame(scanQRCode)
  }, [isScanning, onScan, stopCamera])

  useEffect(() => {
    if (isScanning) {
      scanQRCode()
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isScanning, onScan])

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary" />
              Escanear QR Code
            </CardTitle>
            <CardDescription>
              Escaneie o código do comerciante para autorizar a coleta
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              stopCamera()
              onClose()
            }}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isScanning && hasPermission === null && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <Camera className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-blue-900 mb-2">
                Iniciar Scanner
              </h3>
              <p className="text-blue-700 text-sm mb-4">
                Clique no botão abaixo para ativar a câmera e escanear o QR Code da entrega
              </p>
            </div>
            <Button onClick={startCamera} className="w-full" size="lg">
              <Camera className="w-5 h-5 mr-2" />
              Ativar Câmera
            </Button>
          </div>
        )}

        {hasPermission === false && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <X className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="font-semibold text-red-900 mb-2">
              Câmera não disponível
            </h3>
            <p className="text-red-700 text-sm mb-4">
              Não foi possível acessar a câmera. Verifique as permissões do navegador.
            </p>
            <Button onClick={startCamera} variant="outline" className="w-full">
              Tentar Novamente
            </Button>
          </div>
        )}

        {isScanning && (
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-auto"
                playsInline
              />
              <canvas
                ref={canvasRef}
                className="hidden"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 border-4 border-primary rounded-lg animate-pulse" />
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-green-800 text-sm">
                  Posicione o QR Code dentro do quadrado para escanear
                </p>
              </div>
            </div>
            <Button onClick={stopCamera} variant="outline" className="w-full">
              Cancelar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
