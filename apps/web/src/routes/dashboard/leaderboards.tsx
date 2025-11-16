import { createFileRoute } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { EmptyComponent } from '@/components/empty-component'
import { CreateLeaderboard } from '@/components/leaderboards/create-leaderboard'
import { LeaderboardCard } from '@/components/leaderboards/leaderboard-card'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { useGetLeaderboards } from '@/hooks/use-leaderboards'

export const Route = createFileRoute('/dashboard/leaderboards')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isPending } = useGetLeaderboards()

  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold mb-2">All Leaderboards</h1>
          <p className="text-muted-foreground">
            Manage and track all your competitive leaderboards
          </p>
        </div>
        <CreateLeaderboard />
      </div>

      {/* Search Section */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search leaderboards..." className="pl-10" />
      </div>

      {/* Leaderboards Grid */}
      {isPending ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Spinner />
          </CardContent>
        </Card>
      ) : !data || data.data.length === 0 ? (
        <EmptyComponent
          title="No Leaderboards Yet"
          description="Create your first game to start managing leaderboards and players."
        >
          <CreateLeaderboard />
        </EmptyComponent>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.data.map((leaderboard) => {
            const { id, name, status, game, userId, icon, playerCount } =
              leaderboard
            return (
              <LeaderboardCard
                key={leaderboard.id}
                id={id}
                icon={icon}
                name={name}
                game={game}
                status={status}
                userId={userId}
                playerCount={playerCount}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
