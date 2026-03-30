import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-16 h-16 animate-spin text-yellow-500 mx-auto mb-4" />
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Carregando Pokémon...
        </p>
      </div>
    </div>
  )
}