// ==========================================
// INTERFACES BASE
// ==========================================
export interface NamedAPIResource {
  name: string
  url: string
}

// ==========================================
// ABILITIES (HABILIDADES)
// ==========================================
export interface Ability {
  ability: NamedAPIResource
  is_hidden: boolean
  slot: number
}

// ==========================================
// STATS (STATUS)
// ==========================================
export interface Stat {
  base_stat: number
  effort: number
  stat: NamedAPIResource
}

// ==========================================
// TYPES (TIPOS)
// ==========================================
export interface PokemonType {
  slot: number
  type: NamedAPIResource
}

// ==========================================
// SPRITES (IMAGENS)
// ==========================================
export interface PokemonSprites {
  front_default: string | null
  front_shiny: string | null
  front_female: string | null
  front_shiny_female: string | null
  back_default: string | null
  back_shiny: string | null
  back_female: string | null
  back_shiny_female: string | null
  other?: {
    'official-artwork': {
      front_default: string | null
      front_shiny: string | null
    }
    home: {
      front_default: string | null
      front_shiny: string | null
    }
    dream_world: {
      front_default: string | null
    }
  }
}

// ==========================================
// MOVES (GOLPES)
// ==========================================
export interface MoveVersion {
  level_learned_at: number
  move_learn_method: NamedAPIResource
  version_group: NamedAPIResource
}

export interface PokemonMove {
  move: NamedAPIResource
  version_group_details: MoveVersion[]
}

// ==========================================
// POKEMON COMPLETO
// ==========================================
export interface Pokemon {
  id: number
  name: string
  base_experience: number
  height: number
  weight: number
  is_default: boolean
  order: number
  abilities: Ability[]
  stats: Stat[]
  types: PokemonType[]
  sprites: PokemonSprites
  moves: PokemonMove[]
  species: NamedAPIResource
  cries: {
    latest: string
    legacy: string
  }
  location_area_encounters: string
}

// ==========================================
// LISTA SIMPLIFICADA (para listagens)
// ==========================================
export interface PokemonListItem {
  name: string
  url: string
}

export interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: PokemonListItem[]
}

export interface PokemonSlim {
  id: number
  name: string
  types: { type: { name: string } }[]
  stats: { base_stat: number; stat: { name: string } }[]
  sprites: {
    other?: {
      'official-artwork'?: {
        front_default?: string | null
      }
    }
  }
}