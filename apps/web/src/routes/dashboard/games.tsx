import { createFileRoute } from '@tanstack/react-router'
import { AlertCircle, Gamepad2, Key, Trophy } from 'lucide-react'
import { DashboardKpiElement } from '@/components/dashboard/dashboard-kpi-element'
import { EmptyComponent } from '@/components/empty-component'
import { CreateGame } from '@/components/games/create-game'
import { GameCard } from '@/components/games/game-card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { useGetGames } from '@/hooks/use-games'
import { useGetLeaderboards } from '@/hooks/use-leaderboards'

export const Route = createFileRoute('/dashboard/games')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: gamesData, isPending: gamesLoading } = useGetGames()
  const { data: leaderboardsData } = useGetLeaderboards()

  if (gamesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner />
      </div>
    )
  }

  if (!gamesData) {
    return (
      <div className="flex items-center justify-center py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load games</AlertDescription>
        </Alert>
      </div>
    )
  }

  const games = gamesData.data
  const leaderboards = leaderboardsData?.data || []

  // Calculate stats
  const totalGames = games.length
  const totalLeaderboards = leaderboards.length
  const totalApiKeys = games.reduce(
    (acc, game) => acc + (game.apiKeys.length || 0),
    0,
  )

  // Get leaderboard count per game
  const leaderboardCountByGame = leaderboards.reduce(
    (acc, lb) => {
      acc[lb.game.id] = (acc[lb.game.id] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  if (totalGames === 0) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Games</h1>
            <p className="text-muted-foreground mt-1">
              Manage your games and their configurations
            </p>
          </div>
        </div>

        <EmptyComponent
          title="No Games Found"
          description="Create your first game to start managing leaderboards and players."
        >
          <CreateGame />
        </EmptyComponent>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Games</h1>
          <p className="text-muted-foreground mt-1">
            Manage your games and their configurations
          </p>
        </div>
        <CreateGame />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashboardKpiElement
          title="Total Games"
          value={totalGames}
          icon={Gamepad2}
          isPending={gamesLoading}
        />
        <DashboardKpiElement
          title="Leaderboards"
          value={totalLeaderboards}
          icon={Trophy}
          iconColor="secondary"
          isPending={gamesLoading}
        />
        <DashboardKpiElement 
          title="API Keys" 
          value={totalApiKeys} 
          icon={Key}  
          isPending={gamesLoading}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Games ({totalGames})</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input placeholder="Search games by name..." className="max-w-md" />

          <div className="grid grid-cols-1 gap-3">
            {games.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                leaderboardCount={leaderboardCountByGame[game.id] || 0}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
