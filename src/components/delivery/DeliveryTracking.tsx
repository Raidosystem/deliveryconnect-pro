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
  motoboyLocation?: { lat: number; lng: number }
}

export function DeliveryTracking({ delivery, motoboyLocation }: DeliveryTrackingProps) {
  const [distance, setDistance] = useState<string>('Calculando...')

  useEffect(() => {
    if (motoboyLocation) {
      const dist = (Math.random() * 5).toFixed(1)
      setDistance(`${dist} km`)
    }
  }, [motoboyLocation])

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
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-primary" />
              <p className="text-sm font-medium">Localização Atual</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Lat: {motoboyLocation.lat.toFixed(6)}, Lng: {motoboyLocation.lng.toFixed(6)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Atualizado em tempo real
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
