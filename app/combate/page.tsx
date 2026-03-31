/* eslint-disable @typescript-eslint/no-explicit-any */
// app/multiplayer/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useFavorites } from '@/hooks/pokemon/useFavorites'

import { pokemonService } from '@/services/pokeapi/pokemonService'

import { BattleRoom } from '@/types/multiplayer'

import { 
  cleanupOldRooms, 
  getPlayerId, 
  joinRoom, 
  pollRoom,
  selectPokemonForRound 
} from '@/services/multiplayer/battleService'
import { Header } from '../pokemon/components/Header'

import { LoadingSpinner } from '../pokemon/components/LoadingSpinner'

import { Clock, Shield, Swords, Users,  } from 'lucide-react'

import Image from 'next/image'
import Link from 'next/link'

export default function MultiplayerPage() {
  const { favorites, isLoaded } = useFavorites()
  const [playerName, setPlayerName] = useState('')
  const [roomId, setRoomId] = useState('')
  const [currentRoom, setCurrentRoom] = useState<BattleRoom | null>(null)
  const [myPokemon, setMyPokemon] = useState<any[]>([])
  const [selectedForBattle, setSelectedForBattle] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Limpa salas antigas
  useEffect(() => {
    cleanupOldRooms()
  }, [])

  // Polling quando está em uma sala
  useEffect(() => {
    if (!currentRoom) return
    
    const unsubscribe = pollRoom(currentRoom.id, (updatedRoom) => {
      setCurrentRoom(updatedRoom)
    })
    
    return unsubscribe
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRoom?.id])

  // Carrega dados dos Pokémon selecionados
  useEffect(() => {
    if (selectedForBattle.length === 3) {
      Promise.all(selectedForBattle.map(id => pokemonService.getByIdOrName(id)))
        .then(setMyPokemon)
    }
  }, [selectedForBattle])

  const handleJoinRoom = () => {
    if (!playerName.trim() || selectedForBattle.length !== 3) {
      setError('Digite seu nome e selecione 3 Pokémon!')
      
return
    }
    
    setIsLoading(true)
    const room = joinRoom(roomId || 'sala-1', playerName, selectedForBattle)

    if (room) {
      setCurrentRoom(room)
      setError('')
    }
    setIsLoading(false)
  }

  const handleSelectPokemonForRound = (index: number) => {
    if (!currentRoom) return
    const updated = selectPokemonForRound(currentRoom.id, getPlayerId(), index)

    if (updated) setCurrentRoom(updated)
  }

  const isMyTurn = currentRoom?.currentTurn === getPlayerId()
  const amIPlayer1 = currentRoom?.player1?.id === getPlayerId()
  const me = amIPlayer1 ? currentRoom?.player1 : currentRoom?.player2
  const opponent = amIPlayer1 ? currentRoom?.player2 : currentRoom?.player1

  // TELA DE SELEÇÃO DE 3 POKÉMON
  if (!currentRoom) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <Header onSearch={() => {}} isLoading={false} />
        
        <main className="pt-8 pb-12 max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <Users className="w-10 h-10 text-blue-400" />
              Batalha Multiplayer
            </h1>
            <p className="text-zinc-400">Melhor de 3 • 1v1 • 5 Salas Disponíveis</p>
          </div>

          {/* Salas disponíveis */}
          <div className="grid grid-cols-5 gap-2 mb-8">
            {[1, 2, 3, 4, 5].map(num => (
              <button
                key={num}
                onClick={() => setRoomId(`sala-${num}`)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  roomId === `sala-${num}`
                    ? 'border-blue-400 bg-blue-400/20 text-blue-400'
                    : 'border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500'
                }`}
              >
                <div className="text-2xl font-bold">{num}</div>
                <div className="text-xs">Sala</div>
              </button>
            ))}
          </div>

          {/* Nome do jogador */}
          <div className="mb-6">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Seu nome..."
              className="w-full p-4 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-center text-lg"
            />
          </div>

          {/* Seleção de 3 Pokémon */}
          <h2 className="text-xl font-semibold text-white mb-4 text-center">
            Escolha seus 3 Pokémon ({selectedForBattle.length}/3)
          </h2>
          
          {isLoaded && favorites.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-8">
              {favorites.map((id) => (
                <PokemonMiniCard
                  key={id}
                  id={id}
                  isSelected={selectedForBattle.includes(id)}
                  onClick={() => {
                    if (selectedForBattle.includes(id)) {
                      setSelectedForBattle(prev => prev.filter(p => p !== id))
                    } else if (selectedForBattle.length < 3) {
                      setSelectedForBattle(prev => [...prev, id])
                    }
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-zinc-500 py-8">
              Você precisa ter favoritos! <Link href="/pokemon" className="text-yellow-400">Adicione aqui</Link>
            </div>
          )}

          {error && <p className="text-red-400 text-center mb-4">{error}</p>}

          <button
            onClick={handleJoinRoom}
            disabled={isLoading || 
                selectedForBattle.length !== 3 || !playerName.trim() || !roomId}
            className="w-full py-4 bg-blue-400 hover:bg-blue-500 disabled:bg-zinc-700 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? <LoadingSpinner size="sm" /> : <><Swords className="w-5 h-5" /> ENTRAR NA SALA</>}
          </button>
        </main>
      </div>
    )
  }

  // AGUARDANDO OPONENTE
  if (currentRoom.status === 'waiting') {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="absolute inset-0 bg-blue-400/30 rounded-full animate-ping" />
            <Clock className="w-32 h-32 text-blue-400 animate-pulse" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Aguardando oponente...</h2>
          <p className="text-zinc-400">Sala: {currentRoom.id}</p>
          <p className="text-zinc-500 mt-4">Compartilhe o número da sala com um amigo!</p>
        </div>
      </div>
    )
  }

  // SELEÇÃO DE POKÉMON PARA A RODADA
  if (currentRoom.status === 'selecting' || (currentRoom.status === 'battling' && !me?.ready)) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <Header onSearch={() => {}} isLoading={false} />
        
        <main className="pt-8 pb-12 max-w-4xl mx-auto px-4">
          {/* Info do oponente */}
          <div className="flex justify-between items-center mb-8 p-4 bg-zinc-900 rounded-xl">
            <div>
              <p className="text-zinc-400 text-sm">Você</p>
              <p className="text-white font-bold">{me?.name}</p>
            </div>
            <div className="text-zinc-600">vs</div>
            <div className="text-right">
              <p className="text-zinc-400 text-sm">Oponente</p>
              <p className="text-white font-bold">{opponent?.name || '...'}</p>
              {opponent?.ready && <span className="text-green-400 text-xs">Pronto!</span>}
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white text-center mb-2">
            Rodada {currentRoom.round} de 3
          </h2>
          <p className="text-zinc-400 text-center mb-8">
            {isMyTurn ? 'Sua vez de escolher!' : 'Aguardando oponente...'}
          </p>

          <div className="grid grid-cols-3 gap-4">
            {myPokemon.map((pokemon, index) => (
              <button
                key={pokemon.id}
                onClick={() => handleSelectPokemonForRound(index)}
                disabled={!isMyTurn}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  me?.selectedPokemonIndex === index
                    ? 'border-green-400 bg-green-400/20 scale-105'
                    : 'border-zinc-700 bg-zinc-900 hover:border-zinc-500'
                } ${!isMyTurn ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="relative w-24 h-24 mx-auto mb-3">
                  <Image
                    src={pokemonService.getImageUrl(
                        pokemon.id, { official: true })}
                    alt={pokemon.name}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <p className="text-white font-bold capitalize">{pokemon.name}</p>
                <p className="text-zinc-400 text-sm">Poder: {
                  pokemon.stats.reduce(
                    (a: number, s: any) => a + s.base_stat, 0)
                }</p>
              </button>
            ))}
          </div>

          {me?.ready && !opponent?.ready && (
            <p className="text-center text-yellow-400 mt-8 animate-pulse">
              Aguardando {opponent?.name} escolher...
            </p>
          )}
        </main>
      </div>
    )
  }

  // BATALHA EM ANDAMENTO
  const currentAction = currentRoom.battleLog[currentRoom.battleLog.length - 1]
  
  return (
    <div className="min-h-screen bg-zinc-950">
      <Header onSearch={() => {}} isLoading={false} />
      
      <main className="pt-8 pb-12 max-w-6xl mx-auto px-4">
        {/* Placar */}
        <div className="flex justify-center gap-12 mb-8">
          <div className="text-center">
            <p className="text-blue-400 font-bold">{me?.name}</p>
            <div className="text-5xl font-bold text-white">
              {currentRoom.battleLog.filter(l => 
                amIPlayer1 ? l.winner === 'player1' : l.winner === 'player2'
              ).length}
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-3xl font-bold text-zinc-600">vs</span>
          </div>
          <div className="text-center">
            <p className="text-red-400 font-bold">{opponent?.name}</p>
            <div className="text-5xl font-bold text-white">
              {currentRoom.battleLog.filter(l => 
                amIPlayer1 ? l.winner === 'player2' : l.winner === 'player1'
              ).length}
            </div>
          </div>
        </div>

        <p className="text-center text-yellow-400 font-medium mb-8">
          RODADA {currentRoom.round} DE 3
        </p>

        {/* Arena */}
        <div className="relative bg-linear-to-b from-zinc-900 to-zinc-950 rounded-3xl p-8 border border-zinc-800 mb-8">
          <div className="flex justify-between items-center gap-8">
            {/* Meu Pokémon */}
            <div className="flex-1 text-center">
              {currentAction ? (
                <>
                  <PokemonDisplay 
                  id={currentAction.player1Pokemon} isPlayer1={true} />
                  <p className="text-3xl font-bold text-blue-400 mt-4">{currentAction.player1Power}</p>
                </>
              ) : (
                <div className="w-48 h-48 mx-auto bg-zinc-800 rounded-full flex items-center justify-center">
                  <Shield className="w-16 h-16 text-zinc-600" />
                </div>
              )}
            </div>

            {/* VS */}
            <div className="text-6xl font-black text-zinc-600">
              {currentAction ? '⚔️' : 'VS'}
            </div>

            {/* Oponente */}
            <div className="flex-1 text-center">
              {currentAction ? (
                <>
                  <PokemonDisplay 
                  id={currentAction.player2Pokemon} isPlayer1={false} />
                  <p className="text-3xl font-bold text-red-400 mt-4">{currentAction.player2Power}</p>
                </>
              ) : (
                <div className="w-48 h-48 mx-auto bg-zinc-800 rounded-full flex items-center justify-center">
                  <Shield className="w-16 h-16 text-zinc-600" />
                </div>
              )}
            </div>
          </div>

          {/* Resultado da rodada */}
          {currentAction && (
            <div className="mt-8 text-center">
              <div className={`text-2xl font-bold ${
                (amIPlayer1 && currentAction.winner === 'player1') || 
                (!amIPlayer1 && currentAction.winner === 'player2')
                  ? 'text-green-400'
                  : currentAction.winner === 'draw'
                    ? 'text-yellow-400'
                    : 'text-red-400'
              }`}>
                {(amIPlayer1 && currentAction.winner === 'player1') || 
                 (!amIPlayer1 && currentAction.winner === 'player2')
                  ? '✓ VOCÊ VENCEU ESTA RODADA!'
                  : currentAction.winner === 'draw'
                    ? '⟳ EMPATE!'
                    : '✗ VOCÊ PERDEU ESTA RODADA'}
              </div>
            </div>
          )}
        </div>

        {/* Botão próxima rodada ou resultado final */}
        {currentRoom.status === 'finished' ? (
          <div className="text-center">
            <div className={`text-5xl font-bold mb-4 ${
              currentRoom.winner === getPlayerId() ? 'text-yellow-400' : 'text-zinc-400'
            }`}>
              {currentRoom.winner === getPlayerId() ? '🏆 VITÓRIA!' : '💔 DERROTA!'}
            </div>
            <button
              onClick={() => setCurrentRoom(null)}
              className="px-8 py-4 bg-blue-400 hover:bg-blue-500 text-black font-bold rounded-full"
            >
              JOGAR NOVAMENTE
            </button>
          </div>
        ) : currentAction && (
          <div className="text-center">
            <p className="text-zinc-400 mb-4">Aguardando próxima rodada...</p>
          </div>
        )}
      </main>
    </div>
  )
}

// Componentes auxiliares
function PokemonMiniCard({ 
    id, isSelected, onClick 
}: { id: number; isSelected: boolean; onClick: () => void }) {
  const [pokemon, setPokemon] = useState<any>(null)
  
  useEffect(() => {
    pokemonService.getByIdOrName(id).then(setPokemon)
  }, [id])
  
  if (!pokemon) return <div className="aspect-square bg-zinc-800 rounded-xl animate-pulse" />
  
  return (
    <button
      onClick={onClick}
      className={`relative aspect-square p-2 rounded-xl border-2 transition-all ${
        isSelected ? 'border-blue-400 bg-blue-400/20' : 'border-zinc-700 bg-zinc-900'
      }`}
    >
      <Image
        src={pokemonService.getImageUrl(pokemon.id, { official: true })}
        alt={pokemon.name}
        fill
        className="object-contain p-2"
        unoptimized
      />
      {isSelected && (
        <div className="absolute top-1 right-1 w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center text-black font-bold text-xs">
          ✓
        </div>
      )}
    </button>
  )
}

function PokemonDisplay({ id, isPlayer1 }: { id: number; isPlayer1: boolean }) {
  const [pokemon, setPokemon] = useState<any>(null)
  
  useEffect(() => {
    pokemonService.getByIdOrName(id).then(setPokemon)
  }, [id])
  
  if (!pokemon) return <div className="w-48 h-48 animate-pulse bg-zinc-800 rounded-full" />
  
  return (
    <div className="relative w-48 h-48 mx-auto">
      <div className={`absolute inset-0 rounded-full blur-2xl ${isPlayer1 ? 'bg-blue-400/30' : 'bg-red-400/30'}`} />
      <Image
        src={pokemonService.getImageUrl(pokemon.id, { official: true })}
        alt={pokemon.name}
        fill
        className="object-contain relative z-10"
        unoptimized
      />
      <p className="absolute -bottom-8 left-0 right-0 text-center text-white font-bold capitalize">
        {pokemon.name}
      </p>
    </div>
  )
}