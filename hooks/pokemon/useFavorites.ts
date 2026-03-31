/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const FAVORITES_KEY = 'pokemon-favorites'

export function useFavorites() {
  const favoritesRef = useRef<number[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([])

  useEffect(() => {
    favoritesRef.current = favorites
  }, [favorites])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY)

      if (stored) {
        const parsed = JSON.parse(stored)

        setFavorites(parsed)

        favoritesRef.current = parsed
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

  const toggleFavorite = useCallback((
    pokemonId: number, onToggle?: (_isNowFavorite: boolean) => void) => {
    const current = favoritesRef.current
    const isAlreadyFavorite = current.includes(pokemonId)

    console.log(isAlreadyFavorite)

    console.log(pokemonId)
    
    let newFavorites: number[]

    if (isAlreadyFavorite) {
      newFavorites = current.filter((id) => id !== pokemonId)
    } else {
      newFavorites = [...current, pokemonId]
    }

    console.log(newFavorites)
    
    favoritesRef.current = newFavorites
    setFavorites(newFavorites)
    
    // Chama callback com novo estado
    onToggle?.(!isAlreadyFavorite)
  }, [])

  const isFavorite = useCallback((pokemonId: number) => {
    return favoritesRef.current.includes(pokemonId)
  }, [])

  const removeFavorite = useCallback((pokemonId: number) => {
    const current = favoritesRef.current

    const newFavorites = current.filter((id) => id !== pokemonId)

    favoritesRef.current = newFavorites

    setFavorites(newFavorites)
  }, [])

  const addFavorite = useCallback((pokemonId: number) => {
    const current = favoritesRef.current

    if (current.includes(pokemonId)) return

    const newFavorites = [...current, pokemonId]

    favoritesRef.current = newFavorites

    setFavorites(newFavorites)
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