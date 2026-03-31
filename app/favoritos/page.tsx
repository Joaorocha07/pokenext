/* eslint-disable react-hooks/set-state-in-effect */
'use client'
import { useCallback, useEffect, useState } from 'react'

import { Pokemon } from '@/services/pokeapi/types'

import { Header } from '../pokemon/components/Header'

import { useFavorites } from '@/hooks/pokemon/useFavorites'

import { EmptyState } from '../pokemon/components/EmptyState'

import { PokemonCard } from '../pokemon/components/PokemonCard'

import { pokemonService } from '@/services/pokeapi/pokemonService'

import { LoadingSpinner } from '../pokemon/components/LoadingSpinner'

export default function FavoritosPage() {
  const { favorites, isLoaded } = useFavorites()

  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pokemons, setPokemons] = useState<Pokemon[]>([])

  useEffect(() => {
    if (!isLoaded) return

    if (favorites.length === 0) {
      setPokemons([])
      
      return
    }

    setIsSearching(true)

    const promises = favorites.map((id) =>
      pokemonService.getByIdOrName(String(id))
    )

    Promise.all(promises)
      .then((results) => {
        setPokemons(results)
      })
      .catch(() => {
        setError('Erro ao carregar favoritos')
      })
      .finally(() => {
        setIsSearching(false)
      })
  }, [favorites, isLoaded])

  const handleSearch = useCallback((query: string) => {
    if (!query.trim()) {
      setError(null)
      setIsSearching(true)
      
      Promise.all(favorites.map((
        id) => pokemonService.getByIdOrName(String(id)))
      )
        .then((results) => {
          setPokemons(results)
        })
        .catch(() => {
          setError('Erro ao carregar favoritos')
        })
        .finally(() => {
          setIsSearching(false)
        })
      
      return
    }

    setError(null)
    setIsSearching(true)
    setSearchQuery(query)

    pokemonService
      .getByIdOrName(query)
      .then((pokemon) => {
        if (favorites.includes(pokemon.id)) {
          setPokemons([pokemon])
        } else {
          setPokemons([])
          setError('not-favorite')
        }
      })
      .catch(() => {
        setPokemons([])
        setError('not-found')
      })
      .finally(() => {
        setIsSearching(false)
      })
  }, [favorites])

  const handleRemoveFavorite = useCallback(() => {
    setPokemons((prev) => [...prev])
  }, [])

  function renderContent() {
    if (!isLoaded || isSearching) {
      return <LoadingSpinner />
    }

    if (error === 'not-found') {
      return <EmptyState type="not-found" />
    }

    if (error === 'not-favorite') {
      return <EmptyState type="not-favorite" message="Este Pokémon não está nos seus favoritos" />
    }

    if (error) {
      return <EmptyState type="error" message={error} />
    }

    if (pokemons.length === 0) {
      return <EmptyState type="no-favorites" />
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {pokemons.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            showRemoveButton
            onRemove={handleRemoveFavorite}
          />
        ))}
      </div>
    )
  }
    
  return (
    <div>
      <Header 
        onSearch={handleSearch} 
        isLoading={isSearching} 
      />

      <main className="pt-4 pb-12">
        {!isSearching && pokemons.length > 0 && !error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {searchQuery
                ? `Resultado para "${searchQuery}"`
                : `${pokemons.length} Pokémon favorito${pokemons.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        )}
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}