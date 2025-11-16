import { createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { WebSocketProvider } from '@/context/websocket-context'

export const Route = createFileRoute('/dashboard')({
  component: () => (
    <WebSocketProvider url="http://localhost:9999" enabled={true}>
      <DashboardLayout />
    </WebSocketProvider>
  ),
})
