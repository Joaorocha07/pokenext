'use client'

import { AnimatePresence, motion } from 'framer-motion'

interface BattleLogProps {
  logs: string[]
}

export function BattleLog({ logs }: BattleLogProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div className="bg-zinc-900/80 rounded-2xl border border-zinc-700 p-6 backdrop-blur-sm">
        <h3 className="text-zinc-400 text-sm font-bold mb-4 uppercase tracking-wider">
          📜 Log de Batalha
        </h3>
        
        <div className="space-y-3 min-h-30">
          <AnimatePresence mode="popLayout">
            {logs.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-zinc-600 text-center italic"
              >
                A batalha está começando...
              </motion.p>
            ) : (
              logs.map((log, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                    text-lg font-medium
                    ${log.includes('💥') ? 'text-yellow-400' : ''}
                    ${log.includes('🔥') ? 'text-orange-400' : ''}
                    ${log.includes('💧') ? 'text-blue-400' : ''}
                    ${log.includes('⚔️') ? 'text-red-400' : ''}
                    ${log.includes('🛡️') ? 'text-emerald-400' : ''}
                    ${log.includes('💨') ? 'text-zinc-300' : ''}
                  `}
                >
                  {log}
                </motion.p>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}