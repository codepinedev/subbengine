import { createContext } from 'react'

export type SelectedPlayerType = {
  id: string
  username: string
  score: number
  rank: number
  avatarUrl: string
  leaderboardId: string
}

type SelectedPlayersContextType = {
  selectedPlayers: Array<SelectedPlayerType>
  clearSelectedPlayers: () => void
}

export const SelectedPlayersContext = createContext<SelectedPlayersContextType>(
  {
    selectedPlayers: [],
    clearSelectedPlayers: () => { },
  },
)
