import { useEffect, useRef, useState } from 'react'
import { MapPin, Motorcycle } from '@phosphor-icons/react'

interface LiveMapProps {
  activeDeliveries: any[]
}

export function LiveMap({ activeDeliveries }: LiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapData, setMapData] = useState<any[]>([])

  useEffect(() => {
    // Preparar dados para o mapa
    const deliveriesWithLocation = activeDeliveries.filter(d => 
      d.motoboyId && d.status === 'in_progress'
    )
    setMapData(deliveriesWithLocation)
  }, [activeDeliveries])

  // Simulação visual de mapa com SVG
  return (
    <div className="w-full h-96 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg border-2 border-blue-200 dark:border-blue-800 overflow-hidden relative">
      {/* Grid de fundo simulando mapa */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Conteúdo do mapa */}
      <div className="relative w-full h-full p-6 flex items-center justify-center">
        {mapData.length === 0 ? (
          <div className="text-center z-10">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
              <MapPin className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Mapa de Rastreamento</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              {activeDeliveries.length > 0 
                ? 'Aguardando início das entregas para rastreamento GPS' 
                : 'Nenhuma entrega ativa no momento'
              }
            </p>
          </div>
        ) : (
          <div className="w-full h-full relative">
            {/* Legenda */}
            <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-10 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="font-medium">Motoboys em entrega</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Motorcycle className="w-4 h-4" />
                <span>{mapData.length} ativo(s)</span>
              </div>
            </div>

            {/* Contador em tempo real */}
            <div className="absolute top-4 right-4 bg-green-50 dark:bg-green-950 border-2 border-green-500 rounded-lg shadow-lg px-4 py-2 z-10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                  Rastreamento Ativo
                </span>
              </div>
            </div>

            {/* Simulação visual de pontos no mapa */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full max-w-2xl max-h-80">
                {mapData.map((delivery, index) => {
                  // Posicionar itens de forma visual
                  const angle = (index * (360 / mapData.length)) * (Math.PI / 180)
                  const radius = 100
                  const x = 50 + radius * Math.cos(angle) / 2
                  const y = 50 + radius * Math.sin(angle) / 2
                  
                  return (
                    <div
                      key={delivery.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-bounce"
                      style={{ 
                        left: `${x}%`, 
                        top: `${y}%`,
                        animationDelay: `${index * 0.2}s`,
                        animationDuration: '2s'
                      }}
                    >
                      {/* Pin de localização */}
                      <div className="relative">
                        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg ring-4 ring-red-200 animate-pulse">
                          <Motorcycle className="w-6 h-6 text-white" />
                        </div>
                        
                        {/* Tooltip com info */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-3 text-xs opacity-0 hover:opacity-100 transition-opacity">
                          <p className="font-semibold mb-1">{delivery.motoboyName || 'Motoboy'}</p>
                          <p className="text-muted-foreground">Entrega #{delivery.id.slice(-8)}</p>
                          <p className="text-primary mt-1">Status: Em rota</p>
                        </div>

                        {/* Ondas de pulso */}
                        <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping" />
                      </div>
                    </div>
                  )
                })}

                {/* Centro do mapa (você/comerciante) */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg ring-4 ring-blue-200">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg px-3 py-1 whitespace-nowrap">
                    <p className="text-xs font-semibold">Sua Localização</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info adicional */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg px-4 py-2 text-center">
              <p className="text-xs text-muted-foreground">
                Atualização em tempo real • GPS de alta precisão
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}