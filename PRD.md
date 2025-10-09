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

- **Components**: Card para perfis de motoboy, Dialog para confirmações de pagamento, Form para cadastros, Badge para status, Table para relatórios financeiros
- **Customizations**: MapView component customizado, RealtimeTracker, PaymentFlow
- **States**: Botões com estados de loading para pagamentos, inputs com validação em tempo real
- **Icon Selection**: Phosphor icons - MapPin para localização, CreditCard para pagamentos, Motorcycle para entregadores
- **Spacing**: Sistema 4px base (4, 8, 16, 24, 32px) para consistência visual
- **Mobile**: Layout responsivo com prioridade mobile-first, mapas ocupando 70% da tela em dispositivos móveis