import { axiosInstance } from '.'
import type { ApiKey } from '@/lib/types/api-key.types'
import type { AxiosResponse } from 'axios'

const PREFIX = '/api-keys/'

export const getGameKeysEndpoint = (
  gameId: string,
): Promise<AxiosResponse<Array<ApiKey>>> =>
  axiosInstance.get(PREFIX + 'game/' + gameId)

export const getAllApiKeysEndpoint = (): Promise<
  AxiosResponse<Array<ApiKey>>
> => axiosInstance.get(PREFIX)

export const createApiKeyEndpoint = (data: {
  gameId: string
  name: string
}): Promise<AxiosResponse<ApiKey>> => axiosInstance.post(PREFIX, data)
