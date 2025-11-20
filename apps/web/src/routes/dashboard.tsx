import { createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { SocketProvider } from '@/context/websocket-context'

export const Route = createFileRoute('/dashboard')({
  component: () => (
    <SocketProvider>
      <DashboardLayout />
    </SocketProvider>
  ),
})
