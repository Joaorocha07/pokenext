
import { PokemonCard } from './PokemonCard'

import type { PokemonSlim } from '@/services/pokeapi/types'

interface PokemonGridProps {
  pokemons: PokemonSlim[]
}

export function PokemonGrid({ pokemons }: PokemonGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {pokemons.map((pokemon) => (
        <PokemonCard key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  )
}