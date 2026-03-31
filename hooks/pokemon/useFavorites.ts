/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { useCallback, useEffect, useState } from 'react'

const FAVORITES_KEY = 'pokemon-favorites'

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY)

      if (stored) {
        setFavorites(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error)
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
      } catch (error) {
        console.error('Erro ao salvar favoritos:', error)
      }
    }
  }, [favorites, isLoaded])

  const toggleFavorite = useCallback((pokemonId: number) => {
    setFavorites((prev) => {
      if (prev.includes(pokemonId)) {
        return prev.filter((id) => id !== pokemonId)
      }
      
      return [...prev, pokemonId]}
    )
  }, [])

  const isFavorite = useCallback((pokemonId: number) => {
    return favorites.includes(pokemonId)
  }, [favorites])

  const removeFavorite = useCallback((pokemonId: number) => {
    setFavorites((prev) => prev.filter((id) => id !== pokemonId))
  }, [])

  return {
    isLoaded,
    favorites,
    favoritesCount: favorites.length,
    isFavorite,
    removeFavorite,
    toggleFavorite
  }
}