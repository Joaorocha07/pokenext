'use client'
import { useCallback, useEffect, useState } from 'react'

import { Header } from './components/Header'

import { Pokemon } from '@/services/pokeapi/types'

import { EmptyState } from './components/EmptyState'

import { PokemonGrid } from './components/PokemonGrid'

import { LoadingSpinner } from './components/LoadingSpinner'

import { pokemonService } from '@/services/pokeapi/pokemonService'

export default function PokemonPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pokemons, setPokemons] = useState<Pokemon[]>([])

  useEffect(() => {
    async function loadInitialPokemons() {
      setIsLoading(true)
      setError(null)
      
      try {
        const list = await pokemonService.getList(20, 0)
        const details = await pokemonService.getMany(
          list.results.map((p) => p.name)
        )

        setPokemons(details)
      } catch (err) {
        setError('Não foi possível carregar os Pokémon')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialPokemons()
  }, [])

  // Buscar Pokémon específico
const handleSearch = useCallback((query: string) => {
  setIsSearching(true)
  setSearchQuery(query)
  setError(null)

  pokemonService
    .getByIdOrName(query)
    .then((pokemon) => {
      setPokemons([pokemon])
    })
    .catch(() => {
      setPokemons([])
      setError('not-found')
    })
    .finally(() => {
      setIsSearching(false)
    })
}, [])

  // Renderização condicional
  function renderContent() {
    if (isLoading || isSearching) {
      return <LoadingSpinner />
    }

    if (error === 'not-found') {
      return <EmptyState type="not-found" />
    }

    if (error) {
      return <EmptyState type="error" message={error} />
    }

    if (pokemons.length === 0) {
      return <EmptyState type="no-results" />
    }

    return <PokemonGrid pokemons={pokemons} />
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Header 
        favoritesCount={1}
        onSearch={handleSearch} 
        isLoading={isSearching} 
      />
      
      <main className="pt-4">
        {/* Results count */}
        {!isLoading && !isSearching && pokemons.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {searchQuery
                ? `Resultado para "${searchQuery}"`
                : `Mostrando ${pokemons.length} Pokémon`}
            </p>
          </div>
        )}
        
        {renderContent()}
      </main>
    </div>
  )
}