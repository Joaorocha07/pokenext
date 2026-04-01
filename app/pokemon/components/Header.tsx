/* eslint-disable react-hooks/set-state-in-effect */
'use client'
import { FormEvent, useEffect, useRef, useState } from 'react'

import { usePathname } from 'next/navigation'

import { Heart, Search, Swords, X } from 'lucide-react' // Adicionei Swords

import type { PokemonSlim } from '@/services/pokeapi/types'

import { pokemonTeste } from '@/services/pokeapi/pokemonTeste'

import Link from 'next/link'

import Image from 'next/image'

import LogoPokemon from '@/assets/logo-pokemon.png'

interface HeaderProps {
  isLoading: boolean
  onSearch: (_query: string) => void
}

export function Header({ onSearch, isLoading }: HeaderProps) {
  const pathname = usePathname()

  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<PokemonSlim[]>([])
  const [allPokemons, setAllPokemons] = useState<PokemonSlim[]>([])

  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadCache = async () => {

      if (pokemonTeste.hasValidCache()) {
        const cached = pokemonTeste.getFromCache()

        if (cached) setAllPokemons(cached)
      } else {
        try {
          const all = await pokemonTeste.getAll()

          setAllPokemons(all)
        } catch (error) {
          console.error('Erro ao carregar para sugestões:', error)
        }
      }
    }

    loadCache()
  }, [])

  useEffect(() => {
    if (query.trim().length < 1) {
      setSuggestions([])
      setShowSuggestions(false)

      return
    }

    const lowerQuery = query.toLowerCase()
    const filtered = allPokemons
      .filter(p => p.name.toLowerCase().startsWith(lowerQuery))
      .slice(0, 8)

    setSuggestions(filtered)
    setShowSuggestions(filtered.length > 0)
  }, [query, allPokemons])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim().toLowerCase())
      setShowSuggestions(false)
    }
  }

  function handleSuggestionClick(pokemonName: string) {
    setQuery(pokemonName)
    onSearch(pokemonName)
    setShowSuggestions(false)
    inputRef.current?.blur()
  }

  function clearSearch() {
    setQuery('')
    setSuggestions([])
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  const isFavoritesPage = pathname === '/favoritos'
  const isBattlePage = pathname === '/combate' // NOVO

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-zinc-200 dark:bg-zinc-950/80 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">
          <Link
            href="/pokemon"
            onClick={(e) => {
              if (pathname === '/pokemon') {
                e.preventDefault()
                window.location.reload()
              }
            }}
            className="flex items-center gap-2 shrink-0 group"
          >
            <div className="relative w-36 h-12">
              <Image
                src={LogoPokemon}
                alt="PokéNext"
                fill
                className="object-contain group-hover:scale-105 transition-transform"
                priority
              />
            </div>
          </Link>

          <div className="hidden md:flex flex-1 justify-center relative">
            <form onSubmit={handleSubmit} className="w-full max-w-md relative">
              <div className="relative group">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => 
                    query.trim().length >= 1 && 
                    setShowSuggestions(suggestions.length > 0)
                  }
                  placeholder="Buscar Pokémon..."
                  autoComplete="off"
                  className="w-full pl-10 pr-10 py-2 rounded-full border border-zinc-300 bg-white/50 focus:bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all dark:bg-zinc-900/50 dark:border-zinc-700 dark:text-white dark:focus:bg-zinc-900"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-yellow-500 transition-colors" />
                
                {query && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-12 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                    <X className="w-4 h-4 text-zinc-400" />
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !query.trim()}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 text-sm font-medium bg-yellow-400 hover:bg-yellow-500 disabled:bg-zinc-300 disabled:cursor-not-allowed rounded-full transition-colors text-black"
                >
                  {isLoading ? (
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                  ) : (
                    'Buscar'
                  )}
                </button>
              </div>

              {showSuggestions && (
                <div 
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden z-50"
                >
                  <ul className="py-2">
                    {suggestions.map((pokemon, index) => (
                      <li 
                        key={pokemon.id}
                        onClick={() => 
                          handleSuggestionClick(pokemon.name)
                        }
                        className={`cursor-pointer flex items-center gap-3 px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${
                          index === 0 ? 'bg-zinc-50 dark:bg-zinc-800/50' : ''
                        }`}
                      >
                        <Image
                          src={pokemonTeste.getImageUrl(pokemon.id)}
                          alt={pokemon.name}
                          width={32}
                          height={32}
                          className="object-contain"
                          loading="lazy"
                        />
                        
                        <div className="flex-1">
                          <p className="font-medium capitalize text-zinc-800 dark:text-white">
                            {pokemon.name}
                          </p>
                          <p className="text-xs text-zinc-500">
                            #{String(pokemon.id).padStart(3, '0')}
                          </p>
                        </div>

                        <div className="flex gap-1">
                          {pokemon.types.slice(0, 2).map((type) => (
                            <span
                              key={type.type.name}
                              className={`px-2 py-0.5 text-xs rounded-full text-white ${getTypeColor(type.type.name)}`}
                            >
                              {type.type.name}
                            </span>
                          ))}
                        </div>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="px-4 py-2 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-700 text-xs text-zinc-500 text-center">
                    Pressione Enter para buscar ou ESC para fechar
                  </div>
                </div>
              )}
            </form>
          </div>

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

      {/* SUBMENU / BREADCRUMB - ATUALIZADO COM ARENA DE BATALHAS */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-14 gap-6 text-sm">
            <Link
              href="/pokemon"
              onClick={(e) => {
                if (pathname === '/pokemon') {
                  e.preventDefault()
                  window.location.reload()
                }
              }}
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

            {/* NOVO: Arena de Batalhas */}
            <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700" />
            
            <Link 
              href="/combate" 
              className={`flex items-center gap-2 transition-colors ${
                isBattlePage 
                  ? 'text-red-500 font-medium' 
                  : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              <span className={`
                w-2 h-2 rounded-full
                ${isBattlePage ? 'bg-red-500 animate-pulse' : 'bg-orange-400'}
              `} />
              <Swords className="w-3 h-3" />
              Arena de Batalhas
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    normal: 'bg-zinc-400',
    fire: 'bg-orange-500',
    water: 'bg-blue-500',
    electric: 'bg-yellow-400',
    grass: 'bg-green-500',
    ice: 'bg-cyan-300',
    fighting: 'bg-red-600',
    poison: 'bg-purple-500',
    ground: 'bg-amber-600',
    flying: 'bg-sky-400',
    psychic: 'bg-pink-500',
    bug: 'bg-lime-500',
    rock: 'bg-stone-500',
    ghost: 'bg-violet-600',
    dragon: 'bg-indigo-600',
    dark: 'bg-neutral-700',
    steel: 'bg-slate-400',
    fairy: 'bg-rose-300',
  }
  
  return colors[type] || 'bg-zinc-400'
}