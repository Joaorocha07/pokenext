'use client'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { Header } from './components/Header'

import { Pagination } from './components/Pagination'

import { EmptyState } from './components/EmptyState'

import { PokemonGrid } from './components/PokemonGrid'

import { PokemonSlim } from '@/services/pokeapi/types'

import { LoadingSpinner } from './components/LoadingSpinner'

import { pokemonTeste } from '@/services/pokeapi/pokemonTeste'

const ITEMS_PER_PAGE = 20

export default function PokemonPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [loadProgress, setLoadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isLoadingAll, setIsLoadingAll] = useState(false)
  const [isLoadingPage, setIsLoadingPage] = useState(false)
  const [allPokemons, setAllPokemons] = useState<PokemonSlim[]>([])

  useEffect(() => {
    async function loadAllPokemons() {
      if (pokemonTeste.hasValidCache()) {
        const cached = pokemonTeste.getFromCache()

        if (cached) {
          setAllPokemons(cached)

          return
        }
      }

      setIsLoadingAll(true)
      setLoadProgress(0)
      setError(null)

      try {
        const all = await pokemonTeste.getAll((progress) => {
          setLoadProgress(progress)
        })

        setAllPokemons(all)
      } catch (err) {
        setError('Não foi possível carregar os Pokémon')
        console.error(err)
      } finally {
        setIsLoadingAll(false)
      }
    }

    loadAllPokemons()
  }, [])

  const filteredPokemons = useMemo(() => {
    if (!searchQuery) return allPokemons
    const query = searchQuery.toLowerCase()

    return allPokemons.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.id.toString() === query
    )
  }, [allPokemons, searchQuery])

  const currentPokemons = useMemo(() => {
    return pokemonTeste.paginate(filteredPokemons, currentPage, ITEMS_PER_PAGE)
  }, [filteredPokemons, currentPage])

  const totalPages = useMemo(() => {
    return pokemonTeste.getTotalPages(filteredPokemons.length, ITEMS_PER_PAGE)
  }, [filteredPokemons])

  const handlePageChange = useCallback((page: number) => {
    setIsLoadingPage(true)
    setCurrentPage(page)
    setTimeout(() => {
      setIsLoadingPage(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 150)
  }, [])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }, [])

  function renderContent() {
    if (isLoadingAll) {
      return (
        <LoadingSpinner 
          text="Carregando Pokémon... Isso pode levar alguns segundos na primeira vez! ⚡"
          progress={loadProgress}
        />
      )
    }

    if (error) {
      return <EmptyState type="error" message={error} />
    }

    if (filteredPokemons.length === 0) {
      return <EmptyState type={searchQuery ? 'not-found' : 'no-results'} />
    }

    return (
      <>
        {isLoadingPage && (
          <div className="flex justify-center py-4">
            <LoadingSpinner size="sm" />
          </div>
        )}
        
        <PokemonGrid pokemons={currentPokemons} />
        
        {!searchQuery && totalPages > 1 && (
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Header onSearch={handleSearch} isLoading={isLoadingAll} />
      
      <main className="pt-4">
        {!isLoadingAll && filteredPokemons.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 flex justify-between items-center">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {searchQuery ? (
                `${filteredPokemons.length} resultado${filteredPokemons.length !== 1 ? 's' : ''} para "${searchQuery}"`
              ) : (
                `Página ${currentPage} de ${totalPages} • Mostrando ${currentPokemons.length} de ${filteredPokemons.length} Pokémon`
              )}
            </p>
            
            {pokemonTeste.hasValidCache() && !searchQuery && (
              <span className="text-xs text-green-500 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                Cache ativo
              </span>
            )}
          </div>
        )}
        
        {renderContent()}
      </main>
    </div>
  )
}