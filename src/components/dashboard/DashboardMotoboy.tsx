import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { MapPin, Package, CurrencyDollar, Clock, CheckCircle, ChatCircle, ClockCounterClockwise, QrCode } from '@phosphor-icons/react'
import { MessagesTab } from './MessagesTab'
import { ChatHistory } from '@/components/chat/ChatHistory'
import { QRCodeScanner } from '@/components/delivery/QRCodeScanner'
import { toast } from 'sonner'

interface DashboardMotoboyProps {
  user: any
}

export function DashboardMotoboy({ user }: DashboardMotoboyProps) {
  const [registeredUsers, setRegisteredUsers] = useKV<any[]>('registered-users', [])
  const [deliveries, setDeliveries] = useKV<any[]>('deliveries', [])
  const [isOnline, setIsOnline] = useState(user.isOnline || false)
  const [myDeliveries, setMyDeliveries] = useState<any[]>([])
  const [activeDeliveries, setActiveDeliveries] = useState<any[]>([])
  const [completedDeliveries, setCompletedDeliveries] = useState<any[]>([])
  const [showQRScanner, setShowQRScanner] = useState(false)

  useEffect(() => {
    const userDeliveries = deliveries?.filter(d => d.motoboyId === user.id) || []
    setMyDeliveries(userDeliveries)
    setActiveDeliveries(userDeliveries.filter(d => d.status === 'in_progress'))
    setCompletedDeliveries(userDeliveries.filter(d => d.status === 'completed'))
  }, [deliveries, user.id])

  const totalEarnings = completedDeliveries.reduce((sum, d) => sum + (d.motoboyEarning || 0), 0)
  const todayEarnings = completedDeliveries
    .filter(d => new Date(d.completedAt).toDateString() === new Date().toDateString())
    .reduce((sum, d) => sum + (d.motoboyEarning || 0), 0)

  const handleOnlineToggle = (checked: boolean) => {
    setIsOnline(checked)
    setRegisteredUsers((current) => 
      (current || []).map(u => 
        u.id === user.id ? { ...u, isOnline: checked } : u
      )
    )
  }

  const simulateLocation = () => {
    if (isOnline) {
      const lat = -23.5505 + (Math.random() - 0.5) * 0.1
      const lng = -46.6333 + (Math.random() - 0.5) * 0.1
      
      setRegisteredUsers((current) => 
        (current || []).map(u => 
          u.id === user.id ? { ...u, location: { lat, lng } } : u
        )
      )
    }
  }

  useEffect(() => {
    if (isOnline) {
      simulateLocation()
      const interval = setInterval(simulateLocation, 5000)
      return () => clearInterval(interval)
    }
  }, [isOnline])

  const handleCompleteDelivery = (deliveryId: string) => {
    setDeliveries((current) => {
      const deliveryIndex = (current || []).findIndex(d => d.id === deliveryId)
      
      if (deliveryIndex === -1) {
        toast.error('Entrega não encontrada')
        return current || []
      }

      const delivery = (current || [])[deliveryIndex]
      
      if (delivery.status !== 'in_progress') {
        toast.error('Esta entrega não está em andamento')
        return current || []
      }

      const updatedDeliveries = [...(current || [])]
      updatedDeliveries[deliveryIndex] = {
        ...delivery,
        status: 'completed',
        completedAt: new Date().toISOString()
      }

      toast.success('Entrega concluída com sucesso!')
      return updatedDeliveries
    })
  }

  const handleQRScan = (data: any) => {
    try {
      const { deliveryId, commerceName, address, value } = data
      
      setDeliveries((current) => {
        const deliveryIndex = (current || []).findIndex(d => d.id === deliveryId)
        
        if (deliveryIndex === -1) {
          toast.error('Entrega não encontrada')
          return current || []
        }

        const delivery = (current || [])[deliveryIndex]
        
        if (delivery.status !== 'pending') {
          toast.error('Esta entrega já foi coletada')
          return current || []
        }

        const updatedDeliveries = [...(current || [])]
        updatedDeliveries[deliveryIndex] = {
          ...delivery,
          status: 'collected',
          motoboyId: user.id,
          motoboyName: user.name,
          motoboyPhone: user.phone,
          collectedAt: new Date().toISOString(),
          estimatedArrival: new Date(Date.now() + 30 * 60000).toLocaleTimeString()
        }

        setTimeout(() => {
          setDeliveries((current) => {
            const idx = (current || []).findIndex(d => d.id === deliveryId)
            if (idx !== -1) {
              const updated = [...(current || [])]
              updated[idx] = { ...updated[idx], status: 'in_progress' }
              return updated
            }
            return current || []
          })
        }, 2000)

        toast.success(`Entrega coletada! Pedido de ${commerceName}`)
        setShowQRScanner(false)
        return updatedDeliveries
      })

      setRegisteredUsers((current) => 
        (current || []).map(u => 
          u.id === user.id 
            ? { ...u, totalDeliveries: (u.totalDeliveries || 0) + 1 } 
            : u
        )
      )
    } catch (error) {
      toast.error('Erro ao processar QR Code')
      console.error('Erro ao processar QR Code:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Dashboard - {user.name}</h1>
            <p className="text-muted-foreground">Controle suas entregas e ganhos</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => setShowQRScanner(true)}
              size="lg"
              className="gap-2"
            >
              <QrCode className="w-5 h-5" />
              Escanear QR Code
            </Button>
            <span className="text-sm font-medium">
              {isOnline ? 'Online' : 'Offline'}
            </span>
            <Switch
              checked={isOnline}
              onCheckedChange={handleOnlineToggle}
            />
          </div>
        </div>
        
        {isOnline && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">
                Você está online e visível para comerciantes
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entregas Ativas</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDeliveries.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Entregas</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedDeliveries.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ganhos de Hoje</CardTitle>
            <CurrencyDollar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">R$ {todayEarnings.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ganhos Totais</CardTitle>
            <CurrencyDollar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalEarnings.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Entregas Ativas</TabsTrigger>
          <TabsTrigger value="messages">
            <ChatCircle className="w-4 h-4 mr-2" />
            Mensagens
          </TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="earnings">Ganhos Detalhados</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <div className="space-y-4">
            {activeDeliveries.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma entrega ativa</h3>
                  <p className="text-muted-foreground">Quando você aceitar entregas, elas aparecerão aqui</p>
                </CardContent>
              </Card>
            ) : (
              activeDeliveries.map((delivery) => (
                <Card key={delivery.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold">Entrega #{delivery.id}</h3>
                        <p className="text-sm text-muted-foreground">{delivery.address}</p>
                        <p className="text-xs text-muted-foreground">
                          Iniciada em {new Date(delivery.startedAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant="default">Em andamento</Badge>
                        <p className="text-sm font-medium text-green-600">
                          +R$ {delivery.motoboyEarning?.toFixed(2)}
                        </p>
                        <Button 
                          size="sm"
                          onClick={() => handleCompleteDelivery(delivery.id)}
                          className="gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Concluir Entrega
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChatCircle className="w-5 h-5" />
                Mensagens
              </CardTitle>
              <CardDescription>
                Converse com comerciantes e outros motoboys
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MessagesTab currentUser={user} currentUserType="motoboy" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat-history">
          <ChatHistory currentUser={user} currentUserType="motoboy" />
        </TabsContent>

        <TabsContent value="history">
          <div className="space-y-4">
            {completedDeliveries.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma entrega realizada</h3>
                  <p className="text-muted-foreground">Seu histórico aparecerá aqui após as primeiras entregas</p>
                </CardContent>
              </Card>
            ) : (
              completedDeliveries.map((delivery) => (
                <Card key={delivery.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Entrega #{delivery.id}</h3>
                        <p className="text-sm text-muted-foreground">{delivery.address}</p>
                        <p className="text-xs text-muted-foreground">
                          Concluída em {new Date(delivery.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">Concluída</Badge>
                        <p className="text-sm font-medium text-green-600">
                          +R$ {delivery.motoboyEarning?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="earnings">
          <Card>
            <CardHeader>
              <CardTitle>Detalhamento de Ganhos</CardTitle>
              <CardDescription>
                Acompanhe seus ganhos por período
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium">Esta Semana</h4>
                    <p className="text-2xl font-bold text-green-600">
                      R$ {completedDeliveries
                        .filter(d => {
                          const deliveryDate = new Date(d.completedAt)
                          const weekAgo = new Date()
                          weekAgo.setDate(weekAgo.getDate() - 7)
                          return deliveryDate >= weekAgo
                        })
                        .reduce((sum, d) => sum + (d.motoboyEarning || 0), 0)
                        .toFixed(2)
                      }
                    </p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium">Este Mês</h4>
                    <p className="text-2xl font-bold text-green-600">
                      R$ {completedDeliveries
                        .filter(d => {
                          const deliveryDate = new Date(d.completedAt)
                          const monthAgo = new Date()
                          monthAgo.setMonth(monthAgo.getMonth() - 1)
                          return deliveryDate >= monthAgo
                        })
                        .reduce((sum, d) => sum + (d.motoboyEarning || 0), 0)
                        .toFixed(2)
                      }
                    </p>
                  </div>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Média por Entrega</h4>
                  <p className="text-lg font-semibold">
                    R$ {completedDeliveries.length > 0 
                      ? (totalEarnings / completedDeliveries.length).toFixed(2)
                      : '0.00'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showQRScanner} onOpenChange={setShowQRScanner}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Escanear QR Code da Entrega</DialogTitle>
            <DialogDescription>
              Aponte a câmera para o código QR do comerciante para autorizar a coleta
            </DialogDescription>
          </DialogHeader>
          <QRCodeScanner 
            onScan={handleQRScan} 
            onClose={() => setShowQRScanner(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}