import { axiosInstance } from '.'
import type { ApiKey, ApiKeyLog } from '@/lib/types/api-key.types'
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

export const getApiKeyLogsEndpoint = (
  id: string,
): Promise<AxiosResponse<Array<ApiKeyLog>>> => axiosInstance.get(PREFIX + `${id}/logs`)


export const getApiKeyCallStatsEndpoint = (): Promise<AxiosResponse<{apiCallsToday:number}>> => axiosInstance.get(PREFIX + "stats")
