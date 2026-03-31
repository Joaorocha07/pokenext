'use client'

import { usePathname } from 'next/navigation'

import { Frown, HeartCrack, SearchX, Star } from 'lucide-react'

import Link from 'next/link'

interface EmptyStateProps {
  type: 'not-found' | 'no-results' | 'error' | 'no-favorites' | 'not-favorite'
  message?: string
}

export function EmptyState({ type, message }: EmptyStateProps) {
  const pathname = usePathname()
  
  const isOnPokemonPage = pathname === '/pokemon'

  const configs = {
    'not-found': {
      icon: SearchX,
      title: 'Pokémon não encontrado',
      description: message || 'Não conseguimos encontrar esse Pokémon. Verifique o nome e tente novamente.',
      gradient: 'from-red-400 to-orange-500',
      bgGlow: 'bg-red-400/20',
      emoji: '🔍',
    },
    'no-results': {
      icon: Frown,
      title: 'Nenhum Pokémon disponível',
      description: message || 'Parece que não há Pokémon para exibir no momento.',
      gradient: 'from-zinc-400 to-zinc-600',
      bgGlow: 'bg-zinc-400/20',
      emoji: '😕',
    },
    'error': {
      icon: SearchX,
      title: 'Ops! Algo deu errado',
      description: message || 'Não foi possível carregar os Pokémon. Tente novamente mais tarde.',
      gradient: 'from-red-500 to-rose-600',
      bgGlow: 'bg-red-500/20',
      emoji: '💥',
    },
    'no-favorites': {
      icon: Star,
      title: 'Nenhum favorito ainda',
      description: message || 'Clique na estrela nos cards para adicionar Pokémon aos seus favoritos.',
      gradient: 'from-yellow-400 to-amber-500',
      bgGlow: 'bg-yellow-400/20',
      emoji: '⭐',
    },
    'not-favorite': {
      icon: HeartCrack,
      title: 'Não é um favorito',
      description: message || 'Este Pokémon não está na sua lista de favoritos.',
      gradient: 'from-rose-400 to-pink-500',
      bgGlow: 'bg-rose-400/20',
      emoji: '💔',
    },
  }

  const config = configs[type]
  const Icon = config.icon

  const handleClick = (e: React.MouseEvent) => {
    if (isOnPokemonPage) {
      e.preventDefault()
      window.location.reload()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center min-h-[50vh]">
      
      <div className="relative group">
        <div className={`absolute inset-0 blur-3xl opacity-50 animate-pulse ${config.bgGlow} rounded-full scale-150`} />
        <div className={`relative p-8 rounded-full bg-linear-to-br ${config.gradient} shadow-2xl transform transition-transform duration-500 group-hover:scale-110`}>
          <Icon className="w-16 h-16 text-white drop-shadow-lg" />
          <span className="absolute -top-2 -right-2 text-3xl animate-bounce">
            {config.emoji}
          </span>
        </div>
      </div>

      <h2 className={`mt-8 text-3xl font-bold bg-linear-to-r ${config.gradient} bg-clip-text text-transparent`}>
        {config.title}
      </h2>

      <p className="mt-4 text-zinc-500 dark:text-zinc-400 max-w-md text-lg leading-relaxed">
        {config.description}
      </p>

      <Link
        href="/pokemon"
        onClick={handleClick}
        className="group mt-8 inline-flex items-center gap-3 px-8 py-4 bg-[#FACC15] hover:bg-[#EAB308] text-black font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-yellow-400/25"
      >
        <span>Voltar para lista</span>
      </Link>

      {type === 'no-favorites' && (
        <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl max-w-sm">
          <p className="text-sm text-yellow-700 dark:text-yellow-300 flex items-center gap-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            Dica: Você pode favoritar até 100 Pokémon!
          </p>
        </div>
      )}
    </div>
  )
}