import { useMutation, useQuery } from '@tanstack/react-query'
import type { GameToCreate, GameToUpdate } from '@/lib/types'
import { createGameEndpoint, listGamesEndpoint, updateGameEndpoint } from '@/api/games'
import { queryClient } from '@/api/query-client'

export const useGetGames = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ['getGames'],
    queryFn: async () => await listGamesEndpoint(),
  })

  return {
    data,
    isPending,
    error,
  }
}

export const useCreateGame = () => {
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: async (game: GameToCreate) => await createGameEndpoint(game),
    onSuccess: () => {
      return queryClient.invalidateQueries(
        { queryKey: ['getGames'] },
        { cancelRefetch: false },
      )
    },
  })

  return {
    mutateAsync,
    isPending,
    error,
  }
}

export const useUpdateGame = () => {
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: async ({ gameId, game }: { gameId: string; game: GameToUpdate }) =>
      await updateGameEndpoint(gameId, game),
    onSuccess: () => {
      return queryClient.invalidateQueries(
        { queryKey: ['getGames'] },
        { cancelRefetch: false },
      )
    },
  })

  return {
    mutateAsync,
    isPending,
    error,
  }
}
