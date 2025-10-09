import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface AuthFormProps {
  onLogin: (user: any, type: 'commerce' | 'motoboy') => void
}

export function AuthForm({ onLogin }: AuthFormProps) {
  const [cnpj, setCnpj] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [registeredUsers] = useKV<any[]>('registered-users', [])

  const handleLogin = async () => {
    if (!cnpj.trim()) {
      toast.error('Digite o CNPJ para fazer login')
      return
    }

    setIsLoading(true)
    
    const user = registeredUsers?.find(u => u.cnpj === cnpj.trim())
    
    if (user) {
      toast.success(`Bem-vindo de volta, ${user.name}!`)
      onLogin(user, user.type)
    } else {
      toast.error('CNPJ não encontrado. Faça seu cadastro primeiro.')
    }
    
    setIsLoading(false)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Já tem conta?</CardTitle>
        <CardDescription>
          Faça login com seu CNPJ
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Input
            id="cnpj"
            placeholder="Digite seu CNPJ"
            value={cnpj}
            onChange={(e) => setCnpj(e.target.value)}
            maxLength={18}
          />
        </div>
        <Button 
          className="w-full" 
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </Button>
      </CardContent>
    </Card>
  )
}