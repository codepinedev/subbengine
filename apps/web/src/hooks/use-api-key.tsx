import { useMutation, useQuery } from '@tanstack/react-query'
import {
  createApiKeyEndpoint,
  getAllApiKeysEndpoint,
  getApiKeyCallStatsEndpoint,
  getApiKeyLogsEndpoint,
  getGameKeysEndpoint,
} from '@/api/api-keys'
import { queryClient } from '@/api/query-client'


export const useGetApiKeyCallStats = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ['getApiKeyCallStats'],
    queryFn: async () => await getApiKeyCallStatsEndpoint(),
  })

  return {
    data,
    isPending,
    error,
  }
}

export const useGetApiKeyLogs = (id: string) => {
  const { data, isPending, error } = useQuery({
    queryKey: ['getApiKeyLogs', id],
    queryFn: async () => id && (await getApiKeyLogsEndpoint(id)),
  })

  return {
    data,
    isPending,
    error,
  }
}

export const useGetGameKeys = (gameId: string) => {
  const { data, isPending, error } = useQuery({
    queryKey: ['getGameKeys', gameId],
    queryFn: async () => gameId && (await getGameKeysEndpoint(gameId)),
  })

  return {
    data,
    isPending,
    error,
  }
}

export const useGetAllApiKeys = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ['getAllApiKeys'],
    queryFn: async () => await getAllApiKeysEndpoint(),
  })

  return {
    data,
    isPending,
    error,
  }
}

export const useCreateApiKey = () => {
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: async (data: { gameId: string; name: string }) =>
      await createApiKeyEndpoint(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAllApiKeys'] })
      queryClient.invalidateQueries({ queryKey: ['getGameKeys'] })
    },
  })

  return {
    mutateAsync,
    isPending,
    error,
  }
}



