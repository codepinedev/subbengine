import { Label } from '@radix-ui/react-label'
import Avatar from 'boring-avatars'
import { Medal, RefreshCcw, Trash } from 'lucide-react'
import { useState } from 'react'
import { UpdateScore } from '../score/update-score'
import type { LeaderboardPlayer } from '@/lib/types'
import type { SelectedPlayerType } from '@/context/selected-players-context'
import { SelectedPlayersContext } from '@/context/selected-players-context'
import { Checkbox } from '@/components/ui/checkbox'
import { CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function LeaderboardPlayers({
  data,
}: {
  data: Array<LeaderboardPlayer>
}) {
  const [selectedPlayers, setSelectedPlayers] = useState<
    Array<SelectedPlayerType>
  >([])

  const selectPlayer = (player: SelectedPlayerType) => {
    const playerIndex = selectedPlayers.indexOf(player)
    if (playerIndex === -1) setSelectedPlayers([...selectedPlayers, player])
    else
      setSelectedPlayers(
        selectedPlayers.filter(
          (selectedPlayer) => selectedPlayer.id !== player.id,
        ),
      )
  }

  const allSelected = selectedPlayers.length === data.length && data.length > 0
  const someSelected =
    selectedPlayers.length > 0 && selectedPlayers.length < data.length

  const clearSelectedPlayers = () => setSelectedPlayers([])

  return (
    <SelectedPlayersContext value={{ selectedPlayers, clearSelectedPlayers }}>
      <CardContent>
        <div className="flex flex-row justify-between pb-4 pt-4">
          <div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="terms"
                checked={someSelected ? 'indeterminate' : allSelected}
                onCheckedChange={(checked) => {
                  if (checked) setSelectedPlayers(data.map((player) => player))
                  else setSelectedPlayers([])
                }}
              />
              <Label htmlFor="terms">Selected ({selectedPlayers.length})</Label>
            </div>
          </div>
          <div className="flex flex-row gap-2">
            <Button size="icon" variant="secondary">
              <Trash />
            </Button>
            <UpdateScore>
              <Button disabled={!someSelected && !allSelected}>
                <RefreshCcw /> Update Score
              </Button>
            </UpdateScore>
          </div>
        </div>
        <div className="space-y-1">
          {data.map((player, index) => {
            const rankIcons = [
              <Medal
                key="1"
                className="w-4 h-4 text-yellow-500 fill-yellow-500"
              />,
              <Medal
                key="2"
                className="w-4 h-4 text-slate-400 fill-slate-400"
              />,
              <Medal
                key="3"
                className="w-4 h-4 text-amber-600 fill-amber-600"
              />,
            ]

            return (
              <Label
                key={player.id}
                className="hover:bg-accent/50 flex items-center gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-primary blue-0 dark:has-[[aria-checked=true]]:bg-blue-950"
              >
                <Checkbox
                  id={player.id}
                  checked={selectedPlayers.indexOf(player) !== -1}
                  onCheckedChange={() => selectPlayer(player)}
                />

                <div key={player.id} className="flex items-center gap-3 w-full">
                  <Avatar name={player.username} variant="beam" />
                  <div className="flex items-center justify-center w-6">
                    {index < 3 ? (
                      rankIcons[index]
                    ) : (
                      <span className="text-sm font-semibold text-muted-foreground">
                        {player.rank}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm">{player.username}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold">
                      {player.score.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Label>
            )
          })}
        </div>
      </CardContent>
    </SelectedPlayersContext>
  )
}
