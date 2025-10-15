import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Bell, Check, CheckCircle, X, ChatCircle, Motorcycle, Storefront } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface Notification {
  id: string
  userId: string
  type: 'message' | 'delivery' | 'payment' | 'system'
  title: string
  message: string
  read: boolean
  createdAt: string
  fromUserId?: string
  fromUserName?: string
  fromUserType?: 'commerce' | 'motoboy'
}

interface NotificationCenterProps {
  userId: string
  userType: 'commerce' | 'motoboy'
}

export function NotificationCenter({ userId, userType }: NotificationCenterProps) {
  const [notifications, setNotifications] = useKV<Notification[]>('notifications', [])
  const [open, setOpen] = useState(false)
  const [lastCheckTime, setLastCheckTime] = useKV<number>(`last-check-${userId}`, Date.now())

  const userNotifications = (notifications || [])
    .filter(n => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const unreadCount = userNotifications.filter(n => !n.read).length
  const newNotifications = userNotifications.filter(
    n => new Date(n.createdAt).getTime() > (lastCheckTime || 0)
  )

  useEffect(() => {
    if (newNotifications.length > 0 && !open) {
      newNotifications.forEach(notification => {
        const soundEnabled = localStorage.getItem('notifications-sound') !== 'false'
        
        if (soundEnabled) {
          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUKnn77RgGwY5k9j0yHgrBSR3x/DdkEALFF+16emoVRQKR6Dg8r1sIAQog8zx2Ic2BxtovO/kmk0MDlCp5/CyYBoGOJPY9Mh5KwUkd8fw3ZBADBRftOrpqFQTCkag4PK9bB8EKIPLb3lGbCAAAAAASUVORk5CYII=')
          audio.volume = 0.3
          audio.play().catch(() => {})
        }

        toast(notification.title, {
          description: notification.message,
          icon: notification.type === 'message' ? <ChatCircle className="w-5 h-5" /> : <Bell className="w-5 h-5" />,
          action: {
            label: 'Ver',
            onClick: () => setOpen(true)
          }
        })
      })
    }
  }, [notifications, userId])

  const markAsRead = (notificationId: string) => {
    setNotifications((current) =>
      (current || []).map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications((current) =>
      (current || []).map(n =>
        n.userId === userId ? { ...n, read: true } : n
      )
    )
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications((current) =>
      (current || []).filter(n => n.id !== notificationId)
    )
  }

  const clearAll = () => {
    setNotifications((current) =>
      (current || []).filter(n => n.userId !== userId)
    )
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (isOpen) {
      setLastCheckTime(Date.now())
    }
  }

  const getNotificationIcon = (notification: Notification) => {
    switch (notification.type) {
      case 'message':
        return <ChatCircle className="w-5 h-5 text-blue-500" />
      case 'delivery':
        return <Motorcycle className="w-5 h-5 text-accent" />
      case 'payment':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" />
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
              variant="destructive"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notificações</CardTitle>
              {userNotifications.length > 0 && (
                <div className="flex gap-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="h-8 text-xs"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Marcar todas
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAll}
                    className="h-8 text-xs text-destructive hover:text-destructive"
                  >
                    Limpar tudo
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <ScrollArea className="h-[400px]">
            {userNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  Nenhuma notificação ainda
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {userNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 hover:bg-muted/50 transition-colors cursor-pointer relative",
                      !notification.read && "bg-blue-50/50"
                    )}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteNotification(notification.id)
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <div className="flex gap-3 pr-8">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm">{notification.title}</h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        {notification.fromUserName && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                            {notification.fromUserType === 'commerce' ? (
                              <Storefront className="w-3 h-3" />
                            ) : (
                              <Motorcycle className="w-3 h-3" />
                            )}
                            <span>{notification.fromUserName}</span>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {new Date(notification.createdAt).toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
