import { Link } from '@tanstack/react-router'
import { ArrowRight, Users } from 'lucide-react'
import { Badge } from '../ui/badge'
import type { LeaderboardCreated } from '@/lib/types'

interface LeaderboardCardProps extends LeaderboardCreated {
  playerCount?: number
}

export function LeaderboardCard({
  id,
  name,
  status,
  game,
  icon,
  playerCount,
}: LeaderboardCardProps) {
  return (
    <Link
      to={'/dashboard/leaderboard/$leaderboardId'}
      params={{
        leaderboardId: id.toString(),
      }}
      className="block"
    >
      <div className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 hover:border-primary/50 transition-all group">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {icon && <span className="text-lg shrink-0">{icon}</span>}
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold truncate">{name}</h3>
            <p className="text-xs text-muted-foreground truncate">
              {game.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">
              {playerCount !== undefined ? playerCount : 0}
            </span>
          </div>

          <Badge
            variant={status === 'active' ? 'default' : 'secondary'}
            className="text-xs"
          >
            {status}
          </Badge>

          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </div>
    </Link>
  )
}
