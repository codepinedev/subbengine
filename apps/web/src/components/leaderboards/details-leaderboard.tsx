import { TrendingUp, Users } from 'lucide-react'
import type { LeaderboardStatus as LeaderboardStatusType } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface LeaderboardDetailsCardProps {
  name: string
  totalPlayers?: number
  totalScore?: string
  status: LeaderboardStatusType
}

export function LeaderboardDetailsCard({
  name,
  totalPlayers = 0,
  totalScore = '0',
}: LeaderboardDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-2xl mb-2">{name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Competitive rankings and player statistics
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span className="text-sm">Total Players</span>
            </div>
            <p className="text-2xl font-bold">{totalPlayers}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">Total Score</span>
            </div>
            <p className="text-2xl font-bold">{totalScore}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
