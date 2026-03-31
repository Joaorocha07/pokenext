'use client'
import { useEffect, useState } from 'react'

import { Pokemon } from '@/services/pokeapi/types'

import { useFavorites } from '@/hooks/pokemon/useFavorites'

import { pokemonService } from '@/services/pokeapi/pokemonService'

import { PokemonCard } from '@/app/pokemon/components/PokemonCard'

import { LoadingSpinner } from '@/app/pokemon/components/LoadingSpinner'

export function FavoritesGrid() {
  const { favorites, isLoaded } = useFavorites()
  const [pokemons, setPokemons] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFavorites() {
      if (!isLoaded) return

      if (favorites.length === 0) {
        setPokemons([])
        setLoading(false)
        
        return
      }

      setLoading(true)
      try {
        const promises = favorites.map((
            id) => pokemonService.getByIdOrName(String(id)
        ))
        const results = await Promise.all(promises)

        setPokemons(results)
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error)
      } finally {
        setLoading(false)
      }
    }

    loadFavorites()
  }, [favorites, isLoaded])

  const handleRemove = () => {
    setPokemons((prev) => [...prev])
  }

  if (!isLoaded || loading) {
    return <LoadingSpinner />
  }

  if (pokemons.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {pokemons.map((pokemon) => (
        <PokemonCard
          key={pokemon.id}
          pokemon={pokemon}
          showRemoveButton
          onRemove={handleRemove}
        />
      ))}
    </div>
  )
}