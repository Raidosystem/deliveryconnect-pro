import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'
import { Motorcycle } from '@phosphor-icons/react'

interface MotoboyRegistrationProps {
  onSuccess: (user: any) => void
}

export function MotoboyRegistration({ onSuccess }: MotoboyRegistrationProps) {
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    cnh: '',
    phone: '',
    email: '',
    vehicleType: '',
    vehiclePlate: '',
    password: '',
    confirmPassword: ''
  })
  const { signUp, loading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.cpf || !formData.cnh || !formData.phone || !formData.email || !formData.password) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('As senhas não coincidem')
      return
    }

    if (formData.password.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres')
      return
    }

    setIsLoading(true)

    try {
      const { user, error } = await signUp(
        formData.email,
        formData.password,
        'motoboy',
        {
          name: formData.name,
          cpf: formData.cpf,
          cnh: formData.cnh,
          phone: formData.phone,
          vehicleType: formData.vehicleType || 'Moto',
          vehiclePlate: formData.vehiclePlate || 'N/A',
        }
      )

      if (error) {
        toast.error(error)
        return
      }

      if (user) {
        toast.success('Cadastro realizado com sucesso!')
        onSuccess(user)
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Erro ao realizar cadastro. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
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
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cpf">CPF *</Label>
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                placeholder="000.000.000-00"
                maxLength={14}
                required
              />
            </div>
            <div>
              <Label htmlFor="cnh">CNH *</Label>
              <Input
                id="cnh"
                value={formData.cnh}
                onChange={(e) => setFormData({...formData, cnh: e.target.value})}
                placeholder="Número da CNH"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="(11) 99999-9999"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vehicleType">Tipo de Veículo</Label>
              <Input
                id="vehicleType"
                value={formData.vehicleType}
                onChange={(e) => setFormData({...formData, vehicleType: e.target.value})}
                placeholder="Moto, Bicicleta, Carro"
              />
            </div>
            <div>
              <Label htmlFor="vehiclePlate">Placa do Veículo</Label>
              <Input
                id="vehiclePlate"
                value={formData.vehiclePlate}
                onChange={(e) => setFormData({...formData, vehiclePlate: e.target.value})}
                placeholder="ABC-1234"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="password">Senha *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                placeholder="Digite a senha novamente"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || loading}>
            {isLoading || loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}