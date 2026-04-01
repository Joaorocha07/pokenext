/* eslint-disable @next/next/no-img-element */
'use client'

import { motion } from 'framer-motion'

import { Pokemon } from '@/services/pokeapi/types'

import { getTypeColor } from '@/hooks/combate/useBattle'

import { pokemonService } from '@/services/pokeapi/pokemonService'

interface BattlePokemon extends Pokemon {
  currentHp: number
  maxHp: number
  buffs: { attack: number; defense: number }
  revealed: { type: boolean; stats: boolean }
}

interface BattleCardProps {
  pokemon: BattlePokemon
  isPlayer: boolean
  showHp?: boolean
  showStats?: boolean
  isSelected?: boolean
  onClick?: () => void
  disabled?: boolean
}

export function BattleCard({
  pokemon,
  isPlayer,
  showHp = false,
  showStats = false,
  isSelected = false,
  onClick,
  disabled = false,
}: BattleCardProps) {
  const hpPercent = Math.max(0, (pokemon.currentHp / pokemon.maxHp) * 100)
  const isFainted = pokemon.currentHp <= 0

  const attackStat = pokemon.stats.find(s => s.stat.name === 'attack')?.base_stat || 0
  const defenseStat = pokemon.stats.find(s => s.stat.name === 'defense')?.base_stat || 0

  return (
    <motion.div
      whileHover={!disabled ? { scale: 1.02, y: -5 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={!disabled ? onClick : undefined}
      className={`
        relative p-6 rounded-2xl border-2 transition-all cursor-pointer
        ${isSelected 
          ? 'border-yellow-400 bg-yellow-400/20 shadow-lg shadow-yellow-400/25' 
          : isPlayer 
            ? 'border-emerald-500/50 bg-emerald-500/10 hover:border-emerald-400' 
            : 'border-red-500/50 bg-red-500/10 hover:border-red-400'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${isFainted ? 'grayscale opacity-60' : ''}
      `}
    >
      {/* Imagem do Pokémon */}
      <div className="relative">
        <img
          src={pokemonService.getImageUrl(pokemon.id)}
          alt={pokemon.name}
          className="w-32 h-32 mx-auto object-contain drop-shadow-lg"
        />
        
        {/* Overlay de mistério para oponente */}
        {!isPlayer && !pokemon.revealed.type && (
          <div className="absolute inset-0 bg-zinc-900/95 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <div className="text-center">
              <span className="text-5xl">❓</span>
              <p className="text-zinc-500 text-sm mt-2">Misterioso</p>
            </div>
          </div>
        )}
      </div>

      {/* Nome e Tipos */}
      <div className="mt-4 text-center">
        <h3 className="text-lg font-bold text-white capitalize">
          {pokemon.name}
        </h3>
        
        {(isPlayer || pokemon.revealed.type) && (
          <div className="flex justify-center gap-2 mt-2">
            {pokemon.types.map(t => (
              <span
                key={t.type.name}
                className={`
                  px-3 py-1 rounded-full text-xs font-medium uppercase
                  bg-${getTypeColor(t.type.name)}-500/20 
                  text-${getTypeColor(t.type.name)}-300
                  border border-${getTypeColor(t.type.name)}-500/30
                `}
              >
                {t.type.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      {showStats && (isPlayer || pokemon.revealed.stats) && (
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div className="bg-zinc-800/50 rounded-lg p-2 text-center">
            <p className="text-zinc-400">ATK</p>
            <p className="text-white font-bold">
              {attackStat}
              {pokemon.buffs.attack !== 0 && (
                <span className={pokemon.buffs.attack > 0 ? 'text-emerald-400' : 'text-red-400'}>
                  {pokemon.buffs.attack > 0 ? '+' : ''}{pokemon.buffs.attack}
                </span>
              )}
            </p>
          </div>
          <div className="bg-zinc-800/50 rounded-lg p-2 text-center">
            <p className="text-zinc-400">DEF</p>
            <p className="text-white font-bold">
              {defenseStat}
              {pokemon.buffs.defense !== 0 && (
                <span className={pokemon.buffs.defense > 0 ? 'text-emerald-400' : 'text-red-400'}>
                  {pokemon.buffs.defense > 0 ? '+' : ''}{pokemon.buffs.defense}
                </span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Barra de HP */}
      {showHp && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-zinc-400 mb-1">
            <span>HP</span>
            <span>{pokemon.currentHp}/{pokemon.maxHp}</span>
          </div>
          <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: `${hpPercent}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className={`
                h-full rounded-full
                ${hpPercent > 50 ? 'bg-linear-to-r from-emerald-500 to-emerald-400' : 
                  hpPercent > 20 ? 'bg-linear-to-r from-yellow-500 to-yellow-400' : 
                  'bg-linear-to-r from-red-600 to-red-500'}
              `}
            />
          </div>
        </div>
      )}

      {/* Indicador de desmaiado */}
      {isFainted && (
        <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center">
          <span className="text-4xl">💀</span>
        </div>
      )}

      {/* Buffs/Debuffs visuais */}
      {pokemon.buffs.attack > 0 && (
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-pulse">
          ATK+{pokemon.buffs.attack}
        </div>
      )}
      {pokemon.buffs.defense > 0 && (
        <div className="absolute -top-2 -left-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-pulse">
          DEF+{pokemon.buffs.defense}
        </div>
      )}
    </motion.div>
  )
}
