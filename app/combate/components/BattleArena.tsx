'use client'

import { BattleLog } from './BattleLog'

import { motion } from 'framer-motion'

import { BattleCard } from './BattleCard'

import { BattlePokemon } from '@/hooks/combate/useBattle'

interface BattleArenaProps {
  player: BattlePokemon
  machine: BattlePokemon
  logs: string[]
}

export function BattleArena({ player, machine, logs }: BattleArenaProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[70vh]"
    >
      {/* VS Central */}
      <div className="relative flex items-center justify-center gap-8 md:gap-16 mb-8">
        {/* Pokémon do Jogador */}
        <motion.div
          animate={{ 
            x: [0, -30, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 0.6, 
            repeat: 2,
            ease: 'easeInOut'
          }}
        >
          <BattleCard
            pokemon={player} 
            isPlayer 
            showHp 
            showStats 
          />
        </motion.div>

        {/* VS */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 1,
            repeat: Infinity,
            repeatDelay: 0.5
          }}
          className="text-6xl md:text-8xl font-black text-white drop-shadow-2xl"
        >
          VS
        </motion.div>

        {/* Pokémon da Máquina */}
        <motion.div
          animate={{ 
            x: [0, 30, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 0.6, 
            repeat: 2,
            ease: 'easeInOut',
            delay: 0.3
          }}
        >
          <BattleCard 
            pokemon={machine} 
            isPlayer={false} 
            showHp 
            showStats={machine.revealed.stats}
          />
        </motion.div>
      </div>

      {/* Log de batalha */}
      <BattleLog logs={logs} />

      {/* Efeitos visuais de impacto */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 0.5, repeat: 3 }}
          className="absolute top-1/2 left-1/4 w-32 h-32 bg-emerald-500/30 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 0.5, repeat: 3, delay: 0.3 }}
          className="absolute top-1/2 right-1/4 w-32 h-32 bg-red-500/30 rounded-full blur-3xl"
        />
      </div>
    </motion.div>
  )
}