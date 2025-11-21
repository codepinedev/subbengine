import { createFileRoute } from '@tanstack/react-router'
import { Trophy, Users, Zap } from 'lucide-react'
import { useState } from 'react'
import { DashboardKpiElement } from '@/components/dashboard/dashboard-kpi-element'
import { WelcomeBasic } from '@/components/dashboard/welcome-basic'
import { ListGames } from '@/components/games/list-games'
import { ListLeaderboards } from '@/components/leaderboards/list-leaderboards'
import { Spinner } from '@/components/ui/spinner'
import { useGetLeaderboards } from '@/hooks/use-leaderboards'
import { useGetApiKeyCallStats } from '@/hooks/use-api-key'


export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [selectedGameId, setSelectedGameId] = useState<string | undefined>(
    undefined,
  )
  const { data, isPending } = useGetLeaderboards()
  const {data:stats, isPending: statsPendning} = useGetApiKeyCallStats()

  const filteredLeaderboards = selectedGameId
    ? data?.data.filter((lb) => lb.game.id === selectedGameId) || []
    : data?.data || []

  const totalPlayers = filteredLeaderboards.reduce(
    (acc, leaderboard) => acc + (leaderboard.playerCount || 0),
    0,
  )

  return (
    <div className="flex flex-col gap-6">
      <WelcomeBasic />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {isPending ? (
          <div className="col-span-3 flex justify-center">
            <Spinner />
          </div>
        ) : (
          <DashboardKpiElement
            title={selectedGameId ? 'Game Leaderboards' : 'Active Leaderboards'}
            value={filteredLeaderboards.length}
            icon={Trophy}
          />
        )}
        <DashboardKpiElement
          title="Total Players"
          value={totalPlayers}
          iconColor="secondary"
          icon={Users}
        />
        <DashboardKpiElement title="API Calls Today" value={stats?.data.apiCallsToday.toString() ?? ''} icon={Zap} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ListGames
          selectedGameId={selectedGameId}
          onGameSelect={setSelectedGameId}
        />
        <ListLeaderboards gameId={selectedGameId} />
      </div>
    </div>
  )
}
