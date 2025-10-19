import { useLocalStorage } from '@/hooks/use-local-storage'

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

export function useNotifications() {
  const [notifications, setNotifications] = useLocalStorage<Notification[]>('notifications', [])

  const sendNotification = (
    userId: string,
    type: Notification['type'],
    title: string,
    message: string,
    fromUserId?: string,
    fromUserName?: string,
    fromUserType?: 'commerce' | 'motoboy'
  ) => {
    const notification: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type,
      title,
      message,
      read: false,
      createdAt: new Date().toISOString(),
      fromUserId,
      fromUserName,
      fromUserType
    }

    setNotifications((current) => [...(current || []), notification])
    return notification
  }

  return {
    notifications,
    sendNotification
  }
}
