import { axiosInstance } from '.'
import type { PlayerCreated, PlayerToCreate } from '@/lib/types'
import type { AxiosResponse } from 'axios'

const PREFIX = '/players/'
export const createPlayer = (
  data: PlayerToCreate,
): Promise<AxiosResponse<PlayerCreated>> => axiosInstance.post(PREFIX, data)
