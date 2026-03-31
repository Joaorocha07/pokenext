'use client'
import { FormEvent, useState } from 'react'

import { usePathname } from 'next/navigation'

import { Heart, Search, Sparkles } from 'lucide-react'

import Link from 'next/link'

interface HeaderProps {
  isLoading: boolean
  onSearch: (_query: string) => void
}

export function Header({ onSearch, isLoading }: HeaderProps) {
  const pathname = usePathname()
  const [query, setQuery] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim().toLowerCase())
    }
  }

  const isFavoritesPage = pathname === '/favoritos'

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-zinc-200 dark:bg-zinc-950/80 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">
          {/* Logo - posicionado à esquerda */}
          <Link href="/pokemon" className="flex items-center gap-2 shrink-0 group">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400 rounded-full blur-sm animate-pulse group-hover:animate-none transition-all" />
              <Sparkles className="relative w-8 h-8 text-yellow-500" />
            </div>
            <h1 className="text-xl font-bold bg-linear-to-r from-yellow-500 to-red-500 bg-clip-text text-transparent hidden sm:block">
              PokéNext
            </h1>
          </Link>

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

          {/* Navigation Menu - à direita */}
          <nav className="flex items-center gap-1 shrink-0">
            <Link
              href="/favoritos"
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${isFavoritesPage 
                  ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/25' 
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800'
                }
              `}
            >
              <Heart className={`w-4 h-4 ${isFavoritesPage ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">Favoritos</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Submenu/Breadcrumb opcional */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-10 gap-6 text-sm">
            <Link 
              href="/pokemon" 
              className={`flex items-center gap-2 transition-colors ${
                pathname === '/pokemon' 
                  ? 'text-yellow-500 font-medium' 
                  : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-green-400" />
              Todos Pokémon
            </Link>
            <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700" />
            <Link 
              href="/favoritos" 
              className={`flex items-center gap-2 transition-colors ${
                isFavoritesPage 
                  ? 'text-yellow-500 font-medium' 
                  : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-400" />
              Meus Favoritos
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}