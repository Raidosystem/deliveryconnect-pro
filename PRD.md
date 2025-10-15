# DeliveryConnect - Product Requirements Document

Plataforma digital que conecta comerciantes a motoboys para entregas sob demanda, com pagamentos integrados e rastreamento em tempo real.

**Experience Qualities**:
1. **Eficiência**: Interface intuitiva que permite cadastros rápidos e acompanhamento simplificado das entregas
2. **Transparência**: Visibilidade total dos ganhos, entregas realizadas e localização em tempo real
3. **Confiabilidade**: Sistema robusto de pagamentos e controle financeiro integrado

**Complexity Level**: Complex Application (advanced functionality, accounts)
- Requer autenticação, geolocalização em tempo real, sistema de pagamentos, diferentes tipos de usuário e dashboard analítico

## Essential Features

### Cadastro de Comerciantes
- **Functionality**: Registro de estabelecimentos comerciais com dados básicos e CNPJ
- **Purpose**: Permitir que comerciantes acessem a rede de entregadores
- **Trigger**: Comerciante acessa "Cadastrar Empresa" na tela inicial
- **Progression**: Formulário dados básicos → Validação CNPJ → Confirmação → Dashboard comerciante
- **Success criteria**: Comerciante consegue fazer login e solicitar entregas

### Cadastro de Motoboys
- **Functionality**: Registro de entregadores com documentação e ativação de rastreamento
- **Purpose**: Formar rede de entregadores disponíveis para as demandas
- **Trigger**: Motoboy acessa "Cadastrar como Entregador"
- **Progression**: Formulário dados → Upload documentos → Ativação GPS → Dashboard motoboy
- **Success criteria**: Motoboy aparece no mapa para comerciantes quando online

### Sistema de Notificações em Tempo Real
- **Functionality**: Centro de notificações com alertas visuais e sonoros para novas mensagens e eventos
- **Purpose**: Manter usuários informados instantaneamente sobre mensagens, entregas e pagamentos
- **Trigger**: Nova mensagem recebida, mudança de status de entrega, ou pagamento processado
- **Progression**: Evento ocorre → Notificação criada → Toast exibido → Som reproduzido → Badge atualizado → Centro de notificações atualizado
- **Success criteria**: Usuários recebem notificações instantâneas com contador de não lidas e podem gerenciar notificações

### Sistema de Mensagens/Chat
- **Functionality**: Chat em tempo real entre comerciantes e motoboys com interface de conversação
- **Purpose**: Facilitar comunicação direta entre partes para coordenar entregas
- **Trigger**: Usuário clica em "Mensagem" no perfil de outro usuário ou acessa aba de Mensagens
- **Progression**: Abrir chat → Digitar mensagem → Enviar → Notificação para destinatário → Mensagem exibida → Confirmação de leitura
- **Success criteria**: Mensagens entregues instantaneamente com indicadores de não lidas e histórico completo

### Histórico de Conversas com Busca
- **Functionality**: Sistema completo de histórico de mensagens com busca avançada, filtros por data e tipo de usuário
- **Purpose**: Permitir que usuários encontrem mensagens antigas rapidamente e revisitem conversas anteriores
- **Trigger**: Usuário acessa aba "Histórico de Chat" no dashboard
- **Progression**: Abrir histórico → Aplicar filtros (data/tipo) → Buscar por texto → Ver conversas agrupadas → Clicar em conversa específica → Ver detalhes completos
- **Success criteria**: Busca instantânea retorna resultados relevantes, filtros funcionam corretamente, todas as mensagens são recuperáveis e navegáveis

### Sistema de QR Code para Autorização de Coleta
- **Functionality**: Geração de QR Code para cada entrega e scanner de câmera para motoboys autorizarem coleta
- **Purpose**: Garantir segurança e rastreabilidade do momento exato da coleta do pedido
- **Trigger**: Comerciante cria nova entrega → QR Code gerado automaticamente / Motoboy clica em "Escanear QR Code"
- **Progression**: Comerciante cria entrega → QR Code exibido → Motoboy abre scanner → Aponta câmera → Código lido → Entrega autorizada → Rastreamento ativado automaticamente
- **Success criteria**: QR Code gerado instantaneamente, scanner funciona em dispositivos móveis, autorização registrada com timestamp, rastreamento iniciado automaticamente

### Rastreamento em Tempo Real Pós-Coleta
- **Functionality**: Visualização automática da localização do motoboy após escaneamento do QR Code
- **Purpose**: Permitir que comerciante acompanhe a entrega desde a coleta até a finalização
- **Trigger**: Motoboy escaneia QR Code com sucesso
- **Progression**: QR escaneado → Status muda para "coletado" → Após 2s muda para "em rota" → Localização GPS atualiza a cada 5s → Comerciante vê no mapa em tempo real → Timeline de progresso atualizada
- **Success criteria**: Comerciante visualiza localização do motoboy em tempo real, interface mostra distância estimada, timeline de progresso clara e intuitiva

### Rastreamento em Tempo Real
- **Functionality**: Visualização da localização do motoboy durante a entrega
- **Purpose**: Transparência e controle para comerciante e cliente final
- **Trigger**: Entrega aceita pelo motoboy
- **Progression**: Motoboy aceita → GPS ativo → Mapa atualiza → Notificações de status
- **Success criteria**: Comerciante vê localização em tempo real até finalização

### Sistema de Pagamentos
- **Functionality**: Processamento de pagamentos do comerciante para admin e redistribuição para motoboys
- **Purpose**: Facilitar transações e eliminar necessidade de dinheiro físico
- **Trigger**: Comerciante confirma pagamento no app
- **Progression**: Seleção entrega → Valor → Pagamento → Admin recebe → Repasse motoboy
- **Success criteria**: Valores creditados corretamente para todas as partes

### Dashboard de Ganhos
- **Functionality**: Controle detalhado de entregas realizadas e valores por período
- **Purpose**: Permitir que motoboys acompanhem rendimentos e comerciantes analisem economia
- **Trigger**: Acesso à seção "Meus Ganhos" ou "Relatórios"
- **Progression**: Login → Dashboard → Filtros período → Visualização dados → Exportação
- **Success criteria**: Dados precisos de entregas e valores para tomada de decisão

## Edge Case Handling

- **GPS indisponível**: Sistema offline com estimativas baseadas no último local conhecido
- **Pagamento falhou**: Retry automático e notificação com opções alternativas
- **Motoboy cancela entrega**: Redistribuição automática para outros entregadores disponíveis
- **Dados inválidos no cadastro**: Validação em tempo real com sugestões de correção
- **Múltiplas entregas simultâneas**: Queue system com priorização por proximidade
- **Mensagem não entregue**: Armazenamento local e retry automático quando conexão restaurada
- **Notificações perdidas**: Sistema de sincronização que recupera notificações não visualizadas
- **Usuário offline durante conversa**: Mensagens armazenadas e entregues quando retornar online
- **Busca sem resultados**: Sugestões de ajuste de filtros e indicação clara de ausência de mensagens
- **Grande volume de mensagens**: Paginação e scroll infinito para performance otimizada
- **Câmera não disponível**: Detecção de permissões e instruções claras para habilitar acesso
- **QR Code inválido**: Validação e mensagem clara de erro
- **Coleta duplicada**: Verificação de status para prevenir escaneamento múltiplo
- **GPS desabilitado durante entrega**: Fallback para última localização conhecida com aviso visual
- **Perda de conexão durante rastreamento**: Modo offline com última posição e estimativa de tempo

## Design Direction

O design deve transmitir profissionalismo e eficiência, inspirado em apps de transporte como Uber, com interface limpa que prioriza informações essenciais como mapas, status de entrega e valores financeiros.

## Color Selection

Complementary (opposite colors) - Azul profissional contrastando com laranja energético para CTAs, criando sensação de confiança e dinamismo.

- **Primary Color**: Azul corporativo `oklch(0.45 0.15 250)` - transmite confiança e profissionalismo
- **Secondary Colors**: Cinza moderno `oklch(0.65 0.02 250)` para elementos de apoio e texto secundário
- **Accent Color**: Laranja vibrante `oklch(0.65 0.18 45)` para botões de ação e alertas importantes
- **Foreground/Background Pairings**: 
  - Background (Branco `oklch(0.98 0 0)`): Texto escuro `oklch(0.2 0 0)` - Ratio 14.8:1 ✓
  - Primary (Azul `oklch(0.45 0.15 250)`): Texto branco `oklch(0.98 0 0)` - Ratio 7.2:1 ✓
  - Accent (Laranja `oklch(0.65 0.18 45)`): Texto branco `oklch(0.98 0 0)` - Ratio 4.9:1 ✓

## Font Selection

Tipografia moderna e legível que funcione bem em dispositivos móveis, priorizando clareza para informações financeiras e de localização.

- **Typographic Hierarchy**: 
  - H1 (Títulos principais): Inter Bold/32px/tight spacing
  - H2 (Seções): Inter SemiBold/24px/normal spacing  
  - H3 (Subsections): Inter Medium/18px/normal spacing
  - Body (Texto geral): Inter Regular/16px/relaxed spacing
  - Small (Detalhes): Inter Regular/14px/normal spacing

## Animations

Animações sutis que reforçam ações do usuário sem atrasar o fluxo, especialmente importantes para feedback de pagamentos e atualizações de localização.

- **Purposeful Meaning**: Micro-interações para confirmação de pagamentos e transições suaves no mapa
- **Hierarchy of Movement**: Prioridade para animações de status de entrega e notificações importantes

## Component Selection

- **Components**: Card para perfis de motoboy e exibição de entregas, Dialog para confirmações de pagamento e chat, Form para cadastros, Badge para status e contadores de notificações, Table para relatórios financeiros, Popover para centro de notificações, ScrollArea para lista de mensagens, Tabs para organização de histórico de conversas, Input com ícone de busca para pesquisa de mensagens, QRCodeSVG para geração de códigos, Video e Canvas para scanner de câmera
- **Customizations**: MapView component customizado, RealtimeTracker, PaymentFlow, NotificationCenter com badges dinâmicos, ChatDialog com interface de mensagens instantâneas, ChatHistory com busca avançada e filtros, sistema de highlight para resultados de busca, QRCodeDisplay para mostrar código ao comerciante, QRCodeScanner com acesso à câmera e detecção jsQR, DeliveryTracking com timeline de progresso e localização em tempo real
- **States**: Botões com estados de loading para pagamentos, inputs com validação em tempo real, indicadores visuais de mensagens não lidas, badges de contagem de notificações, filtros ativos visualmente distintos, mensagens destacadas quando encontradas na busca, QR Code com estados (aguardando/coletado/em rota), scanner com estados (inativo/permissão negada/escaneando), timeline de entrega com indicadores visuais de progresso
- **Icon Selection**: Phosphor icons - MapPin para localização, CreditCard para pagamentos, Motorcycle para entregadores, ChatCircle para mensagens, Bell para notificações, ClockCounterClockwise para histórico, MagnifyingGlass para busca, Funnel para filtros, CalendarBlank para filtros de data, QrCode para scanner, Camera para acesso à câmera, CheckCircle para confirmações, Package para entregas
- **Spacing**: Sistema 4px base (4, 8, 16, 24, 32px) para consistência visual
- **Mobile**: Layout responsivo com prioridade mobile-first, mapas ocupando 70% da tela em dispositivos móveis, chat em dialog fullscreen no mobile, histórico de conversas em layout vertical adaptativo, QR Code dimensionado para telas pequenas, scanner fullscreen em mobile com controles grandes