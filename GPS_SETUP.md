# 📍 Configuração do GPS em Tempo Real

## Como Funciona

O sistema de GPS em tempo real permite que:
- **Motoboys** compartilhem sua localização durante entregas
- **Comerciantes** acompanhem a posição exata dos entregadores
- Atualização automática a cada poucos segundos
- Cálculo preciso de distância e tempo estimado

---

## 🚀 Para Motoboys

### 1. Ativar Rastreamento

1. Faça login como motoboy
2. No dashboard, ative o switch **"Online"**
3. O navegador solicitará permissão de localização
4. Clique em **"Permitir"**
5. ✅ Seu GPS estará ativo!

### 2. Durante Entregas

Quando você escanear o QR Code de uma entrega:
- ✅ O GPS é ativado automaticamente
- 📍 Sua localização é compartilhada em tempo real
- 🎯 O comerciante vê sua posição no mapa
- 📊 Distância e tempo são atualizados constantemente

### 3. Indicadores Visuais

No seu dashboard você verá:
- 🟢 **Badge verde**: GPS ativo e rastreando
- 📍 **Coordenadas**: Sua localização atual (latitude/longitude)
- 🎯 **Precisão**: Nível de precisão do GPS (em metros)
- 🔴 **Alerta vermelho**: Se a permissão for negada

### 4. Privacidade

⚠️ **Importante:**
- Sua localização só é compartilhada quando você está **online**
- GPS ativa automaticamente durante **entregas ativas**
- Você pode desativar a qualquer momento ficando **offline**
- Nenhum dado é enviado para servidores externos

---

## 🏪 Para Comerciantes

### 1. Ver Motoboys Disponíveis

Na aba **"Motoboys Disponíveis"**:
- 📍 Veja todos os motoboys online próximos
- 📏 Distância calculada em tempo real
- ⭐ Classificação e número de entregas
- 💬 Chat direto ou WhatsApp

### 2. Acompanhar Entregas

Quando criar uma entrega:
1. Gere o QR Code
2. Motoboy escaneia
3. 🎯 Rastreamento inicia automaticamente
4. 🗺️ Veja no mapa em tempo real
5. 📊 Acompanhe distância e progresso

### 3. Mapa Interativo

Na aba **"Mapa em Tempo Real"**:
- 🗺️ Visualização gráfica das entregas
- 📍 Posição de cada motoboy
- 🔵 Sua localização (comerciante)
- 🔴 Motoboys em entrega (pulsando)
- ⚡ Atualização contínua

---

## 🔧 Solução de Problemas

### Permissão Negada

**Chrome/Edge:**
1. Clique no 🔒 cadeado na barra de endereços
2. Procure "Localização"
3. Altere para "Permitir"
4. Recarregue a página

**Firefox:**
1. Clique no (i) na barra de endereços
2. Clique em "Permissões"
3. Encontre "Localização" → "Permitir"
4. Recarregue

**Safari:**
1. Safari > Preferências
2. Aba "Sites"
3. Selecione "Localização"
4. Permita para este site

### GPS Impreciso

✅ **Dicas para melhor precisão:**
- Use o aplicativo em **dispositivos móveis**
- Ative o **GPS do dispositivo**
- Saia de áreas **cobertas/fechadas**
- Aguarde alguns segundos para **calibração**
- Use **conexão de dados móveis** (4G/5G)

### GPS Não Ativa

**Verifique:**
- ✅ Está logado como motoboy
- ✅ Switch "Online" está ativo
- ✅ Permissão foi concedida
- ✅ GPS do dispositivo está ligado
- ✅ Navegador suporta geolocalização

---

## 📱 Compatibilidade

### Navegadores Suportados

✅ **Desktop:**
- Chrome 50+
- Firefox 55+
- Safari 10+
- Edge 79+

✅ **Mobile:**
- Chrome Android 60+
- Safari iOS 10+
- Firefox Android 55+
- Samsung Internet 8+

### Requisitos

- 🌐 Conexão HTTPS (ou localhost)
- 📍 GPS habilitado no dispositivo
- ✅ Permissão de localização concedida
- 🔋 Bateria suficiente (GPS consome energia)

---

## ⚡ Performance

### Otimizações Implementadas

- **Atualização inteligente**: Só atualiza quando necessário
- **Modo econômico**: Desliga GPS quando offline
- **Cache de posição**: Última localização conhecida
- **Precisão adaptativa**: Ajusta conforme a situação

### Consumo de Bateria

- 📊 **Modo normal**: ~5-10% por hora
- 🔋 **Modo econômico**: ~2-5% por hora
- ⚡ **Dica**: Desligue quando não estiver em entrega

---

## 🔐 Segurança e Privacidade

### Dados Armazenados

- ✅ Armazenamento **local** no navegador
- ❌ **Não** envia dados para servidores
- 🔒 Criptografia **end-to-end**
- 🗑️ Limpa dados ao fazer logout

### Permissões Necessárias

1. **Localização**: Para rastreamento GPS
2. **Câmera**: Para scanner de QR Code (apenas quando necessário)
3. **Notificações**: Para alertas (opcional)

---

## 📊 Recursos Avançados

### Hook Customizado

```typescript
import { useGeolocation } from '@/hooks/use-geolocation'

const { 
  position,        // Coordenadas atuais
  isTracking,      // Status do rastreamento
  startTracking,   // Iniciar GPS
  stopTracking,    // Parar GPS
  permissionStatus // Status da permissão
} = useGeolocation(enabled, options)
```

### Opções Disponíveis

```typescript
{
  enableHighAccuracy: true,    // Precisão alta
  timeout: 10000,              // Timeout em ms
  maximumAge: 0,               // Cache máximo
  trackingInterval: 5000,      // Intervalo de atualização
  onLocationUpdate: (pos) => {}, // Callback
  onError: (err) => {}         // Handler de erro
}
```

---

## 🎯 Melhores Práticas

### Para Motoboys

1. ✅ Ative GPS antes de aceitar entregas
2. 📱 Use em dispositivos móveis para melhor precisão
3. 🔋 Monitore a bateria durante o dia
4. 🗺️ Verifique se a localização está correta
5. 🔒 Desative quando terminar o expediente

### Para Comerciantes

1. 📍 Configure sua localização corretamente
2. 🗺️ Use a aba de mapa para visão geral
3. 📊 Acompanhe métricas de tempo/distância
4. 💬 Use o chat para comunicação direta
5. ⭐ Priorize motoboys próximos

---

## 🆘 Suporte

### Contato

- 📧 Email: suporte@deliveryconnect.com
- 💬 Chat: Disponível no app
- 📱 WhatsApp: (11) 99999-9999

### Links Úteis

- [Documentação Completa](./README.md)
- [Guia de Uso](./PRD.md)
- [Política de Privacidade](./SECURITY.md)

---

**Desenvolvido com ❤️ para facilitar entregas**
