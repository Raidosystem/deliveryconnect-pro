import { useState, useEffect } from 'react'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ChatCircle, MagnifyingGlass, Motorcycle, Storefront } from '@phosphor-icons/react'
import { ChatDialog } from '@/components/notifications/ChatDialog'

interface MessagesTabProps {
  currentUser: any
  currentUserType: 'commerce' | 'motoboy'
}

export function MessagesTab({ currentUser, currentUserType }: MessagesTabProps) {
  const [registeredUsers] = useLocalStorage<any[]>('registered-users', [])
  const [messages] = useLocalStorage<any[]>('chat-messages', [])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])

  useEffect(() => {
    const otherUsers = (registeredUsers || []).filter(
      user => user.id !== currentUser.id
    )

    const searchFiltered = searchTerm
      ? otherUsers.filter(user => {
          const name = user.type === 'commerce' ? user.businessName : user.name
          return name.toLowerCase().includes(searchTerm.toLowerCase())
        })
      : otherUsers

    const usersWithMessages = searchFiltered.map(user => {
      const conversationId = [currentUser.id, user.id].sort().join('-')
      const userMessages = (messages || []).filter(m => m.conversationId === conversationId)
      const unreadCount = userMessages.filter(
        m => m.senderId !== currentUser.id && !m.read
      ).length
      const lastMessage = userMessages.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0]

      return {
        ...user,
        unreadCount,
        lastMessage,
        lastMessageTime: lastMessage ? new Date(lastMessage.createdAt).getTime() : 0
      }
    })

    const sortedUsers = usersWithMessages.sort((a, b) => {
      if (a.unreadCount > 0 && b.unreadCount === 0) return -1
      if (a.unreadCount === 0 && b.unreadCount > 0) return 1
      return b.lastMessageTime - a.lastMessageTime
    })

    setFilteredUsers(sortedUsers)
  }, [registeredUsers, messages, currentUser.id, searchTerm])

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getUserName = (user: any) => {
    return user.type === 'commerce' ? user.businessName : user.name
  }

  const formatLastMessageTime = (timestamp: number) => {
    if (!timestamp) return ''
    
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Agora'
    if (minutes < 60) return `${minutes}min`
    if (hours < 24) return `${hours}h`
    if (days < 7) return `${days}d`
    
    return new Date(timestamp).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    })
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar usuários..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <ChatCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm ? 'Nenhum usuário encontrado' : 'Nenhum usuário disponível'}
            </h3>
            <p className="text-muted-foreground">
              {searchTerm 
                ? 'Tente buscar por outro nome' 
                : 'Aguarde outros usuários se cadastrarem'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredUsers.map((user) => {
            const userName = getUserName(user)
            
            return (
              <Card key={user.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getInitials(userName)}
                          </AvatarFallback>
                        </Avatar>
                        {user.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {user.type === 'commerce' ? (
                            <Storefront className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <Motorcycle className="w-4 h-4 text-muted-foreground" />
                          )}
                          <h3 className="font-semibold truncate">{userName}</h3>
                          {user.unreadCount > 0 && (
                            <Badge variant="destructive" className="h-5 px-2 text-xs">
                              {user.unreadCount > 9 ? '9+' : user.unreadCount}
                            </Badge>
                          )}
                        </div>
                        
                        {user.lastMessage && (
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-muted-foreground truncate flex-1">
                              {user.lastMessage.message}
                            </p>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {formatLastMessageTime(user.lastMessageTime)}
                            </span>
                          </div>
                        )}
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
      )}
    </div>
  )
}
