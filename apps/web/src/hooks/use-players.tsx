import { useMutation } from '@tanstack/react-query'
import type { PlayerToCreate } from '@/lib/types'
import { createPlayer } from '@/api/players'
import { queryClient } from '@/api/query-client'

export const useCreatePlayer = (leaderboardId: string) => {
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['createPlayer'],
    mutationFn: (data: PlayerToCreate) => createPlayer(data),
    onSuccess: () => {
      return queryClient.invalidateQueries(
        { queryKey: ['getLeaderboardPlayers', leaderboardId] },
        { cancelRefetch: false },
      )
    },
  })

  return {
    mutateAsync,
    isPending,
  }
}
