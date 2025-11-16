import { createFileRoute } from '@tanstack/react-router'
import { ProfileGeneral } from '@/components/user/profile-general'

export const Route = createFileRoute('/dashboard/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ProfileGeneral />
}
