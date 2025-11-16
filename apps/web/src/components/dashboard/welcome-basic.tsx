import { SkeletonCard } from '../skeleton-card'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { authClient } from '@/lib/auth-client'

export function WelcomeBasic(): React.ReactElement {
  const { data, isPending } = authClient.useSession()

  if (isPending && !data) return <SkeletonCard />
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">
          Welcome back, {data?.user.name}!
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Here's what's happening with your leaderboards today.
        </p>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Track your progress and manage your leaderboards from the dashboard.
        </p>
      </CardContent>
    </Card>
  )
}
