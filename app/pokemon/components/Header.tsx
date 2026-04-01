/* eslint-disable react-hooks/set-state-in-effect */

'use client'
import { FormEvent, useEffect, useRef, useState } from 'react'

import { usePathname } from 'next/navigation'

import { BookOpen, Heart, Menu, Search, Swords, X } from 'lucide-react'

import type { PokemonSlim } from '@/services/pokeapi/types'

import { pokemonTeste } from '@/services/pokeapi/pokemonTeste'

import Link from 'next/link'

import Image from 'next/image'

import LogoPokemon from '@/assets/logo-pokemon.png'

interface HeaderProps {
  isLoading?: boolean
  onSearch?: (_query: string) => void
  showSearch?: boolean
  currentRound?: number
  totalRounds?: number
}

export function Header({ 
  onSearch, isLoading = false, showSearch = true, currentRound, totalRounds }: 
HeaderProps) {
  const pathname = usePathname()

  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<PokemonSlim[]>([])
  const [allPokemons, setAllPokemons] = useState<PokemonSlim[]>([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Só carrega sugestões se a busca estiver habilitada
  useEffect(() => {
    if (!showSearch) return
    
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
  }, [showSearch])

  useEffect(() => {
    if (!showSearch || query.trim().length < 1) {
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
  }, [query, allPokemons, showSearch])

  useEffect(() => {
    if (!showSearch) return
    
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
  }, [showSearch])

  // Fecha menu mobile ao mudar de rota
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (query.trim() && onSearch) {
      onSearch(query.trim().toLowerCase())
      setShowSuggestions(false)
    }
  }

  function handleSuggestionClick(pokemonName: string) {
    setQuery(pokemonName)
    if (onSearch) {
      onSearch(pokemonName)
    }
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
  const isBattlePage = pathname === '/combate'
  const isTutorialPage = pathname === '/tutorial'
  const isHomePage = pathname === '/pokemon'

  const showRoundIndicator = currentRound !== 
    undefined && totalRounds !== undefined && isBattlePage

  // Configuração dos links do submenu
  const navLinks = [
    {
      href: '/pokemon',
      label: 'Todos Pokémon',
      icon: 'bg-green-400',
      activeColor: 'text-yellow-500',
      isActive: isHomePage
    },
    {
      href: '/favoritos',
      label: 'Meus Favoritos',
      icon: 'bg-red-400',
      activeColor: 'text-yellow-500',
      isActive: isFavoritesPage
    },
    {
      href: '/combate',
      label: 'Arena de Batalhas',
      icon: isBattlePage ? 'bg-red-500 animate-pulse' : 'bg-orange-400',
      activeColor: 'text-red-500',
      isActive: isBattlePage,
      hasIcon: Swords
    },
    {
      href: '/tutorial',
      label: 'Tutorial',
      icon: 'bg-blue-400',
      activeColor: 'text-blue-500',
      isActive: isTutorialPage,
      hasIcon: BookOpen
    }
  ]

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-zinc-200 dark:bg-zinc-950/80 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">
          {/* Logo */}
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
            <div className="relative w-28 sm:w-36 h-10 sm:h-12">
              <Image
                src={LogoPokemon}
                alt="PokéNext"
                fill
                className="object-contain group-hover:scale-105 transition-transform"
                priority
              />
            </div>
          </Link>

          {/* INDICADOR DE ROUND (quando em batalha) */}
          {showRoundIndicator && (
            <div className="hidden md:flex flex-1 justify-center">
              <div className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                <Swords className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Round <span className="text-yellow-500 font-bold">{currentRound}</span> / {totalRounds}
                </span>
              </div>
            </div>
          )}

          {showSearch && !showRoundIndicator && (
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
                    className="w-full pl-10 pr-10 py-2 rounded-full border border-zinc-300 bg-white/50 focus:bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all dark:bg-zinc-900/50 dark:border-zinc-700 dark:text-white dark:focus:bg-zinc-900 text-sm sm:text-base"
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
                    <ul className="py-2 max-h-64 overflow-y-auto">
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
                          
                          <div className="flex-1 min-w-0">
                            <p className="font-medium capitalize text-zinc-800 dark:text-white truncate">
                              {pokemon.name}
                            </p>
                            <p className="text-xs text-zinc-500">
                              #{String(pokemon.id).padStart(3, '0')}
                            </p>
                          </div>

                          <div className="flex gap-1 shrink-0">
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
          )}

          {/* Espaço flexível quando não há busca nem rounds */}
          {(!showSearch && !showRoundIndicator) && <div className="hidden md:flex flex-1" />}

          {/* Botão Favoritos - Desktop */}
          <nav className="hidden md:flex items-center gap-1 shrink-0">
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
              <span className="hidden lg:inline">Favoritos</span>
            </Link>
          </nav>

          {/* Botão Menu Mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* SUBMENU / BREADCRUMB - DESKTOP */}
      <div className="hidden md:block border-t border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center h-12 gap-1 overflow-x-auto scrollbar-hide">
            {navLinks.map((link, index) => (
              <div key={link.href} className="flex items-center shrink-0">
                <Link
                  href={link.href}
                  onClick={(e) => {
                    if (pathname === link.href && link.href === '/pokemon') {
                      e.preventDefault()
                      window.location.reload()
                    }
                  }}
                  className={`
                    flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap
                    ${link.isActive 
                      ? `${link.activeColor} bg-zinc-100 dark:bg-zinc-800` 
                      : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800'
                    }
                  `}
                >
                  <span className={`w-2 h-2 rounded-full ${link.icon}`} />
                  {link.hasIcon && <link.hasIcon className="w-3 h-3" />}
                  <span>{link.label}</span>
                  {link.isActive && (
                    <span className="ml-1 w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  )}
                </Link>
                {index < navLinks.length - 1 && (
                  <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700 mx-1" />
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* MENU MOBILE */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg">
          {/* Indicador de Round Mobile */}
          {showRoundIndicator && (
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-linear-to-r from-red-500/5 to-orange-500/5 dark:from-red-900/10 dark:to-orange-900/10">
              <div className="flex items-center justify-center gap-3">
                <Swords className="w-5 h-5 text-red-500 animate-pulse" />
                <span className="text-base font-medium text-zinc-700 dark:text-zinc-300">
                  Round <span className="text-red-500 font-bold text-xl">{currentRound}</span> 
                  <span className="text-zinc-400 mx-1">/</span> 
                  <span className="text-zinc-500">{totalRounds}</span>
                </span>
                <div className="flex gap-1">
                  {Array.from({ length: totalRounds }).map((_, idx) => (
                    <div 
                      key={idx}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        idx < currentRound ? 'bg-red-500' : 'bg-zinc-300 dark:bg-zinc-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Barra de pesquisa mobile */}
          {showSearch && !showRoundIndicator && (
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
              <form onSubmit={handleSubmit} className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar Pokémon..."
                  autoComplete="off"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-zinc-300 bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                
                {query && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                    <X className="w-5 h-5 text-zinc-400" />
                  </button>
                )}
              </form>

              {/* Sugestões mobile */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="mt-2 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden max-h-48 overflow-y-auto">
                  {suggestions.map((pokemon) => (
                    <button
                      key={pokemon.id}
                      onClick={() => handleSuggestionClick(pokemon.name)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors text-left"
                    >
                      <Image
                        src={pokemonTeste.getImageUrl(pokemon.id)}
                        alt={pokemon.name}
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                      <span className="font-medium capitalize text-zinc-800 dark:text-white">
                        {pokemon.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Links de navegação mobile */}
          <nav className="p-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  if (pathname === link.href && link.href === '/pokemon') {
                    e.preventDefault()
                    window.location.reload()
                  }
                  setMobileMenuOpen(false)
                }}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 mb-1
                  ${link.isActive 
                    ? `${link.activeColor} bg-zinc-100 dark:bg-zinc-800` 
                    : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                  }
                `}
              >
                <span className={`w-3 h-3 rounded-full ${link.icon}`} />
                {link.hasIcon && <link.hasIcon className="w-5 h-5" />}
                <span>{link.label}</span>
                {link.isActive && (
                  <span className="ml-auto text-xs bg-current text-white px-2 py-0.5 rounded-full">
                    Atual
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Botão favoritos mobile */}
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
            <Link
              href="/favoritos"
              onClick={() => setMobileMenuOpen(false)}
              className={`
                flex items-center justify-center gap-2 w-full py-3 rounded-xl text-base font-medium transition-all duration-200
                ${isFavoritesPage 
                  ? 'bg-yellow-400 text-black' 
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
                }
              `}
            >
              <Heart className={`w-5 h-5 ${isFavoritesPage ? 'fill-current' : ''}`} />
              <span>Meus Favoritos</span>
            </Link>
          </div>
        </div>
      )}
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
