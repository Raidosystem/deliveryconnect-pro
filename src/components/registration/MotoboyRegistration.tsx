import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { Motorcycle } from '@phosphor-icons/react'

interface MotoboyRegistrationProps {
  onSuccess: (user: any) => void
}

export function MotoboyRegistration({ onSuccess }: MotoboyRegistrationProps) {
  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    phone: '',
    email: '',
    vehicleModel: '',
    vehicleYear: '',
    licensePlate: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [registeredUsers, setRegisteredUsers] = useKV<any[]>('registered-users', [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.cnpj || !formData.phone) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    setIsLoading(true)

    const existingUser = registeredUsers?.find(u => u.cnpj === formData.cnpj)
    if (existingUser) {
      toast.error('CNPJ já cadastrado')
      setIsLoading(false)
      return
    }

    const newUser = {
      ...formData,
      type: 'motoboy',
      id: Date.now(),
      isOnline: false,
      location: null,
      totalDeliveries: 0,
      totalEarnings: 0,
      createdAt: new Date().toISOString()
    }

    setRegisteredUsers((current) => [...(current || []), newUser])
    toast.success('Cadastro realizado com sucesso!')
    onSuccess(newUser)
    setIsLoading(false)
  }

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mx-auto mb-4">
          <Motorcycle className="w-6 h-6 text-accent-foreground" />
        </div>
        <CardTitle>Cadastro de Motoboy</CardTitle>
        <CardDescription>
          Junte-se à nossa rede de entregadores e comece a ganhar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome Completo *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Seu nome completo"
            />
          </div>
          
          <div>
            <Label htmlFor="cnpj">CNPJ *</Label>
            <Input
              id="cnpj"
              value={formData.cnpj}
              onChange={(e) => setFormData({...formData, cnpj: e.target.value})}
              placeholder="00.000.000/0000-00"
              maxLength={18}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="(11) 99999-9999"
              />
            </div>
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="vehicleModel">Modelo da Moto</Label>
              <Input
                id="vehicleModel"
                value={formData.vehicleModel}
                onChange={(e) => setFormData({...formData, vehicleModel: e.target.value})}
                placeholder="Honda CG 160"
              />
            </div>
            <div>
              <Label htmlFor="vehicleYear">Ano</Label>
              <Input
                id="vehicleYear"
                value={formData.vehicleYear}
                onChange={(e) => setFormData({...formData, vehicleYear: e.target.value})}
                placeholder="2020"
              />
            </div>
            <div>
              <Label htmlFor="licensePlate">Placa</Label>
              <Input
                id="licensePlate"
                value={formData.licensePlate}
                onChange={(e) => setFormData({...formData, licensePlate: e.target.value})}
                placeholder="ABC-1234"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Cadastrando...' : 'Finalizar Cadastro'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}