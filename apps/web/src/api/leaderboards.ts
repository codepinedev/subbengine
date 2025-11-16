import { axiosInstance } from '.'
import type {
    Leaderboard,
    LeaderboardCreated,
    LeaderboardPlayer,
    LeaderboardToCreate,
    UpdateScoreRequest,
    UpdateScoreResponse,
} from '@/lib/types'
import type { AxiosResponse } from 'axios'

const PREFIX = '/leaderboards/'

export const updateScoreEndpoint = (
  leaderboardId: string,
  data: Array<UpdateScoreRequest>,
): Promise<AxiosResponse<Array<UpdateScoreResponse>>> =>
  axiosInstance.post(PREFIX + leaderboardId + '/score', data)

export const createLeaderboardEndpoint = (
  data: LeaderboardToCreate,
): Promise<AxiosResponse<LeaderboardCreated>> =>
  axiosInstance.post(PREFIX, data)

export const fetchLeaderboardsEndpoint = (): Promise<
  AxiosResponse<Array<LeaderboardCreated>>
> => axiosInstance.get(PREFIX)

export const fetchLeaderboardsPlayersEndpoint = (
  leaderboardId: string,
): Promise<AxiosResponse<Array<LeaderboardPlayer>>> =>
  axiosInstance.get(PREFIX + leaderboardId + '/players')

export const fetchLeaderboardEndpoint = (
  leaderboardId: string,
): Promise<AxiosResponse<Leaderboard>> =>
  axiosInstance.get(PREFIX + leaderboardId)
