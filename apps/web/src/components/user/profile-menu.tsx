import { useRouter } from '@tanstack/react-router'
import { LayoutDashboardIcon, LogOut, UserIcon } from 'lucide-react'
import { AccessProfile } from './access-profile'
import { authClient } from '@/lib/auth-client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ProfileMenu(): React.ReactElement {
  const router = useRouter()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <AccessProfile />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => router.navigate({ to: '/dashboard' })}>
          <LayoutDashboardIcon />
          Dashboard
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => router.navigate({ to: '/dashboard/profile' })}
        >
          <UserIcon />
          Profile
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() =>
            authClient.signOut().then(() => router.navigate({ to: '/' }))
          }
        >
          <LogOut /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
