/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const FAVORITES_KEY = 'pokemon-favorites'

const readFavorites = (): number[] => {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY)

    if (stored) {
      const parsed = JSON.parse(stored)

      if (Array.isArray(parsed)) return parsed
    }
  } catch (error) {
    console.error('Erro ao ler favoritos:', error)
  }

  return []
}

const saveFavorites = (favs: number[]) => {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs))
  } catch (error) {
    console.error('Erro ao salvar favoritos:', error)
  }
}

export function useFavorites() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([])
  
  const isUpdating = useRef(false)

  useEffect(() => {
    const stored = readFavorites()

    setFavorites(stored)
    
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === FAVORITES_KEY) {
        const newValue = readFavorites()

        setFavorites(newValue)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    const interval = setInterval(() => {
      if (isUpdating.current) return
      
      const current = readFavorites()

      setFavorites(prev => {
        if (JSON.stringify(prev) !== JSON.stringify(current)) {
          return current
        }

        return prev
      })
    }, 100)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const toggleFavorite = useCallback(
    (pokemonId: number, onToggle?: (_isNowFavorite: boolean) => void) => {
      isUpdating.current = true
      
      const current = readFavorites()
      const exists = current.includes(pokemonId)
      const next = exists 
        ? current.filter(id => id !== pokemonId)
        : [...current, pokemonId]
      
      saveFavorites(next)
      
      setFavorites(next)
      
      onToggle?.(!exists)

      setTimeout(() => {
        isUpdating.current = false
      }, 150)
    },
    []
  )

  const isFavorite = useCallback(
    (pokemonId: number) => favorites.includes(pokemonId),
    [favorites]
  )

  const removeFavorite = useCallback((pokemonId: number) => {
    isUpdating.current = true
    
    const current = readFavorites()
    const next = current.filter((id) => id !== pokemonId)
    
    saveFavorites(next)
    setFavorites(next)
    
    setTimeout(() => {
      isUpdating.current = false
    }, 150)
  }, [])

  const addFavorite = useCallback((pokemonId: number) => {
    isUpdating.current = true
    
    const current = readFavorites()

    if (current.includes(pokemonId)) {
      isUpdating.current = false

      return
    }
    
    const next = [...current, pokemonId]
    
    saveFavorites(next)
    setFavorites(next)
    
    setTimeout(() => {
      isUpdating.current = false
    }, 150)
  }, [])

  return {
    isLoaded,
    favorites,
    favoritesCount: favorites.length,
    isFavorite,
    removeFavorite,
    addFavorite,
    toggleFavorite,
  }
}