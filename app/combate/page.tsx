/* eslint-disable max-len */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useEffect, useState } from 'react'

import { BattleLog } from './components/BattleLog'

import { BattleCard } from './components/BattleCard'

import { useBattle } from '@/hooks/combate/useBattle'

import { AbilityCard } from './components/AbilityCard'

import { BattleArena } from './components/BattleArena'

import type { Pokemon } from '@/services/pokeapi/types'

import { AnimatePresence, motion } from 'framer-motion'

import { useFavorites } from '@/hooks/pokemon/useFavorites'

import { RoundIndicator } from './components/RoundIndicator'

import { EmptyState } from '../pokemon/components/EmptyState'

import { pokemonService } from '@/services/pokeapi/pokemonService'

import { LoadingSpinner } from '../pokemon/components/LoadingSpinner'

import confetti from 'canvas-confetti'

export default function BattlePage() {
  const { favorites, isLoaded } = useFavorites()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [availablePokemons, setAvailablePokemons] = useState<Pokemon[]>([])

  const {
    team,
    phase,
    abilities,
    battleLog,
    finalStats,
    currentRound,
    selectedAbilityId,
    currentRoundStats,
    nextRound,
    useAbility,
    resetBattle,
    startBattle,
    executeBattle
  } = useBattle()

  const bothFainted = team.player[currentRound]?.currentHp <= 0 && 
    team.machine[currentRound].currentHp <= 0

  console.log(bothFainted)

  // Carregar favoritos
  useEffect(() => {
    if (!isLoaded) return
    
    if (favorites.length > 0) {
      setIsLoading(true)
      Promise.all(favorites.map(id => pokemonService.getByIdOrName(String(id))))
        .then(results => {
          setAvailablePokemons(results)
          setIsLoading(false)
        })
        .catch(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [favorites, isLoaded])

  // Iniciar batalha
  const handleStartBattle = () => {
    const selected = availablePokemons.filter(p => selectedIds.includes(p.id))

    startBattle(selected)
  }

  // Efeito de vitória
  const triggerVictory = () => {
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    const randomInRange = (
      min: number, max: number) => Math.random() * (max - min) + min

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
    }, 250)
  }

  // Renderizar fase de seleção
  const renderSelection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-white">
          ⚔️ Arena de Batalha
        </h1>
        <p className="text-zinc-400 text-lg">
          Monte seu time de 3 Pokémon e enfrente desafios misteriosos
        </p>
        
        {/* Indicador de seleção */}
        <div className="flex justify-center gap-4 mt-6">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              animate={{
                scale: selectedIds.length > i ? 1.1 : 1,
                borderColor: selectedIds.length > i ? '#10b981' : '#52525b'
              }}
              className={`
                w-16 h-16 rounded-2xl border-2 flex items-center justify-center text-2xl
                transition-colors duration-300
                ${selectedIds.length > i 
                  ? 'bg-emerald-500/20 border-emerald-500' 
                  : 'bg-zinc-800 border-zinc-600'}
              `}
            >
              {selectedIds.length > i ? (
                <img 
                  src={pokemonService.getImageUrl(selectedIds[i])}
                  alt="selected"
                  className="w-12 h-12 object-contain"
                />
              ) : (
                <span className="text-zinc-500">{i + 1}</span>
              )}
            </motion.div>
          ))}
        </div>
        <p className="text-sm text-zinc-500">
          {selectedIds.length}/3 Pokémon selecionados
        </p>
      </div>

      {/* Grid de Pokémon */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {availablePokemons.map(pokemon => {
          const isSelected = selectedIds.includes(pokemon.id)
          const canSelect = selectedIds.length < 3 || isSelected

          return (
            <motion.button
              key={pokemon.id}
              layoutId={`pokemon-${pokemon.id}`}
              whileHover={canSelect ? { scale: 1.03, y: -5 } : {}}
              whileTap={canSelect ? { scale: 0.97 } : {}}
              onClick={() => {
                if (isSelected) {
                  setSelectedIds(prev => prev.filter(id => id !== pokemon.id))
                } else if (canSelect) {
                  setSelectedIds(prev => [...prev, pokemon.id])
                }
              }}
              className={`
                relative p-4 rounded-2xl border-2 transition-all
                ${isSelected
                  ? 'border-emerald-500 bg-emerald-500/20 shadow-lg shadow-emerald-500/20'
                  : canSelect
                    ? 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-500 hover:bg-zinc-800'
                    : 'border-zinc-800 bg-zinc-900/50 opacity-50 cursor-not-allowed'}
              `}
            >
              <img
                src={pokemonService.getImageUrl(pokemon.id)}
                alt={pokemon.name}
                className="w-24 h-24 mx-auto object-contain drop-shadow-lg"
              />
              <p className="text-center capitalize text-white font-semibold mt-2">
                {pokemon.name}
              </p>
              <div className="flex justify-center gap-1 mt-2">
                {pokemon.types.map(t => (
                  <span
                    key={t.type.name}
                    className="px-2 py-0.5 rounded-full text-xs bg-zinc-700 text-zinc-300"
                  >
                    {t.type.name}
                  </span>
                ))}
              </div>
              
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg"
                >
                  <span className="text-white text-sm">✓</span>
                </motion.div>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Botão de iniciar */}
      <AnimatePresence>
        {selectedIds.length === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-0 right-0 flex justify-center z-50"
          >
            <button
              onClick={handleStartBattle}
              className="
                px-10 py-5 bg-linear-to-r from-emerald-500 to-teal-500 
                text-white font-bold text-lg rounded-full 
                shadow-2xl shadow-emerald-500/30 
                hover:shadow-emerald-500/50 hover:scale-105
                transition-all duration-300
                flex items-center gap-3
              "
            >
              <span>⚔️</span>
              Iniciar Batalha
              <span>⚔️</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )

  // Renderizar fase de habilidades
  const renderAbilities = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white">🎲 Habilidades ocultas</h2>
        <p className="text-zinc-400">
          Round {currentRound + 1} de 3 • Escolha uma habilidade ou arrisque sem usar
        </p>
      </div>

      {/* Cards de habilidade */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {abilities.map((ability, index) => (
          <AbilityCard
            key={ability.id}
            ability={ability}
            index={index}
            isSelected={selectedAbilityId === ability.id}
            hasSelection={selectedAbilityId !== null}
            onSelect={() => useAbility(ability.id)}
          />
        ))}
      </div>

      {/* Preview do confronto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="space-y-4">
          <p className="text-center text-emerald-400 font-bold text-lg">Seu Pokémon</p>
          <BattleCard
              pokemon={team.player[currentRound]}
              isPlayer={true}
              showStats={true}
              showHp={true}
              isDraw={bothFainted}
            />
        </div>
        
        <div className="space-y-4">
          <p className="text-center text-red-400 font-bold text-lg">Oponente</p>
          <BattleCard
            pokemon={team.machine[currentRound]}
            isPlayer={false}
            showStats={team.machine[currentRound].revealed?.stats}
            showHp={true}
            isDraw={bothFainted}
          />
        </div>
      </div>

      {/* Botões de ação */}
      <div className="flex justify-center gap-4">
        <button
          onClick={executeBattle}
          className="
            px-8 py-4 border-2 border-zinc-600 text-zinc-400 
            rounded-full font-semibold
            hover:border-zinc-400 hover:text-white 
            transition-all duration-300
          "
        >
          Pular Habilidade →
        </button>
        
        {selectedAbilityId && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={executeBattle}
            className="
              px-8 py-4 bg-linear-to-r from-purple-500 to-pink-500 
              text-white rounded-full font-bold
              shadow-lg shadow-purple-500/25
              hover:shadow-purple-500/40 hover:scale-105
              transition-all duration-300
            "
          >
            Usar Habilidade & Atacar!
          </motion.button>
        )}
      </div>
    </motion.div>
  )

  // Renderizar resultado
  const renderResult = () => {
    if (!currentRoundStats) return null
    
    const { playerWon, draw } = currentRoundStats
    
    const playerPokemon = team.player[currentRound]
    const machinePokemon = team.machine[currentRound]
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-8"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className={`
            text-7xl font-black
            ${draw ? 'text-yellow-400' : playerWon ? 'text-emerald-400' : 'text-red-400'}
          `}
        >
          {draw ? '🤝 EMPATE!' : playerWon ? '🎉 VITÓRIA!' : '💔 DERROTA!'}
        </motion.div>

        <div className="grid grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Card do Jogador */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={`
              p-6 rounded-2xl border-2 flex flex-col items-center
              ${playerWon ? 'bg-emerald-500/20 border-emerald-500' : 'bg-zinc-800 border-zinc-700'}
            `}
          >
            {/* Imagem do Pokémon do Jogador */}
            <motion.img
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              src={pokemonService.getImageUrl(playerPokemon.id)}
              alt={playerPokemon.name}
              className={`
                w-32 h-32 object-contain mb-4 drop-shadow-2xl
                ${playerPokemon.currentHp <= 0 ? 'grayscale opacity-60' : ''}
              `}
            />
            
            <p className="text-emerald-400 font-bold mb-2 capitalize text-lg">
              {playerPokemon.name}
            </p>
            <p className="text-4xl font-black text-white">
              {playerPokemon.currentHp} HP
            </p>
            <p className="text-sm text-zinc-400 mt-2">
              {playerPokemon.currentHp > 0 ? 'Sobreviveu!' : 'Desmaiou'}
            </p>
          </motion.div>
          
          {/* Card da Máquina */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={`
              p-6 rounded-2xl border-2 flex flex-col items-center
              ${!playerWon && !draw ? 'bg-red-500/20 border-red-500' : 'bg-zinc-800 border-zinc-700'}
            `}
          >
            {/* Imagem do Pokémon da Máquina */}
            <motion.img
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              src={pokemonService.getImageUrl(machinePokemon.id)}
              alt={machinePokemon.name}
              className={`
                w-32 h-32 object-contain mb-4 drop-shadow-2xl
                ${machinePokemon.currentHp <= 0 ? 'grayscale opacity-60' : ''}
              `}
            />
            
            <p className="text-red-400 font-bold mb-2 capitalize text-lg">
              {machinePokemon.name}
            </p>
            <p className="text-4xl font-black text-white">
              {machinePokemon.currentHp} HP
            </p>
            <p className="text-sm text-zinc-400 mt-2">
              {machinePokemon.currentHp > 0 ? 'Sobreviveu!' : 'Desmaiou'}
            </p>
          </motion.div>
        </div>

        <BattleLog logs={battleLog} />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={nextRound}
          className="
            px-10 py-5 bg-emerald-500 text-white font-bold rounded-full
            shadow-xl shadow-emerald-500/25
            hover:shadow-emerald-500/40
            transition-all duration-300
          "
        >
          {currentRound < 2 ? 'Próximo Round →' : 'Ver Resultado Final'}
        </motion.button>
      </motion.div>
    )
  }

  // Renderizar tela final
  const renderFinal = () => {
    const won = finalStats.playerWins > finalStats.machineWins
    const lost = finalStats.playerWins < finalStats.machineWins
    const draw = finalStats.playerWins === finalStats.machineWins
    
    if (won) triggerVictory()
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center space-y-8"
      >
        <motion.div
          initial={{ scale: 0, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="space-y-4"
        >
          <div className="text-8xl">
            {won ? '🏆' : draw ? '🤝' : '💔'}
          </div>
          <h2 className={`
            text-5xl md:text-6xl font-black
            ${won ? 'text-emerald-400' : draw ? 'text-yellow-400' : 'text-red-400'}
          `}>
            {won ? 'VITÓRIA TOTAL!' : draw ? 'EMPATE!' : 'DERROTA...'}
          </h2>
          <p className="text-zinc-400 text-xl">
            {won 
              ? 'Você provou ser um verdadeiro mestre Pokémon!' 
              : draw 
                ? 'Uma batalha equilibrada! Ninguém saiu vencedor desta vez.'
                : 'Não foi dessa vez. Treine mais e tente novamente!'}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto">
          <div className={`
            p-6 rounded-2xl border-2
            ${won 
              ? 'bg-emerald-500/10 border-emerald-500/50' 
              : draw 
                ? 'bg-yellow-500/10 border-yellow-500/50'
                : 'bg-zinc-800/50 border-zinc-700/50'}
          `}>
            <p className={`
              font-bold mb-2
              ${won ? 'text-emerald-400' : draw ? 'text-yellow-400' : 'text-zinc-400'}
            `}>
              Suas Vitórias
            </p>
            <p className="text-5xl font-black text-white">{finalStats.playerWins}</p>
            <p className="text-sm text-zinc-500 mt-2">de 3 rounds</p>
          </div>
          <div className={`
            p-6 rounded-2xl border-2
            ${lost 
              ? 'bg-red-500/10 border-red-500/50' 
              : draw 
                ? 'bg-yellow-500/10 border-yellow-500/50'
                : 'bg-zinc-800/50 border-zinc-700/50'}
          `}>
            <p className={`
              font-bold mb-2
              ${lost ? 'text-red-400' : draw ? 'text-yellow-400' : 'text-zinc-400'}
            `}>
              Vitórias Máquina
            </p>
            <p className="text-5xl font-black text-white">{finalStats.machineWins}</p>
            <p className="text-sm text-zinc-500 mt-2">de 3 rounds</p>
          </div>
        </div>

        {/* Cards dos 3 Pokémon de cada lado no empate */}
        {draw && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <p className="text-zinc-400">Time que batalhou:</p>
            <div className="flex justify-center gap-4 flex-wrap">
              {team.player.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="relative"
                >
                  <img
                    src={pokemonService.getImageUrl(p.id)}
                    alt={p.name}
                    className="w-16 h-16 object-contain bg-zinc-800/50 rounded-xl p-2 border border-zinc-700"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-zinc-900">
                    =
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="flex justify-center gap-4">
          <button
            onClick={resetBattle}
            className="
              px-8 py-4 bg-zinc-700 text-white font-bold rounded-full
              hover:bg-zinc-600 transition-all duration-300
            "
          >
            Jogar Novamente
          </button>
          <a
            href="/pokemon"
            className={`
              px-8 py-4 font-bold rounded-full transition-all duration-300
              ${draw 
                ? 'bg-yellow-500 text-zinc-900 hover:bg-yellow-400' 
                : 'bg-emerald-500 text-white hover:bg-emerald-600'}
            `}
          >
            Ver Pokémons
          </a>
        </div>
      </motion.div>
    )
  }

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 pt-24 px-4">
        <div className="max-w-4xl mx-auto">
          <EmptyState 
            type="no-favorites" 
            message="Você precisa de favoritos para batalhar!"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* <Header /> */}
      
      <main className="pt-24 pb-32 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Indicador de rounds */}
          {phase !== 'selection' && phase !== 'victory' && phase !== 'defeat' && (
            <RoundIndicator current={currentRound} total={3} />
          )}

          <AnimatePresence mode="wait">
            {phase === 'selection' && renderSelection()}
            {phase === 'abilities' && renderAbilities()}
            {phase === 'battle' && (
              <BattleArena
                player={team.player[currentRound]}
                machine={team.machine[currentRound]}
                logs={battleLog}
              />
            )}
            {phase === 'result' && renderResult()}
            {(phase === 'victory' || phase === 'defeat') && renderFinal()}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
