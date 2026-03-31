'use client'

import { Star } from 'lucide-react'
import { useFavorites } from '@/hooks/pokemon/useFavorites'

interface FavoriteButtonProps {
  pokemonId: number
}

export function FavoriteButton({ pokemonId }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  
  const favorite = isFavorite(pokemonId)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    toggleFavorite(pokemonId)
  }

  return (
    <button 
      onClick={handleClick}
      className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
    >
      <Star
        className={`w-5 h-5 transition-colors ${
          favorite
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-white hover:text-yellow-400'
        }`}
      />
    </button>
  )
}