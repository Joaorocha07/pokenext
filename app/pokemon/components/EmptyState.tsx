import { Frown, HeartCrack, SearchX, Star } from 'lucide-react'

interface EmptyStateProps {
  type: 'not-found' | 'no-results' | 'error' | 'no-favorites' | 'not-favorite'
  message?: string
}

export function EmptyState({ type, message }: EmptyStateProps) {
  const configs = {
    'not-found': {
      icon: SearchX,
      title: 'Pokémon não encontrado',
      description: message || 'Não conseguimos encontrar esse Pokémon. Verifique o nome e tente novamente.',
      color: 'text-red-500',
    },
    'no-results': {
      icon: Frown,
      title: 'Nenhum Pokémon disponível',
      description: message || 'Parece que não há Pokémon para exibir no momento.',
      color: 'text-zinc-400',
    },
    'error': {
      icon: SearchX,
      title: 'Ops! Algo deu errado',
      description: message || 'Não foi possível carregar os Pokémon. Tente novamente mais tarde.',
      color: 'text-red-500',
    },
    'no-favorites': {
      icon: Star,
      title: 'Nenhum favorito ainda',
      description: message || 'Clique na estrela nos cards para adicionar Pokémon aos seus favoritos.',
      color: 'text-yellow-400',
    },
    'not-favorite': {
      icon: HeartCrack,
      title: 'Não é um favorito',
      description: message || 'Este Pokémon não está na sua lista de favoritos.',
      color: 'text-rose-400',
    },
  }

  const config = configs[type]
  const Icon = config.icon

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className={`p-6 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4 ${config.color}`}>
        <Icon className="w-12 h-12" />
      </div>
      <h3 className="text-xl font-bold text-zinc-800 dark:text-white mb-2">
        {config.title}
      </h3>
      <p className="text-zinc-500 dark:text-zinc-400 max-w-md">
        {config.description}
      </p>
    </div>
  )
}