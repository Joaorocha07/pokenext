import { fetchApi } from "./api"

import { Pokemon, PokemonListResponse,  PokemonSlim } from "./types"

const ENDPOINTS = {
  pokemon: '/pokemon',
} as const

const CACHE_KEY = 'pokemon-cache-slim'
const CACHE_TIMESTAMP_KEY = 'pokemon-cache-timestamp'
const CACHE_DURATION = 24 * 60 * 60 * 1000

function extractIdFromUrl(url: string): number {
  const matches = url.match(/\/(\d+)\/?$/)

  return matches ? parseInt(matches[1], 10) : 0
}

function toSlim(pokemon: Pokemon): PokemonSlim {
  return {
    id: pokemon.id,
    name: pokemon.name,
    types: pokemon.types,
    stats: pokemon.stats,
    sprites: {
      other: {
        'official-artwork': {
          front_default: pokemon.sprites.other?.['official-artwork']?.front_default
        }
      }
    }
  }
}

export const pokemonTeste = {
  hasValidCache(): boolean {
    try {
      const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY)
      const data = localStorage.getItem(CACHE_KEY)
      
      if (!timestamp || !data) return false
      
      const age = Date.now() - parseInt(timestamp)

      return age < CACHE_DURATION
    } catch {
      return false
    }
  },

  getFromCache(): PokemonSlim[] | null {
    try {
      const data = localStorage.getItem(CACHE_KEY)

      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  },

  saveToCache(pokemons: PokemonSlim[]) {
    try {
      const slimData = JSON.stringify(pokemons)
      
      // ✅ Verifica tamanho antes de salvar (limite ~5MB)
      const sizeInMB = new Blob([slimData]).size / 1024 / 1024

      console.log(`Tamanho do cache: ${sizeInMB.toFixed(2)} MB`)
      
      if (sizeInMB > 4) {
        console.warn('Cache muito grande, não será salvo')

        return
      }
      
      localStorage.setItem(CACHE_KEY, slimData)
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString())
    } catch (error) {
      console.error('Erro ao salvar cache:', error)
    }
  },

  async getAll(onProgress?: 
    (_progress: number) => void): Promise<PokemonSlim[]> {
    if (this.hasValidCache()) {
      const cached = this.getFromCache()

      if (cached) return cached
    }

    const list = await fetchApi<PokemonListResponse>(
      `${ENDPOINTS.pokemon}?limit=1000&offset=0`
    )
    
    const batchSize = 50
    const allPokemons: PokemonSlim[] = []
    
    for (let i = 0; i < list.results.length; i += batchSize) {
      const batch = list.results.slice(i, i + batchSize)
      const promises = batch.map(p => {
        const id = extractIdFromUrl(p.url)

        return fetchApi<Pokemon>(`${ENDPOINTS.pokemon}/${id}`)
      })
      
      const results = await Promise.all(promises)

      allPokemons.push(...results.map(toSlim))
      
      const progress = Math.min(
        Math.round(((i + batchSize) / list.results.length) * 100),
        100
      )

      onProgress?.(progress)
    }

    this.saveToCache(allPokemons)
    
    return allPokemons
  },

  paginate(
    pokemons: PokemonSlim[], page: number, limit: number
  ): PokemonSlim[] {
    const start = (page - 1) * limit

    return pokemons.slice(start, start + limit)
  },

  getTotalPages(total: number, limit: number): number {
    return Math.ceil(total / limit)
  },

  getImageUrl(id: number, options?: { shiny?: boolean }): string {
    const { shiny = false } = options || {}
    
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork${shiny ? '/shiny' : ''}/${id}.png`
  }
}