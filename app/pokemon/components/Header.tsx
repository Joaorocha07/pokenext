'use client'

import { FormEvent, useState } from 'react'

import { Search, Sparkles } from 'lucide-react'

interface HeaderProps {
  isLoading: boolean
  favoritesCount: number
  onSearch: (_query: string) => void
}

export function Header({ onSearch, isLoading}: HeaderProps) {
  const [query, setQuery] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim().toLowerCase())
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-zinc-200 dark:bg-zinc-950/80 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">
          {/* Logo - posicionado à esquerda */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400 rounded-full blur-sm animate-pulse" />
              <Sparkles className="relative w-8 h-8 text-yellow-500" />
            </div>
            <h1 className="text-xl font-bold bg-linear-to-r from-yellow-500 to-red-500 bg-clip-text text-transparent hidden sm:block">
              PokéNext
            </h1>
          </div>

          {/* Search Bar - centralizado com flex-1 e justify-center */}
          <div className="flex-1 flex justify-center">
            <form onSubmit={handleSubmit} className="w-full max-w-md">
              <div className="relative group">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar Pokémon..."
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-zinc-300 bg-white/50 focus:bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all dark:bg-zinc-900/50 dark:border-zinc-700 dark:text-white dark:focus:bg-zinc-900"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-yellow-500 transition-colors" />
                
                <button
                  type="submit"
                  disabled={isLoading || !query.trim()}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 text-sm font-medium bg-yellow-400 hover:bg-yellow-500 disabled:bg-zinc-300 disabled:cursor-not-allowed rounded-full transition-colors text-black"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin text-black" />
                    </span>
                  ) : (
                    'Buscar'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </header>
  )
}