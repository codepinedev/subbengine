import { createFileRoute } from '@tanstack/react-router'
import { Trophy } from 'lucide-react'
import { EmptyComponent } from '@/components/empty-component'
import { LeaderboardDetailsCard } from '@/components/leaderboards/details-leaderboard'
import { GameApiKeys } from '@/components/leaderboards/game-api-keys'
import { GameInformation } from '@/components/leaderboards/game-information'
import { CreatePlayer } from '@/components/leaderboards/players/create-player'
import { LeaderboardPlayers } from '@/components/leaderboards/players/leaderboard-players'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { ContainerSpinner } from '@/components/ui/spinner'
import { useGetGameKeys } from '@/hooks/use-api-key'
import {
  useGetLeaderboard,
  useGetLeaderboardPlayers,
} from '@/hooks/use-leaderboards'
import { useSocket } from '@/hooks/use-socket'

export const Route = createFileRoute('/dashboard/leaderboard/$leaderboardId/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { leaderboardId } = Route.useParams()

  if (!leaderboardId) return null

  const { joinLeaderboard } = useSocket()
  const { data: players } = useGetLeaderboardPlayers(leaderboardId)
  const { data: leaderboard } = useGetLeaderboard(leaderboardId)
  const { data: gameKeys, isPending: isLoadingKeys } = useGetGameKeys(
    leaderboard?.data.game.id || '',
  )

  if (!players || !leaderboard) return <ContainerSpinner />

  const totalScore = players.data.reduce((sum, player) => sum + player.score, 0)

  joinLeaderboard(leaderboardId)

  return (
    <div className="flex flex-col gap-6">
      <LeaderboardDetailsCard
        name={leaderboard.data.name}
        totalPlayers={players.data.length}
        totalScore={totalScore.toLocaleString()}
        status={leaderboard.data.status}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <GameInformation
          gameName={leaderboard.data.game.name}
          gameId={leaderboard.data.game.id}
        />
        {gameKeys && (
          <GameApiKeys gameKeys={gameKeys} isLoading={isLoadingKeys} />
        )}
      </div>

      {players.data.length > 0 ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Player Rankings
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Top performers and their scores
                </p>
              </div>
              <CreatePlayer />
            </div>
          </CardHeader>
          <LeaderboardPlayers data={players.data} />
        </Card>
      ) : (
        <EmptyComponent>
          <CreatePlayer />
        </EmptyComponent>
      )}
    </div>
  )
}
