import { useMutation, useQuery } from '@tanstack/react-query'
import {
  createApiKeyEndpoint,
  getAllApiKeysEndpoint,
  getGameKeysEndpoint,
} from '@/api/api-keys'
import { queryClient } from '@/api/query-client'

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
