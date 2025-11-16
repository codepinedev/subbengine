import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import type { ReactNode } from 'react'
import type { Socket } from 'socket.io-client'

export interface ServerToClientEvents {
  'leaderboard:updated': (data: { leaderboardId: string }) => void
  'score:updated': (data: {
    leaderboardId: string
    playerId: string
    newScore: number
  }) => void
  'player:joined': (data: { leaderboardId: string; playerId: string }) => void
  'player:removed': (data: { leaderboardId: string; playerId: string }) => void
  connect: () => void
  disconnect: () => void
  connect_error: (error: Error) => void
}

export interface ClientToServerEvents {
  'join:leaderboard': (leaderboardId: string) => void
  'leave:leaderboard': (leaderboardId: string) => void
}

type WebSocketContextType = {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null
  isConnected: boolean
  isReconnecting: boolean
  error: Error | null
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  isConnected: false,
  isReconnecting: false,
  error: null,
})

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext)
  return context
}

interface WebSocketProviderProps {
  children: ReactNode
  url?: string // WebSocket server URL
  enabled?: boolean // Control when to connect (e.g., only when authenticated)
}

export function WebSocketProvider({
  children,
  url = 'http://localhost:9999', // Your backend URL
  enabled = true,
}: WebSocketProviderProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [isReconnecting, setIsReconnecting] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const socketRef = useRef<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null)

  useEffect(() => {
    if (!enabled) {
      // Disconnect if disabled
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
        setIsConnected(false)
      }
      return
    }

    // Create socket connection
    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(url, {
      withCredentials: true, // Important for cookie-based auth
      transports: ['websocket', 'polling'], // Try WebSocket first, fallback to polling
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    })

    socketRef.current = socket

    // Connection event handlers
    socket.on('connect', () => {
      console.log('✅ WebSocket connected:', socket.id)
      setIsConnected(true)
      setIsReconnecting(false)
      setError(null)
    })

    socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket disconnected:', reason)
      setIsConnected(false)
      if (reason === 'io server disconnect') {
        // Server disconnected, try to reconnect
        socket.connect()
      }
    })

    socket.on('connect_error', (err) => {
      console.error('🔴 WebSocket connection error:', err)
      setError(err)
      setIsReconnecting(true)
    })

    socket.io.on('reconnect_attempt', () => {
      console.log('🔄 Attempting to reconnect...')
      setIsReconnecting(true)
    })

    socket.io.on('reconnect', () => {
      console.log('✅ Reconnected successfully')
      setIsReconnecting(false)
      setError(null)
    })

    socket.io.on('reconnect_failed', () => {
      console.error('❌ Reconnection failed')
      setError(new Error('Failed to reconnect'))
      setIsReconnecting(false)
    })

    // Cleanup on unmount
    return () => {
      console.log('🧹 Cleaning up WebSocket connection')
      socket.disconnect()
      socketRef.current = null
    }
  }, [url, enabled])

  const value = {
    socket: socketRef.current,
    isConnected,
    isReconnecting,
    error,
  }

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  )
}
