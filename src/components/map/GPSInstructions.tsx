import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { MapPin, CheckCircle, XCircle, Question } from '@phosphor-icons/react'

interface GPSInstructionsProps {
  permissionStatus: 'granted' | 'denied' | 'prompt' | 'unknown'
  isTracking: boolean
}

export function GPSInstructions({ permissionStatus, isTracking }: GPSInstructionsProps) {
  const getStatusIcon = () => {
    switch (permissionStatus) {
      case 'granted':
        return <CheckCircle className="w-6 h-6 text-green-600" />
      case 'denied':
        return <XCircle className="w-6 h-6 text-red-600" />
      default:
        return <Question className="w-6 h-6 text-yellow-600" />
    }
  }

  const getStatusBadge = () => {
    switch (permissionStatus) {
      case 'granted':
        return <Badge className="bg-green-100 text-green-800">Autorizado</Badge>
      case 'denied':
        return <Badge variant="destructive">Negado</Badge>
      case 'prompt':
        return <Badge className="bg-yellow-100 text-yellow-800">Aguardando</Badge>
      default:
        return <Badge variant="secondary">Desconhecido</Badge>
    }
  }

  const getBrowserInstructions = () => {
    const userAgent = navigator.userAgent.toLowerCase()
    
    if (userAgent.includes('chrome') || userAgent.includes('chromium')) {
      return {
        browser: 'Chrome',
        steps: [
          'Clique no ícone de cadeado 🔒 na barra de endereços',
          'Procure por "Localização" nas permissões',
          'Altere para "Permitir"',
          'Recarregue a página'
        ]
      }
    } else if (userAgent.includes('firefox')) {
      return {
        browser: 'Firefox',
        steps: [
          'Clique no ícone de informações (i) na barra de endereços',
          'Clique em "Permissões"',
          'Encontre "Localização" e marque "Permitir"',
          'Recarregue a página'
        ]
      }
    } else if (userAgent.includes('safari')) {
      return {
        browser: 'Safari',
        steps: [
          'Vá em Safari > Preferências',
          'Clique na aba "Sites"',
          'Selecione "Localização" na barra lateral',
          'Encontre este site e altere para "Permitir"'
        ]
      }
    } else if (userAgent.includes('edg')) {
      return {
        browser: 'Edge',
        steps: [
          'Clique no ícone de cadeado na barra de endereços',
          'Clique em "Permissões para este site"',
          'Altere "Localização" para "Permitir"',
          'Recarregue a página'
        ]
      }
    }

    return {
      browser: 'seu navegador',
      steps: [
        'Acesse as configurações do navegador',
        'Procure por configurações de privacidade ou permissões',
        'Encontre as permissões de localização',
        'Permita o acesso para este site'
      ]
    }
  }

  const instructions = getBrowserInstructions()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle>Status do GPS</CardTitle>
              <CardDescription>
                Rastreamento em tempo real
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {getStatusIcon()}
            {getStatusBadge()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Atual */}
        <Alert className={
          permissionStatus === 'granted' 
            ? 'bg-green-50 border-green-200' 
            : permissionStatus === 'denied'
            ? 'bg-red-50 border-red-200'
            : 'bg-yellow-50 border-yellow-200'
        }>
          <AlertDescription>
            {permissionStatus === 'granted' && isTracking && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="font-medium text-green-800">
                  GPS ativo e rastreando sua localização em tempo real
                </span>
              </div>
            )}
            {permissionStatus === 'granted' && !isTracking && (
              <span className="text-green-800">
                Permissão concedida. O rastreamento iniciará quando você aceitar uma entrega.
              </span>
            )}
            {permissionStatus === 'denied' && (
              <span className="text-red-800 font-medium">
                ⚠️ Permissão de localização negada. Siga as instruções abaixo para habilitar.
              </span>
            )}
            {permissionStatus === 'prompt' && (
              <span className="text-yellow-800">
                O navegador solicitará permissão quando necessário.
              </span>
            )}
            {permissionStatus === 'unknown' && (
              <span className="text-muted-foreground">
                Fique online para ativar o rastreamento GPS.
              </span>
            )}
          </AlertDescription>
        </Alert>

        {/* Instruções para habilitar */}
        {permissionStatus === 'denied' && (
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Como habilitar no {instructions.browser}:
            </h4>
            <ol className="space-y-2 text-sm">
              {instructions.steps.map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </span>
                  <span className="flex-1 pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Benefícios */}
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
            ✨ Benefícios do GPS em tempo real:
          </h4>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>Comerciantes veem sua localização exata durante entregas</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>Maior confiança e transparência nas entregas</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>Você aparece na lista de motoboys disponíveis</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>Atualização automática a cada poucos segundos</span>
            </li>
          </ul>
        </div>

        {/* Privacidade */}
        <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
          <p className="font-medium mb-1">🔒 Sua privacidade é importante:</p>
          <p>
            Sua localização só é compartilhada quando você está online e durante entregas ativas. 
            Você pode desativar o rastreamento a qualquer momento ficando offline.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
