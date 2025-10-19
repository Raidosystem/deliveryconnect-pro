import { useState, useEffect } from 'react'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { WhatsappLogo, Motorcycle, MapPin, Star } from '@phosphor-icons/react'
import { ChatDialog } from '@/components/notifications/ChatDialog'

interface ActiveMotoboysProps {
  userLocation?: { lat: number; lng: number }
  currentUser?: any
}

export function ActiveMotoboys({ userLocation, currentUser }: ActiveMotoboysProps) {
  const [registeredUsers] = useLocalStorage<any[]>('registered-users', [])
  const [activeMotoboys, setActiveMotoboys] = useState<any[]>([])

  useEffect(() => {
    // Filtrar apenas motoboys que estão online
    const motoboys = registeredUsers?.filter(user => 
      user.type === 'motoboy' && user.isOnline
    ) || []
    
    // Ordenar por proximidade se tiver localização do usuário
    const sortedMotoboys = motoboys.sort((a, b) => {
      if (!userLocation || !a.location || !b.location) return 0
      
      const distanceA = calculateDistance(userLocation, a.location)
      const distanceB = calculateDistance(userLocation, b.location)
      
      return distanceA - distanceB
    })
    
    setActiveMotoboys(sortedMotoboys)
  }, [registeredUsers, userLocation])

  const calculateDistance = (pos1: {lat: number, lng: number}, pos2: {lat: number, lng: number}) => {
    const R = 6371 // Raio da Terra em km
    const dLat = (pos2.lat - pos1.lat) * Math.PI / 180
    const dLng = (pos2.lng - pos1.lng) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(pos1.lat * Math.PI / 180) * Math.cos(pos2.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const formatDistance = (distance: number) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`
    }
    return `${distance.toFixed(1)}km`
  }

  const openWhatsApp = (whatsapp: string, motoboyName: string) => {
    // Remove formatação do número
    const cleanNumber = whatsapp.replace(/\D/g, '')
    
    // Adiciona código do país se não tiver
    const fullNumber = cleanNumber.startsWith('55') ? cleanNumber : `55${cleanNumber}`
    
    const message = encodeURIComponent(
      `Olá ${motoboyName}! Vi seu perfil no DeliveryConnect e gostaria de solicitar uma entrega. Você está disponível?`
    )
    
    const whatsappUrl = `https://wa.me/${fullNumber}?text=${message}`
    window.open(whatsappUrl, '_blank')
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getRating = (totalDeliveries: number) => {
    // Simulação de rating baseado em entregas
    if (totalDeliveries === 0) return 'Novo'
    if (totalDeliveries < 10) return '4.2'
    if (totalDeliveries < 50) return '4.5'
    return '4.8'
  }

  if (activeMotoboys.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Motorcycle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum motoboy online</h3>
          <p className="text-muted-foreground">
            No momento não há motoboys disponíveis na sua região
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {activeMotoboys.map((motoboy) => {
        const distance = userLocation && motoboy.location 
          ? calculateDistance(userLocation, motoboy.location)
          : null

        return (
          <Card key={motoboy.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(motoboy.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{motoboy.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        Online
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {distance && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{formatDistance(distance)}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{getRating(motoboy.totalDeliveries || 0)}</span>
                      </div>
                      
                      <span>
                        {motoboy.totalDeliveries || 0} entregas
                      </span>
                    </div>
                    
                    {motoboy.vehicleModel && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {motoboy.vehicleModel} {motoboy.vehicleYear}
                        {motoboy.licensePlate && ` • ${motoboy.licensePlate}`}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  {currentUser && (
                    <ChatDialog
                      currentUserId={currentUser.id}
                      currentUserName={currentUser.businessName || currentUser.name}
                      currentUserType="commerce"
                      targetUserId={motoboy.id}
                      targetUserName={motoboy.name}
                      targetUserType="motoboy"
                    />
                  )}
                  
                  <Button
                    onClick={() => openWhatsApp(motoboy.whatsapp, motoboy.name)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    size="sm"
                  >
                    <WhatsappLogo className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                  
                  {distance && (
                    <div className="text-center">
                      <span className="text-xs text-muted-foreground">
                        {distance < 5 ? 'Muito próximo' : 'Disponível'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}