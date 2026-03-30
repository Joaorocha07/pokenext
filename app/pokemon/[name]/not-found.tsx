import Link from 'next/link'
import { SearchX } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <SearchX className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-4xl font-bold text-zinc-800 dark:text-white mb-4">
          Pokémon não encontrado
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">
          O Pokémon que você procura não existe ou foi digitado incorretamente.
        </p>
        <Link
          href="/pokemon"
          className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-full transition-colors"
        >
          Voltar para lista
        </Link>
      </div>
    </div>
  )
}