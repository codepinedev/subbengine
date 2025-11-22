import { axiosInstance } from '.'
import type { AxiosResponse } from 'axios'
import type { Game, GameToCreate, GameToUpdate } from '../lib/types'

const PREFIX = '/games/'

export const listGamesEndpoint = (): Promise<AxiosResponse<Array<Game>>> =>
  axiosInstance.get(PREFIX)

export const createGameEndpoint = (
  game: GameToCreate,
): Promise<AxiosResponse<Game>> => axiosInstance.post(PREFIX, game)

export const updateGameEndpoint = (
  gameId: string,
  game: GameToUpdate,
): Promise<AxiosResponse<Game>> => axiosInstance.patch(`${PREFIX}${gameId}`, game)
