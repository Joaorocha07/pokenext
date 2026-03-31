import Image from 'next/image'

import Gif from '@/assets/pikachu.gif'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  progress?: number
}

export function LoadingSpinner({ text, progress }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Image
        src={Gif}
        alt="Carregando..."
        width={500}
        height={500}
        className="object-contain"
        priority
        unoptimized
      />

      {text && (
        <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400 text-center whitespace-nowrap animate-pulse">
          {text}
        </p>
      )}

      {progress !== undefined && (
        <div className="w-72 h-4 bg-zinc-200 dark:bg-zinc-700 rounded-full mt-6 overflow-hidden shadow-inner">
          <div 
            className="h-full bg-linear-to-r from-yellow-400 to-yellow-500 transition-all duration-300 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/30 animate-pulse" />
          </div>
        </div>
      )}

      {progress !== undefined && (
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 font-mono">
          {Math.round(progress)}%
        </p>
      )}
    </div>
  )
}