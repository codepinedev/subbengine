import Avatar from 'boring-avatars'
import { authClient } from '@/lib/auth-client'

export function AccessProfile(): React.ReactElement {
  const { data } = authClient.useSession()

  if (!data) <div>Something went wrong.</div>
  return (
    <div className="flex flex-row justify-center items-center gap-4">
      <Avatar name={data?.user.name} variant="pixel" />
    </div>
  )
}
