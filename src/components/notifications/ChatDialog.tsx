import { useState, useEffect, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ChatCircle, PaperPlaneRight, Motorcycle, Storefront } from '@phosphor-icons/react'
import { useNotifications } from '@/hooks/use-notifications'
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

interface ChatDialogProps {
  currentUserId: string
  currentUserName: string
  currentUserType: 'commerce' | 'motoboy'
  targetUserId: string
  targetUserName: string
  targetUserType: 'commerce' | 'motoboy'
  trigger?: React.ReactNode
}

export function ChatDialog({
  currentUserId,
  currentUserName,
  currentUserType,
  targetUserId,
  targetUserName,
  targetUserType,
  trigger
}: ChatDialogProps) {
  const [messages, setMessages] = useKV<Message[]>('chat-messages', [])
  const [newMessage, setNewMessage] = useState('')
  const [open, setOpen] = useState(false)
  const { sendNotification } = useNotifications()
  const scrollRef = useRef<HTMLDivElement>(null)

  const conversationId = [currentUserId, targetUserId].sort().join('-')

  const conversationMessages = (messages || [])
    .filter(m => m.conversationId === conversationId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

  const unreadCount = conversationMessages.filter(
    m => m.senderId !== currentUserId && !m.read
  ).length

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [conversationMessages, open])

  useEffect(() => {
    if (open) {
      setMessages((current) =>
        (current || []).map(m =>
          m.conversationId === conversationId && m.senderId !== currentUserId
            ? { ...m, read: true }
            : m
        )
      )
    }
  }, [open, conversationId, currentUserId])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      conversationId,
      senderId: currentUserId,
      senderName: currentUserName,
      senderType: currentUserType,
      message: newMessage.trim(),
      createdAt: new Date().toISOString(),
      read: false
    }

    setMessages((current) => [...(current || []), message])

    sendNotification(
      targetUserId,
      'message',
      `Nova mensagem de ${currentUserName}`,
      newMessage.trim(),
      currentUserId,
      currentUserName,
      currentUserType
    )

    setNewMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="relative">
            <ChatCircle className="w-4 h-4 mr-2" />
            Mensagem
            {unreadCount > 0 && (
              <Badge 
                className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                variant="destructive"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            {targetUserType === 'commerce' ? (
              <Storefront className="w-5 h-5" />
            ) : (
              <Motorcycle className="w-5 h-5" />
            )}
            {targetUserName}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6" ref={scrollRef}>
          <div className="py-4 space-y-4">
            {conversationMessages.length === 0 ? (
              <div className="text-center py-12">
                <ChatCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  Nenhuma mensagem ainda. Inicie a conversa!
                </p>
              </div>
            ) : (
              conversationMessages.map((message) => {
                const isCurrentUser = message.senderId === currentUserId
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
                      <p className="text-sm break-words">{message.message}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(message.createdAt).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                )
              })
            )}
          </div>
        </ScrollArea>

        <div className="border-t px-6 py-4">
          <div className="flex gap-2">
            <Input
              placeholder="Digite sua mensagem..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              size="icon"
            >
              <PaperPlaneRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
