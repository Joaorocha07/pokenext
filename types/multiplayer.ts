// types/multiplayer.ts
export interface Player {
  id: string
  name: string
  pokemonIds: number[]
  selectedPokemonIndex: number // 0, 1 ou 2 - qual está usando agora
  ready: boolean
}

export interface BattleRoom {
  id: string
  player1: Player | null
  player2: Player | null
  status: 'waiting' | 'selecting' | 'battling' | 'finished'
  currentTurn: string | null // id do jogador da vez
  round: number // 1-3
  winner: string | null
  battleLog: BattleAction[]
}

export interface BattleAction {
  round: number
  player1Pokemon: number
  player2Pokemon: number
  player1Power: number
  player2Power: number
  winner: 'player1' | 'player2' | 'draw'
  timestamp: number
}