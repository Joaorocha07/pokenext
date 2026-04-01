'use client'

import { motion } from 'framer-motion'

interface RoundIndicatorProps {
  current: number
  total: number
}

export function RoundIndicator({ current, total }: RoundIndicatorProps) {
  return (
    <div className="flex justify-center gap-4 mb-12">
      {Array.from({ length: total }).map((_, index) => (
        <motion.div
          key={index}
          className="relative"
          initial={false}
          animate={{
            scale: index === current ? 1.1 : 1,
          }}
        >
          <div
            className={`
              w-16 h-2 rounded-full transition-all duration-500
              ${index < current 
                ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50' 
                : index === current 
                  ? 'bg-yellow-400 shadow-lg shadow-yellow-400/50'
                  : 'bg-zinc-700'
              }
            `}
          />
          
          {index === current && (
            <motion.div
              layoutId="activeRound"
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-yellow-400 text-xs font-bold whitespace-nowrap"
            >
              Round {index + 1}
            </motion.div>
          )}
          
          {index < current && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-emerald-500"
            >
              ✓
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  )
}