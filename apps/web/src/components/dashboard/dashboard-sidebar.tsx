import { Link, useRouterState } from '@tanstack/react-router'
import {
  BarChart3,
  ChartNoAxesColumn,
  Gamepad,
  Home,
  LogOutIcon,
  Settings,
  Trophy,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

const menuItems = [
  {
    title: 'Dashboard',
    icon: Home,
    url: '/dashboard',
  },
  {
    title: 'Games',
    icon: Gamepad,
    url: '/dashboard/games',
  },
  {
    title: 'Leaderboards',
    icon: Trophy,
    url: '/dashboard/leaderboards',
  },

  {
    title: 'API Keys',
    icon: BarChart3,
    url: '/dashboard/api-keys',
  },
  {
    title: 'Settings',
    icon: Settings,
    url: '/dashboard/settings',
  },
]

export function DashboardSidebar() {
  const router = useRouterState()
  const { state } = useSidebar()

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        {state === 'collapsed' ? (
          <div className="text-primary flex items-center justify-center pt-2 pb-2">
            <ChartNoAxesColumn size="24" />
          </div>
        ) : (
          <div className="flex items-center gap-2 p-2 text-2xl font-bold text-primary">
            <ChartNoAxesColumn /> SubbEngine
          </div>
        )}

        <hr />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = router.location.pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.url} className="text-base">
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem key="logout">
            <SidebarMenuButton asChild>
              <Link to={"/"} >
                <LogOutIcon />
                <span>Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar >
  )
}
