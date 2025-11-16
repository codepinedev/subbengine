import { EmptyComponent } from '../empty-component'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Spinner } from '../ui/spinner'
import { CreateGame } from './create-game'
import { cn } from '@/lib/utils'

import { useGetGames } from '@/hooks/use-games'

interface ListGamesProps {
  selectedGameId?: string
  onGameSelect?: (gameId: string) => void
}

export function ListGames({
  selectedGameId,
  onGameSelect,
}: ListGamesProps): React.ReactElement {
  const { data, isPending } = useGetGames()

  if (isPending) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Spinner />
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Failed to load games</p>
        </CardContent>
      </Card>
    )
  }

  const { data: games } = data

  if (games.length == 0) {
    return (
      <EmptyComponent
        title="No games found"
        description="Create a new game to get started."
      >
        <CreateGame />
      </EmptyComponent>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your games ({games.length})</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex justify-between gap-4">
          <Input placeholder="Filter game by name..." className="max-w-full" />
          <CreateGame variant="icon" />
        </div>

        {games.map((game) => (
          <button
            key={game.id}
            onClick={() => onGameSelect?.(game.id)}
            className={cn(
              'flex flex-col gap-2 p-3 rounded-lg border text-left transition-all',
              'hover:bg-accent hover:border-primary/50',
              selectedGameId === game.id
                ? 'bg-accent border-primary shadow-sm'
                : 'bg-card border-border',
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-row justify-center items-center gap-4">
                <p className="text-sm text-muted-foreground">{game.icon}</p>
                <p className="text-sm font-medium">{game.name}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{game.description}</p>
          </button>
        ))}
      </CardContent>
    </Card>
  )
}
