import { fetchApi } from './api'

import type {
  Pokemon,
  PokemonListItem,
  PokemonListResponse
} from './types'

const ENDPOINTS = {
  type: '/type',
  pokemon: '/pokemon',
  species: '/pokemon-species'
} as const

export const pokemonService = {
  // ----------------------------------------
  // BUSCAR POR ID OU NOME
  // ----------------------------------------
  async getByIdOrName(idOrName: string | number): Promise<Pokemon> {
    return fetchApi<Pokemon>(`${ENDPOINTS.pokemon}/${idOrName}`)
  },

  // ----------------------------------------
  // LISTAR POKÉMONS (paginado)
  // ----------------------------------------
  async getList(limit = 20, offset = 0): Promise<PokemonListResponse> {
    return fetchApi<PokemonListResponse>(
      `${ENDPOINTS.pokemon}?limit=${limit}&offset=${offset}`
    )
  },

  // ----------------------------------------
  // BUSCAR VÁRIOS DE UMA VEZ
  // ----------------------------------------
  async getMany(idsOrNames: (string | number)[]): Promise<Pokemon[]> {
    const promises = idsOrNames.map((id) => this.getByIdOrName(id))

    return Promise.all(promises)
  },

  // ----------------------------------------
  // BUSCAR PRIMEIRA GERAÇÃO (1-151)
  // ----------------------------------------
  async getFirstGeneration(): Promise<Pokemon[]> {
    const ids = Array.from({ length: 151 }, (_, i) => i + 1)
    
    return this.getMany(ids)
  },

  // ----------------------------------------
  // PESQUISAR POR NOME (filtro local)
  // ----------------------------------------
  async searchByName(query: string): Promise<PokemonListItem[]> {
    const all = await this.getList(10000, 0) // Busca todos
    const lowerQuery = query.toLowerCase()
    
    return all.results.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(lowerQuery)
    )
  },

  // ----------------------------------------
  // OBTER IMAGEM PADRÃO
  // ----------------------------------------
  getImageUrl(
    id: number,
    options: {
      shiny?: boolean
      official?: boolean
    } = {}
  ): string {
    const { shiny = false, official = true } = options

    if (official) {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork${shiny ? '/shiny' : ''}/${id}.png`
    }

    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon${shiny ? '/shiny' : ''}/${id}.png`
  }
}