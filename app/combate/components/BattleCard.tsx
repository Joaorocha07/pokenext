/* eslint-disable @next/next/no-img-element */
'use client'

import { Pokemon } from '@/services/pokeapi/types'

import { AnimatePresence, motion } from 'framer-motion'

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
  hideFainted?: boolean
  showDamage?: boolean
}

export function BattleCard({
  pokemon,
  isPlayer,
  showHp = false,
  showStats = false,
  isSelected = false,
  onClick,
  disabled = false,
  hideFainted = false,
}: BattleCardProps) {
  const hpPercent = Math.max(0, (pokemon.currentHp / pokemon.maxHp) * 100)
  const isFainted = pokemon.currentHp <= 0

  const attackStat = pokemon.stats.find(s => s.stat.name === 'attack')?.base_stat || 0
  const defenseStat = pokemon.stats.find(s => s.stat.name === 'defense')?.base_stat || 0

  const isFullyRevealed = isPlayer || pokemon.revealed
  const isImageRevealed = isFullyRevealed
  const isTypeRevealed = isFullyRevealed || pokemon.revealed?.type
  const isStatsRevealed = isFullyRevealed || pokemon.revealed?.stats

  // NOVO: Durante a batalha, mostra HP mínimo visual mesmo se for 0
  const displayHpPercent = hideFainted && isFainted ? 5 : hpPercent
  const showFaintedOverlay = isFainted && !hideFainted

  return (
    <motion.div
      whileHover={!disabled ? { scale: 1.02, y: -5 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={!disabled ? onClick : undefined}
      className={`
        relative p-6 rounded-2xl border-2 transition-all cursor-pointer overflow-hidden
        ${isSelected 
          ? 'border-yellow-400 bg-yellow-400/20 shadow-lg shadow-yellow-400/25' 
          : isPlayer 
            ? 'border-emerald-500/50 bg-emerald-500/10 hover:border-emerald-400' 
            : isFullyRevealed
              ? 'border-red-500/50 bg-red-500/10 hover:border-red-400'
              : 'border-zinc-700/50 bg-zinc-800/30 hover:border-zinc-600'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${isFainted && !hideFainted ? 'grayscale opacity-60' : ''}
        ${isFainted && hideFainted ? 'opacity-90' : ''} // Durante batalha mantém opacidade normal
      `}
    >
      {/* Imagem do Pokémon */}
      <div className="relative h-32 w-full">
        <AnimatePresence mode="wait">
          {isImageRevealed ? (
            <motion.div
              key="revealed"
              initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <img
                src={pokemonService.getImageUrl(pokemon.id)}
                alt={pokemon.name}
                className={`
                  w-32 h-32 object-contain drop-shadow-2xl
                  ${isFainted && hideFainted ? 'brightness-75' : ''} // Escurece levemente se desmaiado escondido
                `}
              />
              
              {/* NOVO: Efeito de "critico" quando esconde desmaio */}
              {isFainted && hideFainted && (
                <motion.div
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-red-900/20 rounded-full blur-xl"
                />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="absolute inset-0 bg-zinc-900/90 rounded-xl flex flex-col items-center justify-center backdrop-blur-md border-2 border-zinc-700/50"
            >
              <motion.span 
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-5xl filter drop-shadow-lg"
              >
                ❓
              </motion.span>
              <p className="text-zinc-500 text-xs mt-2 font-medium uppercase tracking-wider">
                Pokémon Misterioso
              </p>
              <div className="mt-2 flex gap-1">
                <div className="w-2 h-2 bg-zinc-600 rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-zinc-600 rounded-full animate-pulse delay-75" />
                <div className="w-2 h-2 bg-zinc-600 rounded-full animate-pulse delay-150" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Efeito de revelação */}
        {isImageRevealed && !isPlayer && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-white/20 rounded-xl pointer-events-none"
          />
        )}
      </div>

      {/* Nome */}
      <div className="mt-4 text-center">
        <AnimatePresence mode="wait">
          {isFullyRevealed || isImageRevealed ? (
            <motion.h3
              key="name-revealed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`
                text-lg font-bold capitalize
                ${isPlayer ? 'text-emerald-400' : 'text-red-400'}
                ${isFainted && hideFainted ? 'opacity-70' : ''}
              `}
            >
              {pokemon.name}
            </motion.h3>
          ) : (
            <motion.p
              key="name-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-zinc-600 font-bold text-lg tracking-widest"
            >
              ???
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Tipos */}
      <div className="mt-2 h-8">
        {isTypeRevealed ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center gap-2"
          >
            {pokemon.types.map(t => (
              <span
                key={t.type.name}
                className={`
                  px-3 py-1 rounded-full text-xs font-medium uppercase
                  bg-${getTypeColor(t.type.name)}-500/20 
                  text-${getTypeColor(t.type.name)}-300
                  border border-${getTypeColor(t.type.name)}-500/30
                  ${isFainted && hideFainted ? 'opacity-50' : ''}
                `}
              >
                {t.type.name}
              </span>
            ))}
          </motion.div>
        ) : (
          <div className="flex justify-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs bg-zinc-800 text-zinc-600 border border-zinc-700">
              ???
            </span>
          </div>
        )}
      </div>

      {/* Stats */}
      {showStats && (
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          {isStatsRevealed ? (
            <>
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`
                  bg-zinc-800/50 rounded-lg p-2 text-center border border-zinc-700/50
                  ${isFainted && hideFainted ? 'opacity-60' : ''}
                `}
              >
                <p className="text-zinc-400 text-xs uppercase">ATK</p>
                <p className="text-white font-bold text-lg">
                  {attackStat}
                  {pokemon.buffs.attack !== 0 && (
                    <span className={pokemon.buffs.attack > 0 ? 'text-emerald-400' : 'text-red-400'}>
                      {pokemon.buffs.attack > 0 ? '+' : ''}{pokemon.buffs.attack}
                    </span>
                  )}
                </p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`
                  bg-zinc-800/50 rounded-lg p-2 text-center border border-zinc-700/50
                  ${isFainted && hideFainted ? 'opacity-60' : ''}
                `}
              >
                <p className="text-zinc-400 text-xs uppercase">DEF</p>
                <p className="text-white font-bold text-lg">
                  {defenseStat}
                  {pokemon.buffs.defense !== 0 && (
                    <span className={pokemon.buffs.defense > 0 ? 'text-emerald-400' : 'text-red-400'}>
                      {pokemon.buffs.defense > 0 ? '+' : ''}{pokemon.buffs.defense}
                    </span>
                  )}
                </p>
              </motion.div>
            </>
          ) : (
            <>
              <div className="bg-zinc-800/30 rounded-lg p-2 text-center border border-zinc-800">
                <p className="text-zinc-600 text-xs uppercase">ATK</p>
                <p className="text-zinc-700 font-bold text-lg">??</p>
              </div>
              <div className="bg-zinc-800/30 rounded-lg p-2 text-center border border-zinc-800">
                <p className="text-zinc-600 text-xs uppercase">DEF</p>
                <p className="text-zinc-700 font-bold text-lg">??</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Barra de HP - MODIFICADA para esconder desmaio durante batalha */}
      {showHp && (
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1">
            <span className={isPlayer ? 'text-emerald-400' : 'text-red-400'}>HP</span>
            <span className={`
              text-zinc-400
              ${isFainted && hideFainted ? 'opacity-0' : ''} // Esconde texto "0/XX" durante batalha
            `}>
              {isFullyRevealed || isPlayer ? `${pokemon.currentHp}/${pokemon.maxHp}` : '???'}
            </span>
            {/* NOVO: Mostra "???" quando esconde desmaio */}
            {isFainted && hideFainted && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 font-bold"
              >
                ???
              </motion.span>
            )}
          </div>
          <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700 relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${displayHpPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`
                h-full rounded-full relative
                ${isFainted && hideFainted 
                  ? 'bg-linear-to-r from-red-900 to-red-700 animate-pulse' // Barra vermelha escura pulsante
                  : hpPercent > 50 
                    ? 'bg-linear-to-r from-emerald-500 to-emerald-400' 
                    : hpPercent > 20 
                      ? 'bg-linear-to-r from-yellow-500 to-yellow-400' 
                      : 'bg-linear-to-r from-red-600 to-red-500'
                }
              `}
            >
              {/* Efeito de perigo quando esconde desmaio */}
              {isFainted && hideFainted && (
                <motion.div
                  animate={{ x: [-20, 20, -20] }}
                  transition={{ duration: 0.2, repeat: Infinity }}
                  className="absolute inset-0 bg-white/10"
                />
              )}
            </motion.div>
          </div>
        </div>
      )}

      {/* Indicador de desmaiado - AGORA CONDICIONAL */}
      <AnimatePresence>
        {showFaintedOverlay && (
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute inset-0 bg-black/70 rounded-2xl flex flex-col items-center justify-center backdrop-blur-sm z-20"
          >
            <motion.span 
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
              className="text-5xl mb-2"
            >
              💀
            </motion.span>
            <p className="text-zinc-400 font-bold uppercase tracking-wider">Desmaiou</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NOVO: Indicador sutil de "critico" quando esconde desmaio */}
      {isFainted && hideFainted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-2 right-2 px-2 py-1 bg-red-900/50 border border-red-500/50 rounded-full"
        >
          <span className="text-red-400 text-xs font-bold animate-pulse">⚠ CRÍTICO</span>
        </motion.div>
      )}

      {/* Buffs/Debuffs visuais */}
      {pokemon.buffs.attack > 0 && (
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="absolute -top-2 -right-2 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-red-500/30 border-2 border-red-400"
        >
          ATK+{pokemon.buffs.attack}
        </motion.div>
      )}
      {pokemon.buffs.attack < 0 && (
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="absolute -top-2 -right-2 w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-orange-600/30 border-2 border-orange-500"
        >
          ATK{pokemon.buffs.attack}
        </motion.div>
      )}
      {pokemon.buffs.defense > 0 && (
        <motion.div 
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="absolute -top-2 -left-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-blue-500/30 border-2 border-blue-400"
        >
          DEF+{pokemon.buffs.defense}
        </motion.div>
      )}
      {pokemon.buffs.defense < 0 && (
        <motion.div 
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="absolute -top-2 -left-2 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-purple-600/30 border-2 border-purple-500"
        >
          DEF{pokemon.buffs.defense}
        </motion.div>
      )}

      {/* Badge de revelação */}
      {!isPlayer && isFullyRevealed && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-2 left-2 px-2 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded-full"
        >
          <span className="text-yellow-400 text-xs font-bold">👁 REVELADO</span>
        </motion.div>
      )}
    </motion.div>
  )
}