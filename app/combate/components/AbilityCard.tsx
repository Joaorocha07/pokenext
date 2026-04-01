'use client'

import { motion } from 'framer-motion'

import { SecretAbility } from "@/hooks/combate/useBattle"

interface AbilityCardProps {
  ability: SecretAbility
  index: number
  isSelected: boolean
  onSelect: () => void
}

export function AbilityCard({ 
    ability, index, isSelected, onSelect }: AbilityCardProps) {
  const labels = ['A', 'B', 'C']
  
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -10 }}
      whileTap={{ scale: 0.95 }}
      onClick={onSelect}
      className={`
        relative p-6 rounded-2xl border-2 transition-all duration-300
        ${isSelected 
          ? 'border-yellow-400 bg-yellow-400/20 shadow-xl shadow-yellow-400/30' 
          : ability.used
            ? 'border-zinc-700 opacity-50 cursor-not-allowed'
            : 'border-zinc-700 hover:border-purple-500/50 bg-linear-to-br from-zinc-800 to-zinc-900'
        }
      `}
    >
      {/* Badge da letra */}
      <div className="absolute -top-3 -right-3 w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-zinc-600">
        {labels[index]}
      </div>

      {/* Ícone com gradiente */}
      <div className={`
        w-20 h-20 mx-auto rounded-2xl bg-linear-to-br ${ability.color}
        flex items-center justify-center text-4xl mb-4 shadow-lg
        ${isSelected ? 'scale-110' : ''}
        transition-transform duration-300
      `}>
        {ability.icon}
      </div>

      {/* Descrição */}
      <div className="text-center space-y-2">
        <p className="text-white font-bold text-lg">
          {ability.effect.type === 'buff' && `+${ability.effect.value} ${ability.effect.stat === 'attack' ? 'ATAQUE' : 'DEFESA'}`}
          {ability.effect.type === 'debuff' && `-${ability.effect.value} ${ability.effect.stat === 'attack' ? 'ATAQUE' : 'DEFESA'} (RISCO)`}
          {ability.effect.type === 'reveal' && `REVELAR ${ability.effect.target === 'all' ? 'TUDO' : ability.effect.target.toUpperCase()}`}
          {ability.effect.type === 'neutral' && 'NEUTRO'}
        </p>
        
        <p className="text-zinc-400 text-sm">
          {ability.effect.type === 'buff' && 'Aumente seus atributos'}
          {ability.effect.type === 'debuff' && 'Redução, mas pode ser arriscado'}
          {ability.effect.type === 'reveal' && 'Descubra segredos do oponente'}
          {ability.effect.type === 'neutral' && 'Nenhum efeito especial'}
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
    </motion.button>
  )
}

