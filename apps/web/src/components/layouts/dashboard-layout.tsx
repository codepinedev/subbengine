import { Outlet, useLocation, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar'
import { Footer } from '@/components/footer'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { authClient } from '@/lib/auth-client'

export function DashboardLayout() {
  const router = useRouter()
  const location = useLocation()
  const { data: session, isPending } = authClient.useSession()

  useEffect(() => {
    if (!isPending && !session) {
      router.navigate({
        to: '/',
        search: {
          redirect: location.pathname,
        },
      })
    }
  }, [session, isPending, router, location.pathname])

  if (isPending || !session) {
    return null
  }

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <DashboardHeader />
        <div className="flex flex-1 flex-col p-4">
          <div className="max-w-5xl mx-auto w-full flex flex-col gap-4">
            <Outlet />
          </div>
        </div>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  )
}
