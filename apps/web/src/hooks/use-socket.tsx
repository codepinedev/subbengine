import { useEffect, useRef, useState } from "react"
import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client';
import type { ClientToServerEvents, ServerToClientEvents } from '../lib/socket/socket.types'


type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>
const SOCKET_URL = "http://localhost:9999"

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
      reconnectionAttempts: 5
    })
    socketRef.current = socket;
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

    return () => {
      console.log('Disconnecting Websocket')
      socket.disconnect();
    }
  }, [])



  return {
    isConnecting,
    isConnected,
    socketRef
  }
}
