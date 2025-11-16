import { Menu } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { ProfileMenu } from '@/components/user/profile-menu'

export function DashboardHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <div className="flex items-center gap-2 flex-1">
        <SidebarTrigger>
          <Menu className="w-5 h-5" />
        </SidebarTrigger>
        <Separator orientation="vertical" className="mr-2 h-6 md:hidden" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <ProfileMenu />
      </div>
    </header>
  )
}
