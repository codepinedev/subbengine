import { useMutation, useQuery } from '@tanstack/react-query'
import type { LeaderboardToCreate, UpdateScoreRequest } from '@/lib/types'
import {
  createLeaderboardEndpoint,
  fetchLeaderboardEndpoint,
  fetchLeaderboardsEndpoint,
  fetchLeaderboardsPlayersEndpoint,
  updateScoreEndpoint,
} from '@/api/leaderboards'
import { queryClient } from '@/api/query-client'

export const useGetLeaderboard = (leaderboardId: string) => {
  const { data, isPending, error } = useQuery({
    queryKey: ['getLeaderboard', leaderboardId],
    queryFn: async () => await fetchLeaderboardEndpoint(leaderboardId),
  })

  return {
    data,
    isPending,
    error,
  }
}

export const useGetLeaderboardPlayers = (leaderboardId: string) => {
  const { data, isPending, error } = useQuery({
    queryKey: ['getLeaderboardPlayers', leaderboardId],
    queryFn: async () => await fetchLeaderboardsPlayersEndpoint(leaderboardId),
  })

  return {
    data,
    isPending,
    error,
  }
}
export const useGetLeaderboards = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ['getLeaderboards'],
    queryFn: () => fetchLeaderboardsEndpoint(),
  })

  return {
    data,
    isPending,
    error,
  }
}

export const useCreateLeaderboard = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['createLeaderboard'],
    mutationFn: (data: LeaderboardToCreate) => createLeaderboardEndpoint(data),
    onSuccess: () => {
      return queryClient.invalidateQueries(
        { queryKey: ['getLeaderboards'] },
        { cancelRefetch: false },
      )
    },
  })

  return {
    mutateAsync,
    isPending,
  }
}

export const useUpdateScore = (leaderboardId: string) => {
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['updateScore'],
    mutationFn: (data: Array<UpdateScoreRequest>) =>
      updateScoreEndpoint(leaderboardId, data),
    onSuccess: () => {
      return queryClient.invalidateQueries(
        {
          queryKey: ['getLeaderboardPlayers', leaderboardId],
        },
        { cancelRefetch: false },
      )
    },
  })

  return {
    mutateAsync,
    isPending,
  }
}
