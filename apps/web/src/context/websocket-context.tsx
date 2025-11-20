import { createContext, useContext } from 'react'
import type { ReactNode }  from 'react'
import type { Socket } from 'socket.io-client'
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@/lib/socket/socket.types'
import { useSocket } from '@/hooks/use-socket'

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>

interface SocketContextType {
  socket: TypedSocket | null
  isConnected: boolean
  isConnecting: boolean
  joinLeaderboard: (leaderboardId: string) => void
  leaveLeaderboard: (leaderboardId: string) => void
}

const SocketContext = createContext<SocketContextType | null>(null)

export function SocketProvider({ children }: { children: ReactNode }) {
  const socketState = useSocket()
  return (
    <SocketContext.Provider value={socketState}>
      {children}
    </SocketContext.Provider>
  )
}


export function useSocketContext(){
  const context = useContext(SocketContext)
  if(!context)
    throw new Error('useSocketContext must be used within a SocketProvider')

  return context;
}
