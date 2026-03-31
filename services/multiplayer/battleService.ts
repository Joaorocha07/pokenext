// services/multiplayer/battleService.ts
import { BattleAction, BattleRoom, Player } from '@/types/multiplayer'

const ROOMS_KEY = 'poke-battle-rooms'
const PLAYER_ID_KEY = 'poke-player-id'

// Gera ID único do jogador
export const getPlayerId = (): string => {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem(PLAYER_ID_KEY)

  if (!id) {
    id = 'player_' + Math.random().toString(36).substr(2, 9)
    localStorage.setItem(PLAYER_ID_KEY, id)
  }
  
  return id
}

// Cria ou entra em uma sala
export const joinRoom = (
    roomId: string, playerName: string, pokemonIds: number[]
): BattleRoom | null => {
  const rooms = getRooms()
  let room = rooms.find(r => r.id === roomId)
  
  const player: Player = {
    id: getPlayerId(),
    name: playerName,
    pokemonIds,
    selectedPokemonIndex: 0,
    ready: false
  }
  
  if (!room) {
    // Cria nova sala
    if (rooms.length >= 5) {
      alert('Todas as 5 salas estão ocupadas! Aguarde ou entre em uma existente.')

      return null
    }
    room = {
      id: roomId,
      player1: player,
      player2: null,
      status: 'waiting',
      currentTurn: null,
      round: 1,
      winner: null,
      battleLog: []
    }
    rooms.push(room)
  } else if (!room.player2 && room.player1?.id !== player.id) {
    // Entra como player 2
    room.player2 = player
    room.status = 'selecting'
  } else if (room.player1?.id === player.id || room.player2?.id === player.id) {
    // Já está na sala, retorna ela
    return room
  } else {
    alert('Sala cheia!')

    return null
  }
  
  saveRooms(rooms)

  return room
}

// Seleciona qual Pokémon usar (0, 1 ou 2)
export const selectPokemonForRound = (
    roomId: string, playerId: string, index: number
): BattleRoom | null => {
  const rooms = getRooms()
  const room = rooms.find(r => r.id === roomId)

  if (!room) return null
  
  if (room.player1?.id === playerId) {
    room.player1.selectedPokemonIndex = index
    room.player1.ready = true
  } else if (room.player2?.id === playerId) {
    room.player2.selectedPokemonIndex = index
    room.player2.ready = true
  }
  
  // Se ambos prontos, inicia batalha
  if (room.player1?.ready && room.player2?.ready) {
    room.status = 'battling'
    // Sorteia quem começa
    room.currentTurn = Math.random() > 0.5 ? room.player1.id : room.player2.id
  }
  
  saveRooms(rooms)

  return room
}

// Executa turno de batalha
export const executeBattleTurn = (roomId: string): BattleRoom | null => {
  const rooms = getRooms()
  const room = rooms.find(r => r.id === roomId)

  if (!room || !room.player1 || !room.player2) return null
  
  const p1PokemonId = room.player1.pokemonIds[room.player1.selectedPokemonIndex]
  const p2PokemonId = room.player2.pokemonIds[room.player2.selectedPokemonIndex]
  
  // Simula poder (na prática viria da API)
  const p1Power = Math.floor(Math.random() * 300) + 200
  const p2Power = Math.floor(Math.random() * 300) + 200
  
  let winner: 'player1' | 'player2' | 'draw'

  if (p1Power > p2Power) winner = 'player1'

  else if (p2Power > p1Power) winner = 'player2'
  else winner = 'draw'
  
  const action: BattleAction = {
    round: room.round,
    player1Pokemon: p1PokemonId,
    player2Pokemon: p2PokemonId,
    player1Power: p1Power,
    player2Power: p2Power,
    winner,
    timestamp: Date.now()
  }
  
  room.battleLog.push(action)
  
  // Verifica fim do jogo (melhor de 3)
  const p1Wins = room.battleLog.filter(l => l.winner === 'player1').length
  const p2Wins = room.battleLog.filter(l => l.winner === 'player2').length
  
  if (p1Wins >= 2 || p2Wins >= 2 || room.round >= 3) {
    room.status = 'finished'
    room.winner = p1Wins > p2Wins ? room.player1.id : 
                    p2Wins > p1Wins ? room.player2.id : 'draw'
  } else {
    room.round++
    // Reseta ready para próxima rodada
    room.player1.ready = false
    room.player2.ready = false
    // Alterna quem começa
    room.currentTurn = room.currentTurn === 
    room.player1.id ? room.player2.id : room.player1.id
  }
  
  saveRooms(rooms)

  return room
}

// Limpa sala após 10 minutos de inatividade
export const cleanupOldRooms = () => {
  const rooms = getRooms()
  const now = Date.now()
  const activeRooms = rooms.filter(r => {
    const lastAction = r.battleLog[r.battleLog.length - 1]?.timestamp || now

    return now - lastAction < 10 * 60 * 1000 // 10 minutos
  })

  saveRooms(activeRooms)
}

// Helpers
const getRooms = (): BattleRoom[] => {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(ROOMS_KEY)

  return data ? JSON.parse(data) : []
}

const saveRooms = (rooms: BattleRoom[]) => {
  localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms))
}

// Polling para atualizações
export const pollRoom = (
    roomId: string, callback: (_room: BattleRoom) => void) => {
  const interval = setInterval(() => {
    const rooms = getRooms()
    const room = rooms.find(r => r.id === roomId)

    if (room) callback(room)
  }, 1000) // Atualiza a cada segundo
  
  return () => clearInterval(interval)
}