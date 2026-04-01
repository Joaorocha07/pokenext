 
'use client'

import { usePathname } from 'next/navigation'

import { Heart, Swords } from 'lucide-react'

import Link from 'next/link'

import Image from 'next/image'

import LogoPokemon from '@/assets/logo-pokemon.png'

interface BattleHeaderProps {
  currentRound?: number
  totalRounds?: number
}

export function BattleHeader({ currentRound, totalRounds }: BattleHeaderProps) {
  const pathname = usePathname()
  
  const isBattlePage = pathname === '/combate'
  const isFavoritesPage = pathname === '/favoritos'

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-zinc-200 dark:bg-zinc-950/80 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link
            href="/pokemon"
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

          {/* Indicador de Round (opcional) */}
          {currentRound !== undefined && totalRounds !== undefined && (
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-full">
              <Swords className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Round <span className="text-yellow-500 font-bold">{currentRound}</span> / {totalRounds}
              </span>
            </div>
          )}

          {/* Navegação */}
          <nav className="flex items-center gap-2 shrink-0">
            {/* Favoritos */}
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

      {/* Breadcrumb / Sub-header */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-14 gap-6 text-sm">
            <Link
              href="/pokemon"
              className={`
                flex items-center gap-2 transition-colors
                ${pathname === '/pokemon' 
                  ? 'text-yellow-500 font-medium' 
                  : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
                }
              `}
            >
              <span className="w-2 h-2 rounded-full bg-green-400" />
              Todos Pokémon
            </Link>
            
            <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700" />
            
            <Link 
              href="/favoritos" 
              className={`
                flex items-center gap-2 transition-colors
                ${isFavoritesPage 
                  ? 'text-yellow-500 font-medium' 
                  : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
                }
              `}
            >
              <span className="w-2 h-2 rounded-full bg-red-400" />
              Meus Favoritos
            </Link>

            <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700" />

            {/* Indicador de Batalha no breadcrumb */}
            <span className={`
              flex items-center gap-2 transition-colors
              ${isBattlePage 
                ? 'text-red-500 font-medium' 
                : 'text-zinc-500 dark:text-zinc-400'
              }
            `}>
              <span className={`
                w-2 h-2 rounded-full
                ${isBattlePage ? 'bg-red-500 animate-pulse' : 'bg-zinc-400'}
              `} />
              Arena de Batalha
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}