import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Toaster } from '@/components/ui/sonner'
import { MapPin, Motorcycle, Storefront, CreditCard, TrendUp } from '@phosphor-icons/react'
import { AuthForm } from '@/components/auth/AuthForm'
import { CommerceRegistration } from '@/components/registration/CommerceRegistration'
import { MotoboyRegistration } from '@/components/registration/MotoboyRegistration'
import { DashboardCommerce } from '@/components/dashboard/DashboardCommerce'
import { DashboardMotoboy } from '@/components/dashboard/DashboardMotoboy'
import { LiveMap } from '@/components/map/LiveMap'
import { NotificationCenter } from '@/components/notifications/NotificationCenter'

type UserType = 'commerce' | 'motoboy' | null
type ViewState = 'login' | 'register' | 'dashboard'

function App() {
  const [currentUser, setCurrentUser] = useKV<any>('current-user', null)
  const [userType, setUserType] = useState<UserType>(null)
  const [viewState, setViewState] = useState<ViewState>('login')
  const [registrationType, setRegistrationType] = useState<'commerce' | 'motoboy' | null>(null)

  const handleLogin = (user: any, type: UserType) => {
    setCurrentUser(user)
    setUserType(type)
    setViewState('dashboard')
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setUserType(null)
    setViewState('login')
    setRegistrationType(null)
  }

  const startRegistration = (type: 'commerce' | 'motoboy') => {
    setRegistrationType(type)
    setViewState('register')
  }

  if (currentUser && viewState === 'dashboard') {
    return (
      <div className="min-h-screen bg-background">
        <Toaster />
        <div className="border-b bg-card">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Motorcycle className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">DeliveryConnect</h1>
            </div>
            <div className="flex items-center gap-4">
              <NotificationCenter 
                userId={currentUser.id} 
                userType={userType as 'commerce' | 'motoboy'} 
              />
              <Badge variant="secondary" className="hidden sm:flex">
                {userType === 'commerce' ? 'Comerciante' : 'Motoboy'}
              </Badge>
              <Button variant="outline" onClick={handleLogout}>
                Sair
              </Button>
            </div>
          </div>
        </div>

        {userType === 'commerce' ? (
          <DashboardCommerce user={currentUser} />
        ) : (
          <DashboardMotoboy user={currentUser} />
        )}
      </div>
    )
  }

  if (viewState === 'register' && registrationType) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-md mx-auto pt-8">
          <Button 
            variant="ghost" 
            onClick={() => setViewState('login')}
            className="mb-6"
          >
            ← Voltar
          </Button>
          {registrationType === 'commerce' ? (
            <CommerceRegistration onSuccess={(user) => handleLogin(user, 'commerce')} />
          ) : (
            <MotoboyRegistration onSuccess={(user) => handleLogin(user, 'motoboy')} />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Motorcycle className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">DeliveryConnect</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Conectamos comerciantes a motoboys para entregas rápidas e seguras.
            Cadastre-se e faça parte da nossa rede.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="features" className="mb-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="features">Como Funciona</TabsTrigger>
              <TabsTrigger value="benefits">Benefícios</TabsTrigger>
            </TabsList>
            
            <TabsContent value="features" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <MapPin className="w-8 h-8 text-primary mb-2" />
                    <CardTitle className="text-lg">Rastreamento em Tempo Real</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Acompanhe suas entregas em tempo real com localização precisa do motoboy.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CreditCard className="w-8 h-8 text-accent mb-2" />
                    <CardTitle className="text-lg">Pagamentos Integrados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Sistema completo de pagamentos digitais, sem necessidade de dinheiro físico.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <TrendUp className="w-8 h-8 text-primary mb-2" />
                    <CardTitle className="text-lg">Relatórios Detalhados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Controle total de ganhos, entregas e economia para sua empresa.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="benefits" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Storefront className="w-6 h-6 text-primary" />
                    Para Comerciantes
                  </h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li>• Rede de motoboys sempre disponível</li>
                    <li>• Economia vs. entregador fixo</li>
                    <li>• Controle total das entregas</li>
                    <li>• Pagamentos seguros e transparentes</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Motorcycle className="w-6 h-6 text-accent" />
                    Para Motoboys
                  </h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li>• Renda extra flexível</li>
                    <li>• Pagamentos diários garantidos</li>
                    <li>• Controle dos seus ganhos</li>
                    <li>• Sem exclusividade, trabalhe quando quiser</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6">Pronto para começar?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => startRegistration('commerce')}
                className="text-lg px-8"
              >
                <Storefront className="w-5 h-5 mr-2" />
                Sou Comerciante
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => startRegistration('motoboy')}
                className="text-lg px-8"
              >
                <Motorcycle className="w-5 h-5 mr-2" />
                Sou Motoboy
              </Button>
            </div>
            
            <div className="mt-6">
              <AuthForm onLogin={handleLogin} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App