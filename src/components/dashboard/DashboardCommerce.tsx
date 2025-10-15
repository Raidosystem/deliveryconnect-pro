import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MapPin, Package, CurrencyDollar, Clock, Motorcycle, ChatCircle, ClockCounterClockwise, Plus } from '@phosphor-icons/react'
import { LiveMap } from '@/components/map/LiveMap'
import { ActiveMotoboys } from './ActiveMotoboys'
import { MessagesTab } from './MessagesTab'
import { ChatHistory } from '@/components/chat/ChatHistory'
import { QRCodeDisplay } from '@/components/delivery/QRCodeDisplay'
import { DeliveryTracking } from '@/components/delivery/DeliveryTracking'
import { toast } from 'sonner'

interface DashboardCommerceProps {
  user: any
}

export function DashboardCommerce({ user }: DashboardCommerceProps) {
  const [deliveries, setDeliveries] = useKV<any[]>('deliveries', [])
  const [registeredUsers, setRegisteredUsers] = useKV<any[]>('registered-users', [])
  const [activeDeliveries, setActiveDeliveries] = useState<any[]>([])
  const [completedDeliveries, setCompletedDeliveries] = useState<any[]>([])
  const [showNewDeliveryDialog, setShowNewDeliveryDialog] = useState(false)
  const [newDeliveryData, setNewDeliveryData] = useState({
    address: '',
    value: '',
    description: ''
  })

  useEffect(() => {
    const userDeliveries = deliveries?.filter(d => d.commerceId === user.id) || []
    setActiveDeliveries(userDeliveries.filter(d => d.status !== 'completed'))
    setCompletedDeliveries(userDeliveries.filter(d => d.status === 'completed'))
  }, [deliveries, user.id])

  const totalSpent = completedDeliveries.reduce((sum, d) => sum + (d.value || 0), 0)
  const totalDeliveries = completedDeliveries.length

  const createNewDelivery = () => {
    if (!newDeliveryData.address || !newDeliveryData.value) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    const deliveryId = `DEL-${Date.now()}`
    const newDelivery = {
      id: deliveryId,
      commerceId: user.id,
      commerceName: user.businessName,
      address: newDeliveryData.address,
      description: newDeliveryData.description,
      value: parseFloat(newDeliveryData.value),
      motoboyEarning: parseFloat(newDeliveryData.value) * 0.7,
      status: 'pending',
      createdAt: new Date().toISOString()
    }

    setDeliveries((current) => [...(current || []), newDelivery])
    
    toast.success('Entrega criada! Mostre o QR Code para o motoboy')
    setShowNewDeliveryDialog(false)
    setNewDeliveryData({ address: '', value: '', description: '' })
  }

  const getMotoboyLocation = (motoboyId: string) => {
    const motoboy = registeredUsers?.find(u => u.id === motoboyId)
    return motoboy?.location
  }

  const createSampleMotoboys = () => {
    const sampleMotoboys = [
      {
        id: Date.now() + 1,
        type: 'motoboy',
        name: 'João Silva',
        cnpj: '12.345.678/0001-91',
        phone: '(11) 99999-1111',
        whatsapp: '11999991111',
        email: 'joao@email.com',
        vehicleModel: 'Honda CG 160',
        vehicleYear: '2022',
        licensePlate: 'ABC-1234',
        isOnline: true,
        location: { lat: -23.5505 + (Math.random() - 0.5) * 0.05, lng: -46.6333 + (Math.random() - 0.5) * 0.05 },
        totalDeliveries: 25,
        totalEarnings: 375.50,
        createdAt: new Date().toISOString()
      },
      {
        id: Date.now() + 2,
        type: 'motoboy',
        name: 'Maria Santos',
        cnpj: '98.765.432/0001-10',
        phone: '(11) 99999-2222',
        whatsapp: '11999992222',
        email: 'maria@email.com',
        vehicleModel: 'Yamaha Factor 150',
        vehicleYear: '2021',
        licensePlate: 'XYZ-5678',
        isOnline: true,
        location: { lat: -23.5505 + (Math.random() - 0.5) * 0.05, lng: -46.6333 + (Math.random() - 0.5) * 0.05 },
        totalDeliveries: 42,
        totalEarnings: 630.00,
        createdAt: new Date().toISOString()
      },
      {
        id: Date.now() + 3,
        type: 'motoboy',
        name: 'Carlos Oliveira',
        cnpj: '11.222.333/0001-44',
        phone: '(11) 99999-3333',
        whatsapp: '11999993333',
        email: 'carlos@email.com',
        vehicleModel: 'Honda Biz 125',
        vehicleYear: '2020',
        licensePlate: 'DEF-9012',
        isOnline: false,
        location: { lat: -23.5505 + (Math.random() - 0.5) * 0.05, lng: -46.6333 + (Math.random() - 0.5) * 0.05 },
        totalDeliveries: 18,
        totalEarnings: 270.00,
        createdAt: new Date().toISOString()
      }
    ]

    setRegisteredUsers((current) => {
      const existing = current || []
      const motoboyIds = sampleMotoboys.map(m => m.cnpj)
      const filtered = existing.filter(u => u.type !== 'motoboy' || !motoboyIds.includes(u.cnpj))
      return [...filtered, ...sampleMotoboys]
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Dashboard - {user.businessName}</h1>
        <p className="text-muted-foreground">Gerencie suas entregas e acompanhe seus gastos</p>
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
            <div className="text-2xl font-bold">{totalDeliveries}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gasto Total</CardTitle>
            <CurrencyDollar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalSpent.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Economia vs Fixo</CardTitle>
            <CurrencyDollar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {Math.max(0, (totalDeliveries * 15) - totalSpent).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">vs R$ 15/entrega fixo</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="motoboys" className="space-y-6">
        <TabsList>
          <TabsTrigger value="motoboys">Motoboys Disponíveis</TabsTrigger>
          <TabsTrigger value="active">
            <Package className="w-4 h-4 mr-2" />
            Minhas Entregas
          </TabsTrigger>
          <TabsTrigger value="map">Mapa em Tempo Real</TabsTrigger>
          <TabsTrigger value="messages">
            <ChatCircle className="w-4 h-4 mr-2" />
            Mensagens
          </TabsTrigger>
          <TabsTrigger value="chat-history">
            <ClockCounterClockwise className="w-4 h-4 mr-2" />
            Histórico de Chat
          </TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="motoboys">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Motorcycle className="w-5 h-5" />
                    Motoboys Disponíveis
                  </CardTitle>
                  <CardDescription>
                    Entre em contato diretamente com motoboys online próximos à sua localização
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={createSampleMotoboys}
                >
                  Dados de Demonstração
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ActiveMotoboys userLocation={user.location} currentUser={user} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChatCircle className="w-5 h-5" />
                Mensagens
              </CardTitle>
              <CardDescription>
                Converse com motoboys e outros comerciantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MessagesTab currentUser={user} currentUserType="commerce" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat-history">
          <ChatHistory currentUser={user} currentUserType="commerce" />
        </TabsContent>

        <TabsContent value="map">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Rastreamento em Tempo Real
              </CardTitle>
              <CardDescription>
                Acompanhe a localização dos seus entregadores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LiveMap activeDeliveries={activeDeliveries} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Minhas Entregas</h3>
              <Dialog open={showNewDeliveryDialog} onOpenChange={setShowNewDeliveryDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Entrega
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Criar Nova Entrega</DialogTitle>
                    <DialogDescription>
                      Preencha os dados da entrega e gere um QR Code para o motoboy
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address">Endereço de Entrega *</Label>
                      <Input
                        id="address"
                        placeholder="Rua, número, bairro, cidade"
                        value={newDeliveryData.address}
                        onChange={(e) => setNewDeliveryData({ ...newDeliveryData, address: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="value">Valor da Entrega (R$) *</Label>
                      <Input
                        id="value"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={newDeliveryData.value}
                        onChange={(e) => setNewDeliveryData({ ...newDeliveryData, value: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Descrição</Label>
                      <Input
                        id="description"
                        placeholder="Detalhes do pedido"
                        value={newDeliveryData.description}
                        onChange={(e) => setNewDeliveryData({ ...newDeliveryData, description: e.target.value })}
                      />
                    </div>
                    <Button onClick={createNewDelivery} className="w-full">
                      Criar Entrega
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {activeDeliveries.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma entrega ativa</h3>
                  <p className="text-muted-foreground mb-4">
                    Clique em "Nova Entrega" para criar sua primeira entrega
                  </p>
                  <Button onClick={() => setShowNewDeliveryDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Entrega
                  </Button>
                </CardContent>
              </Card>
            ) : (
              activeDeliveries.map((delivery) => (
                <div key={delivery.id} className="grid md:grid-cols-2 gap-4">
                  <QRCodeDisplay
                    deliveryId={delivery.id}
                    commerceName={user.businessName}
                    address={delivery.address}
                    value={delivery.value}
                    status={delivery.status}
                  />
                  <DeliveryTracking
                    delivery={delivery}
                    motoboyLocation={delivery.motoboyId ? getMotoboyLocation(delivery.motoboyId) : undefined}
                  />
                </div>
              ))
            )}
          </div>
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
                        <p className="text-sm font-medium">R$ {delivery.value?.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}