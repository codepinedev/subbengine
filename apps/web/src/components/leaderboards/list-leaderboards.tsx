import { Gamepad2 } from 'lucide-react'
import { EmptyComponent } from '../empty-component'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Spinner } from '../ui/spinner'
import { CreateLeaderboard } from './create-leaderboard'
import { LeaderboardCard } from './leaderboard-card'
import { useGetLeaderboards } from '@/hooks/use-leaderboards'
import { useGetGames } from '@/hooks/use-games'

interface ListLeaderboardsProps {
  gameId?: string
}

export function ListLeaderboards({
  gameId,
}: ListLeaderboardsProps): React.ReactElement {
  const { data, isPending } = useGetLeaderboards()
  const { data: gamesData } = useGetGames()

  // Show prompt when no game is selected
  if (!gameId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Leaderboards</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
          <Gamepad2 className="w-16 h-16 text-muted-foreground/50" />
          <div className="text-center space-y-2">
            <p className="text-sm font-medium">
              Select a game to view leaderboards
            </p>
            <p className="text-xs text-muted-foreground">
              Choose a game from the list to see its associated leaderboards
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isPending) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Leaderboards</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <Spinner />
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Leaderboards</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Failed to load leaderboards</p>
        </CardContent>
      </Card>
    )
  }

  const { data: leaderboards } = data

  // Filter leaderboards by selected gameId
  const filteredLeaderboards = leaderboards.filter(
    (leaderboard) => leaderboard.game.id === gameId,
  )

  if (filteredLeaderboards.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Leaderboards</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyComponent
            title="No Leaderboards Found"
            description="This game doesn't have any leaderboards yet."
          >
            <CreateLeaderboard preselectedGameId={gameId} />
          </EmptyComponent>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Active Leaderboards ({filteredLeaderboards.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex justify-between gap-4">
          <Input
            placeholder="Filter leaderboard name..."
            className="max-w-full"
          />
          <CreateLeaderboard preselectedGameId={gameId} />
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredLeaderboards.map((leaderboard, index) => {
            const { id, game, name, userId, status, playerCount } = leaderboard
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
                key={id}
                id={id}
                name={name}
                game={game}
                userId={userId}
                status={status}
                icon={icon}
                playerCount={playerCount}
              />
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
