import { useState, useEffect, useMemo } from 'react'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  MagnifyingGlass, 
  ChatCircle, 
  ClockCounterClockwise,
  Motorcycle,
  Storefront,
  X,
  CalendarBlank,
  Funnel
} from '@phosphor-icons/react'
import { ChatDialog } from '@/components/notifications/ChatDialog'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderType: 'commerce' | 'motoboy'
  message: string
  createdAt: string
  read: boolean
}

interface ChatHistoryProps {
  currentUser: any
  currentUserType: 'commerce' | 'motoboy'
}

export function ChatHistory({ currentUser, currentUserType }: ChatHistoryProps) {
  const [messages] = useLocalStorage<Message[]>('chat-messages', [])
  const [registeredUsers] = useLocalStorage<any[]>('registered-users', [])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all')
  const [userTypeFilter, setUserTypeFilter] = useState<'all' | 'commerce' | 'motoboy'>('all')

  const userMap = useMemo(() => {
    const map = new Map()
    ;(registeredUsers || []).forEach(user => {
      map.set(user.id, user)
    })
    return map
  }, [registeredUsers])

  const filteredMessages = useMemo(() => {
    let filtered = (messages || []).filter(msg => {
      const conversation = msg.conversationId.split('-')
      return conversation.includes(currentUser.id)
    })

    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(msg => 
        msg.message.toLowerCase().includes(search) ||
        msg.senderName.toLowerCase().includes(search)
      )
    }

    if (dateFilter !== 'all') {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

      filtered = filtered.filter(msg => {
        const msgDate = new Date(msg.createdAt)
        if (dateFilter === 'today') return msgDate >= today
        if (dateFilter === 'week') return msgDate >= weekAgo
        if (dateFilter === 'month') return msgDate >= monthAgo
        return true
      })
    }

    if (userTypeFilter !== 'all') {
      filtered = filtered.filter(msg => msg.senderType === userTypeFilter)
    }

    return filtered.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [messages, currentUser.id, searchTerm, dateFilter, userTypeFilter])

  const conversationGroups = useMemo(() => {
    const groups = new Map<string, { user: any; messages: Message[]; lastMessage: Message }>()

    filteredMessages.forEach(msg => {
      const otherId = msg.conversationId.split('-').find(id => id !== currentUser.id)
      if (!otherId) return

      const otherUser = userMap.get(otherId)
      if (!otherUser) return

      if (!groups.has(msg.conversationId)) {
        groups.set(msg.conversationId, {
          user: otherUser,
          messages: [],
          lastMessage: msg
        })
      }

      const group = groups.get(msg.conversationId)!
      group.messages.push(msg)
      
      if (new Date(msg.createdAt) > new Date(group.lastMessage.createdAt)) {
        group.lastMessage = msg
      }
    })

    return Array.from(groups.values()).sort((a, b) => 
      new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
    )
  }, [filteredMessages, currentUser.id, userMap])

  const selectedMessages = useMemo(() => {
    if (!selectedConversation) return []
    return filteredMessages
      .filter(msg => msg.conversationId === selectedConversation)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  }, [filteredMessages, selectedConversation])

  const selectedUser = useMemo(() => {
    if (!selectedConversation) return null
    const otherId = selectedConversation.split('-').find(id => id !== currentUser.id)
    return otherId ? userMap.get(otherId) : null
  }, [selectedConversation, currentUser.id, userMap])

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getUserName = (user: any) => {
    return user.type === 'commerce' ? user.businessName : user.name
  }

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (24 * 60 * 60 * 1000))

    if (days === 0) {
      return date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    } else if (days === 1) {
      return 'Ontem'
    } else if (days < 7) {
      return `${days} dias atrás`
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      })
    }
  }

  const formatFullDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const highlightText = (text: string, search: string) => {
    if (!search) return text
    
    const parts = text.split(new RegExp(`(${search})`, 'gi'))
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === search.toLowerCase() ? (
            <mark key={i} className="bg-yellow-200 dark:bg-yellow-900 text-foreground">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    )
  }

  const totalMessages = filteredMessages.length
  const totalConversations = conversationGroups.length

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ClockCounterClockwise className="w-5 h-5" />
              Histórico de Conversas
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="secondary">{totalConversations} conversas</Badge>
              <Badge variant="secondary">{totalMessages} mensagens</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar em mensagens ou nomes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setSearchTerm('')}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <CalendarBlank className="w-4 h-4 text-muted-foreground" />
              <div className="flex gap-1">
                {(['all', 'today', 'week', 'month'] as const).map((filter) => (
                  <Button
                    key={filter}
                    variant={dateFilter === filter ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDateFilter(filter)}
                  >
                    {filter === 'all' && 'Todas'}
                    {filter === 'today' && 'Hoje'}
                    {filter === 'week' && '7 dias'}
                    {filter === 'month' && '30 dias'}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Funnel className="w-4 h-4 text-muted-foreground" />
              <div className="flex gap-1">
                {(['all', 'commerce', 'motoboy'] as const).map((filter) => (
                  <Button
                    key={filter}
                    variant={userTypeFilter === filter ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setUserTypeFilter(filter)}
                  >
                    {filter === 'all' && 'Todos'}
                    {filter === 'commerce' && 'Comerciantes'}
                    {filter === 'motoboy' && 'Motoboys'}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <Tabs defaultValue="conversations" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="conversations">
                Conversas ({totalConversations})
              </TabsTrigger>
              <TabsTrigger value="all-messages">
                Todas Mensagens ({totalMessages})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="conversations" className="space-y-2">
              {conversationGroups.length === 0 ? (
                <div className="text-center py-12">
                  <ChatCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma conversa encontrada</h3>
                  <p className="text-muted-foreground">
                    {searchTerm 
                      ? 'Tente ajustar os filtros de busca' 
                      : 'Inicie uma conversa para ver o histórico'
                    }
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2 pr-4">
                    {conversationGroups.map(({ user, messages, lastMessage }) => {
                      const userName = getUserName(user)
                      const unreadCount = messages.filter(
                        m => m.senderId !== currentUser.id && !m.read
                      ).length

                      return (
                        <Card 
                          key={user.id}
                          className={cn(
                            "cursor-pointer hover:shadow-md transition-all",
                            selectedConversation === lastMessage.conversationId && "ring-2 ring-primary"
                          )}
                          onClick={() => setSelectedConversation(lastMessage.conversationId)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-10 w-10 mt-1">
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                  {getInitials(userName)}
                                </AvatarFallback>
                              </Avatar>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  {user.type === 'commerce' ? (
                                    <Storefront className="w-4 h-4 text-muted-foreground" />
                                  ) : (
                                    <Motorcycle className="w-4 h-4 text-muted-foreground" />
                                  )}
                                  <h3 className="font-semibold truncate">{userName}</h3>
                                  {unreadCount > 0 && (
                                    <Badge variant="destructive" className="h-5 px-2 text-xs">
                                      {unreadCount}
                                    </Badge>
                                  )}
                                </div>

                                <p className="text-sm text-muted-foreground truncate mb-1">
                                  {highlightText(lastMessage.message, searchTerm)}
                                </p>

                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-muted-foreground">
                                    {formatMessageTime(lastMessage.createdAt)}
                                  </span>
                                  <Badge variant="outline" className="text-xs">
                                    {messages.length} mensagens
                                  </Badge>
                                </div>
                              </div>

                              <ChatDialog
                                currentUserId={currentUser.id}
                                currentUserName={currentUser.businessName || currentUser.name}
                                currentUserType={currentUserType}
                                targetUserId={user.id}
                                targetUserName={userName}
                                targetUserType={user.type}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>

            <TabsContent value="all-messages" className="space-y-2">
              {filteredMessages.length === 0 ? (
                <div className="text-center py-12">
                  <MagnifyingGlass className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma mensagem encontrada</h3>
                  <p className="text-muted-foreground">
                    Tente ajustar os filtros ou termo de busca
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[500px]">
                  <div className="space-y-3 pr-4">
                    {filteredMessages.map((message) => {
                      const sender = userMap.get(message.senderId)
                      if (!sender) return null

                      const senderName = getUserName(sender)
                      const isCurrentUser = message.senderId === currentUser.id

                      return (
                        <Card key={message.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-8 w-8 mt-1">
                                <AvatarFallback 
                                  className={cn(
                                    isCurrentUser 
                                      ? "bg-primary text-primary-foreground" 
                                      : "bg-secondary text-secondary-foreground"
                                  )}
                                >
                                  {getInitials(senderName)}
                                </AvatarFallback>
                              </Avatar>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  {message.senderType === 'commerce' ? (
                                    <Storefront className="w-3 h-3 text-muted-foreground" />
                                  ) : (
                                    <Motorcycle className="w-3 h-3 text-muted-foreground" />
                                  )}
                                  <span className="font-semibold text-sm">{senderName}</span>
                                  {isCurrentUser && (
                                    <Badge variant="secondary" className="text-xs h-5">
                                      Você
                                    </Badge>
                                  )}
                                </div>

                                <p className="text-sm mb-2 break-words">
                                  {highlightText(message.message, searchTerm)}
                                </p>

                                <span className="text-xs text-muted-foreground">
                                  {formatFullDate(message.createdAt)}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {selectedConversation && selectedUser && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Conversa com {getUserName(selectedUser)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-3 pr-4">
                {selectedMessages.map((message) => {
                  const isCurrentUser = message.senderId === currentUser.id
                  return (
                    <div
                      key={message.id}
                      className={cn(
                        "flex flex-col gap-1",
                        isCurrentUser ? "items-end" : "items-start"
                      )}
                    >
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {!isCurrentUser && (
                          <>
                            {message.senderType === 'commerce' ? (
                              <Storefront className="w-3 h-3" />
                            ) : (
                              <Motorcycle className="w-3 h-3" />
                            )}
                            <span>{message.senderName}</span>
                          </>
                        )}
                      </div>
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-2",
                          isCurrentUser
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                        <p className="text-sm break-words">
                          {highlightText(message.message, searchTerm)}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatFullDate(message.createdAt)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
