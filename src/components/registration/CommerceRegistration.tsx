import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'
import { Storefront } from '@phosphor-icons/react'

interface CommerceRegistrationProps {
  onSuccess: (user: any) => void
}

export function CommerceRegistration({ onSuccess }: CommerceRegistrationProps) {
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    cnpj: '',
    phone: '',
    address: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const { signUp, loading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.businessName || !formData.cnpj || !formData.email || !formData.password) {
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
        'commerce',
        {
          name: formData.businessName,
          cnpj: formData.cnpj,
          address: formData.address,
          phone: formData.phone,
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
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
          <Storefront className="w-6 h-6 text-primary-foreground" />
        </div>
        <CardTitle>Cadastro de Comerciante</CardTitle>
        <CardDescription>
          Registre sua empresa para acessar nossa rede de entregadores
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome do Responsável *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Seu nome completo"
              />
            </div>
            <div>
              <Label htmlFor="businessName">Nome da Empresa *</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                placeholder="Nome do estabelecimento"
              />
            </div>
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
                placeholder="contato@empresa.com"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Endereço Completo *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              placeholder="Rua, número, bairro, cidade"
              required
            />
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