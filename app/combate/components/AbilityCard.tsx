'use client'

import { motion } from 'framer-motion'

import { SecretAbility } from "@/hooks/combate/useBattle"

interface AbilityCardProps {
  ability: SecretAbility
  index: number
  isSelected: boolean
  hasSelection: boolean
  onSelect: () => void
}

export function AbilityCard({ 
    ability, index, isSelected, hasSelection, onSelect }: AbilityCardProps) {
  const labels = ['A', 'B', 'C']

  const isRevealed = isSelected || ability.used
  
  const isDisabled = hasSelection && !isSelected
  
  return (
    <motion.button
      whileHover={!isDisabled ? { scale: 1.05, y: -10 } : {}}
      whileTap={!isDisabled ? { scale: 0.95 } : {}}
      onClick={!isDisabled ? onSelect : undefined}
      disabled={isDisabled}
      className={`
        relative p-6 rounded-2xl border-2 transition-all duration-300
        ${isSelected 
          ? 'border-yellow-400 bg-yellow-400/20 shadow-xl shadow-yellow-400/30' 
          : ability.used
            ? 'border-zinc-700 opacity-50 cursor-not-allowed'
            : isDisabled
              ? 'border-zinc-800 opacity-40 cursor-not-allowed bg-zinc-900/30'
              : 'border-zinc-700 hover:border-purple-500/50 bg-linear-to-br from-zinc-800 to-zinc-900'
        }
      `}
    >
      {/* Badge da letra */}
      <div className={`
        absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm border-2
        ${isSelected 
          ? 'bg-yellow-500 border-yellow-400' 
          : isDisabled 
            ? 'bg-zinc-800 border-zinc-700 text-zinc-500' 
            : 'bg-zinc-700 border-zinc-600'
        }
      `}>
        {labels[index]}
      </div>

      {/* Ícone com gradiente */}
      <div className={`
        w-20 h-20 mx-auto rounded-2xl bg-linear-to-br ${ability.color}
        flex items-center justify-center text-4xl mb-4 shadow-lg
        ${isSelected ? 'scale-110' : ''}
        ${isDisabled ? 'opacity-50 grayscale' : ''}
        transition-all duration-300
      `}>
        {!isRevealed ? '❓' : ability.icon}
      </div>

      {/* Descrição - sempre oculta até revelar */}
      <div className="text-center space-y-2">
        <p className={`
          font-bold text-lg
          ${isDisabled ? 'text-zinc-600' : 'text-white'}
        `}>
          {!isRevealed ? '???' : (
            <>
              {ability.effect.type === 'buff' && 
                `+${ability.effect.value} ${ability.effect.stat === 'attack' ? 'ATAQUE' : 'DEFESA'}`}

              {ability.effect.type === 'debuff' && 
                `-${ability.effect.value} ${ability.effect.stat === 'attack' ? 'ATAQUE' : 'DEFESA'} (RISCO)`}

              {ability.effect.type === 'reveal' && 
                `REVELAR ${ability.effect.target === 'all' ? 'TUDO' : ability.effect.target.toUpperCase()}`}

              {ability.effect.type === 'neutral' && 'NEUTRO'}
            </>
          )}
        </p>
        
        <p className={`
          text-sm
          ${isDisabled ? 'text-zinc-700' : 'text-zinc-400'}
        `}>
          {!isRevealed ? 'Efeito desconhecido...' : (
            <>
              {ability.effect.type === 'buff' && 'Aumente seus atributos'}
              {ability.effect.type === 'debuff' && 'Redução, mas pode ser arriscado'}
              {ability.effect.type === 'reveal' && 'Descubra segredos do oponente'}
              {ability.effect.type === 'neutral' && 'Nenhum efeito especial'}
            </>
          )}
        </p>
      </div>

      {/* Indicador de selecionado */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-400 text-zinc-900 text-xs font-bold rounded-full"
        >
          SELECIONADO
        </motion.div>
      )}

      {isDisabled && (
        <div className="absolute inset-0 rounded-2xl bg-zinc-950/20 backdrop-blur-[1px]" />
      )}
    </motion.button>
  )
}