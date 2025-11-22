import { Link } from '@tanstack/react-router'
import { ArrowRight, Key, Trophy } from 'lucide-react'
import type { Game } from '@/lib/types'

interface GameCardProps {
  game: Game
  leaderboardCount?: number
}

export function GameCard({ game, leaderboardCount = 0 }: GameCardProps) {
  const activeKeysCount =
    game.apiKeys.filter((key) => key.status === 'enabled').length || 0

  return (
    <Link
      to={'/dashboard/game/$gameId/details'}
      params={{
        gameId: game.id,
      }}
      className="block"
    >
      <div className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 hover:border-primary/50 transition-all group">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <span className="text-lg shrink-0">{game.icon}</span>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold truncate">{game.name}</h3>
            <p className="text-xs text-muted-foreground truncate">
              {game.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Trophy className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">{leaderboardCount}</span>
          </div>

          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Key className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">{activeKeysCount}</span>
          </div>

          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </div>
    </Link>
  )
}
