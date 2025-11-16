import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, Gamepad2, Trophy, Users } from 'lucide-react'
import { DashboardKpiElement } from '@/components/dashboard/dashboard-kpi-element'
import { EmptyComponent } from '@/components/empty-component'
import { CreateLeaderboard } from '@/components/leaderboards/create-leaderboard'
import { GameApiKeys } from '@/components/leaderboards/game-api-keys'
import { GameInformation } from '@/components/leaderboards/game-information'
import { LeaderboardCard } from '@/components/leaderboards/leaderboard-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ContainerSpinner } from '@/components/ui/spinner'
import { useGetGameKeys } from '@/hooks/use-api-key'
import { useGetGames } from '@/hooks/use-games'
import { useGetLeaderboards } from '@/hooks/use-leaderboards'

export const Route = createFileRoute('/dashboard/games/$gameId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { gameId } = Route.useParams()
  const { data: gamesData, isPending: gamesLoading } = useGetGames()
  const { data: leaderboardsData, isPending: leaderboardsLoading } =
    useGetLeaderboards()
  const { data: gameKeys, isPending: keysLoading } = useGetGameKeys(gameId)

  if (gamesLoading || leaderboardsLoading || keysLoading) <ContainerSpinner />

  const game = gamesData?.data.find((g) => g.id === gameId)

  if (!game) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <p className="text-muted-foreground">Game not found</p>
        <Link to="/dashboard/games">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4" />
            Back to Games
          </Button>
        </Link>
      </div>
    )
  }

  const gameLeaderboards =
    leaderboardsData?.data.filter((lb) => lb.game.id === gameId) || []

  const totalPlayers = gameLeaderboards.reduce(
    (acc, lb) => acc + (lb.playerCount || 0),
    0,
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link to="/dashboard/games">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-3 flex-1">
          <span className="text-4xl">{game.icon}</span>
          <div>
            <h1 className="text-3xl font-bold">{game.name}</h1>
            <p className="text-muted-foreground">{game.description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashboardKpiElement
          title="Leaderboards"
          value={gameLeaderboards.length}
          icon={Trophy}
        />
        <DashboardKpiElement
          title="Total Players"
          value={totalPlayers}
          icon={Users}
          iconColor="secondary"
        />
        <DashboardKpiElement
          title="API Keys"
          value={game.apiKeys.length || 0}
          icon={Gamepad2}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <GameInformation gameName={game.name} gameId={game.id} />
        {gameKeys ? (
          <GameApiKeys gameKeys={gameKeys} isLoading={keysLoading} />
        ) : null}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Leaderboards ({gameLeaderboards.length})
            </CardTitle>
            <CreateLeaderboard preselectedGameId={gameId} />
          </div>
        </CardHeader>
        <CardContent>
          {gameLeaderboards.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {gameLeaderboards.map((leaderboard, index) => {
                const mockIcons = [
                  '🏆',
                  '🎮',
                  '⚔️',
                  '🎯',
                  '🔥',
                  '⭐',
                  '🏅',
                  '👑',
                  '💎',
                  '🚀',
                ]
                const icon = mockIcons[index % mockIcons.length]
                return (
                  <LeaderboardCard
                    key={leaderboard.id}
                    {...leaderboard}
                    icon={icon}
                  />
                )
              })}
            </div>
          ) : (
            <EmptyComponent
              title="No Leaderboards"
              description="Create your first leaderboard for this game."
            >
              <CreateLeaderboard preselectedGameId={gameId} />
            </EmptyComponent>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
