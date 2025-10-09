import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MapPin, Package, CurrencyDollar, Clock } from '@phosphor-icons/react'
import { LiveMap } from '@/components/map/LiveMap'

interface DashboardCommerceProps {
  user: any
}

export function DashboardCommerce({ user }: DashboardCommerceProps) {
  const [deliveries] = useKV<any[]>('deliveries', [])
  const [activeDeliveries, setActiveDeliveries] = useState<any[]>([])
  const [completedDeliveries, setCompletedDeliveries] = useState<any[]>([])

  useEffect(() => {
    const userDeliveries = deliveries?.filter(d => d.commerceId === user.id) || []
    setActiveDeliveries(userDeliveries.filter(d => d.status !== 'completed'))
    setCompletedDeliveries(userDeliveries.filter(d => d.status === 'completed'))
  }, [deliveries, user.id])

  const totalSpent = completedDeliveries.reduce((sum, d) => sum + (d.value || 0), 0)
  const totalDeliveries = completedDeliveries.length

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

      <Tabs defaultValue="map" className="space-y-6">
        <TabsList>
          <TabsTrigger value="map">Mapa em Tempo Real</TabsTrigger>
          <TabsTrigger value="active">Entregas Ativas</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

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
            {activeDeliveries.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma entrega ativa</h3>
                  <p className="text-muted-foreground">Suas entregas aparecerão aqui quando solicitadas</p>
                </CardContent>
              </Card>
            ) : (
              activeDeliveries.map((delivery) => (
                <Card key={delivery.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Entrega #{delivery.id}</h3>
                        <p className="text-sm text-muted-foreground">{delivery.address}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={delivery.status === 'in_progress' ? 'default' : 'secondary'}>
                          {delivery.status === 'in_progress' ? 'Em andamento' : 'Aguardando'}
                        </Badge>
                        <p className="text-sm font-medium">R$ {delivery.value?.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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