import { QRCodeSVG } from 'qrcode.react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, CheckCircle } from '@phosphor-icons/react'

interface QRCodeDisplayProps {
  deliveryId: string
  commerceName: string
  address: string
  value: number
  status: 'pending' | 'collected' | 'in_progress' | 'completed'
}

export function QRCodeDisplay({ deliveryId, commerceName, address, value, status }: QRCodeDisplayProps) {
  const qrData = JSON.stringify({
    deliveryId,
    commerceName,
    address,
    value,
    timestamp: Date.now()
  })

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          QR Code da Entrega
        </CardTitle>
        <CardDescription>
          Mostre este código para o motoboy autorizar a coleta
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === 'pending' ? (
          <>
            <div className="flex justify-center p-6 bg-white rounded-lg">
              <QRCodeSVG 
                value={qrData} 
                size={200}
                level="H"
                includeMargin
              />
            </div>
            <div className="space-y-2 text-sm">
              <p><strong>Pedido:</strong> #{deliveryId}</p>
              <p><strong>Endereço:</strong> {address}</p>
              <p><strong>Valor:</strong> R$ {value.toFixed(2)}</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-800 text-sm font-medium">
                ⚠️ Aguardando motoboy escanear o código para iniciar entrega
              </p>
            </div>
          </>
        ) : status === 'collected' || status === 'in_progress' ? (
          <div className="flex flex-col items-center justify-center p-8 bg-green-50 rounded-lg">
            <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              Entrega Autorizada!
            </h3>
            <p className="text-green-700 text-center">
              O motoboy coletou o pedido e está a caminho
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 bg-blue-50 rounded-lg">
            <CheckCircle className="w-16 h-16 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Entrega Concluída!
            </h3>
            <p className="text-blue-700 text-center">
              Esta entrega foi finalizada com sucesso
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
