import { useEffect, useRef } from 'react'

interface LiveMapProps {
  activeDeliveries: any[]
}

export function LiveMap({ activeDeliveries }: LiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.innerHTML = `
        <div class="flex items-center justify-center h-full bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/25">
          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-foreground mb-2">Mapa Interativo</h3>
            <p class="text-muted-foreground text-sm max-w-sm">
              O mapa em tempo real estará disponível quando houver entregas ativas.
              ${activeDeliveries.length > 0 
                ? `${activeDeliveries.length} entrega(s) em andamento` 
                : 'Nenhuma entrega ativa no momento'
              }
            </p>
          </div>
        </div>
      `
    }
  }, [activeDeliveries])

  return (
    <div 
      ref={mapRef} 
      className="w-full h-96 bg-background border rounded-lg"
    />
  )
}