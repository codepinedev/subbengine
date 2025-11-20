import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from '../lib/socket/socket.types'
import { queryClient } from '@/api/query-client'

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>
const SOCKET_URL = 'http://localhost:9999'

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [isConnecting, setIsConnecting] = useState<boolean>(false)

  const socketRef = useRef<TypedSocket | null>(null)

  useEffect(() => {
    setIsConnecting(true)

    const socket: TypedSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    })

    socketRef.current = socket
    socket.on('connect', () => {
      setIsConnected(true)
      setIsConnecting(false)
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    socket.on('connect_error', () => {
      setIsConnecting(false)
    })

    socket.on('score:updated', ({ leaderboardId }) => {
      queryClient.invalidateQueries(
        {
          queryKey: ['getLeaderboardPlayers', leaderboardId],
        },
        { cancelRefetch: false },
      )
    })


    return () => {
      console.log('Disconnecting Websocket')
      socket.disconnect()
    }
  }, [])

  const joinLeaderboard = (leaderboardId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('join:leaderboard', leaderboardId)
      console.log('📊 Joined leaderboard:', leaderboardId)
    }
  }

  const leaveLeaderboard = (leaderboardId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('leave:leaderboard', leaderboardId)
      console.log('👋 Left leaderboard:', leaderboardId)
    }
  }

  return {
    joinLeaderboard,
    leaveLeaderboard,
    isConnecting,
    isConnected,
    socket: socketRef.current,
  }
}
