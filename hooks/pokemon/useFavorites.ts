'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Pokemon } from '@/services/pokeapi/types'

const STORAGE_KEY = 'pokenext-favorites'

export function useFavorites() {
  const [favorites, setFavorites] = useState<Pokemon[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)

      if (stored) {
        setFavorites(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error)
    }
    setIsLoaded(true)
  }, [])

  // Salvar no localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
      } catch (error) {
        console.error('Erro ao salvar favoritos:', error)
      }
    }
  }, [favorites, isLoaded])

  const addFavorite = useCallback((pokemon: Pokemon) => {
    setFavorites((prev) => {
      if (prev.some((p) => p.id === pokemon.id)) return prev
      
return [...prev, pokemon]
    })
  }, [])

  const removeFavorite = useCallback((pokemonId: number) => {
    setFavorites((prev) => prev.filter((p) => p.id !== pokemonId))
  }, [])

  const isFavorite = useCallback((pokemonId: number) => {
    return favorites.some((p) => p.id === pokemonId)
  }, [favorites])

  const toggleFavorite = useCallback((pokemon: Pokemon) => {
    if (isFavorite(pokemon.id)) {
      removeFavorite(pokemon.id)
      
return false
    } else {
      addFavorite(pokemon)
      
return true
    }
  }, [isFavorite, addFavorite, removeFavorite])

  const searchFavorites = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase()
    
return favorites.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.types.some((t) => t.type.name.toLowerCase().includes(lowerQuery))
    )
  }, [favorites])

  return {
    favorites,
    isLoaded,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    searchFavorites,
    count: favorites.length,
  }
}