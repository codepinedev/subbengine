import { createFileRoute } from '@tanstack/react-router'
import { CreatePlayer } from '@/components/leaderboards/players/create-player'

export const Route = createFileRoute('/dashboard/players')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold mb-2">All Players</h1>
          <p className="text-muted-foreground">
            Manage and track your players statistics
          </p>
        </div>

        <CreatePlayer />
      </div>
    </div>
  )
}
