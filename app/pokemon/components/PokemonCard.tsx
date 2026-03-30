'use client'
import { useState } from 'react'

import { ArrowRight, Star } from 'lucide-react'
import type { Pokemon } from '@/services/pokeapi/types'
import { pokemonService } from '@/services/pokeapi/pokemonService'

import Link from 'next/link'

import Image from 'next/image'

interface PokemonCardProps {
  pokemon: Pokemon
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const mainType = pokemon.types[0]?.type.name || 'normal'
  
  // Cores por tipo
  const typeColors: Record<string, string> = {
    normal: 'bg-zinc-400',
    fire: 'bg-orange-500',
    water: 'bg-blue-500',
    electric: 'bg-yellow-400',
    grass: 'bg-green-500',
    ice: 'bg-cyan-300',
    fighting: 'bg-red-600',
    poison: 'bg-purple-500',
    ground: 'bg-amber-600',
    flying: 'bg-sky-400',
    psychic: 'bg-pink-500',
    bug: 'bg-lime-500',
    rock: 'bg-stone-500',
    ghost: 'bg-violet-600',
    dragon: 'bg-indigo-600',
    dark: 'bg-neutral-700',
    steel: 'bg-slate-400',
    fairy: 'bg-rose-300',
  }

  const bgColor = typeColors[mainType] || 'bg-zinc-400'

  return (
    <div className="group relative bg-white dark:bg-zinc-900 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-zinc-100 dark:border-zinc-800">
      {/* Favorite Button */}
      <button
        onClick={() => setIsFavorite(!isFavorite)}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 dark:bg-zinc-800/90 shadow-md hover:scale-110 transition-transform"
      >
        <Star
          className={`w-5 h-5 transition-colors ${
            isFavorite
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-zinc-400 hover:text-yellow-400'
          }`}
        />
      </button>

      {/* Image Container */}
      <div className={`relative h-48 ${bgColor} bg-opacity-20 dark:bg-opacity-10`}>
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-white/20 dark:to-black/20" />
        
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-zinc-200 border-t-yellow-400 rounded-full animate-spin" />
          </div>
        )}
        
        <Image
          src={pokemonService.getImageUrl(pokemon.id, { official: true })}
          alt={pokemon.name}
          width={300}
          height={300}
          onLoad={() => setImageLoaded(true)}
          className={`relative w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        
        {/* ID Badge */}
        <span className="absolute top-3 left-3 px-2 py-1 text-xs font-bold bg-black/10 dark:bg-white/10 rounded-full text-zinc-600 dark:text-zinc-300">
          #{String(pokemon.id).padStart(3, '0')}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold capitalize text-zinc-800 dark:text-white mb-2">
          {pokemon.name}
        </h3>

        {/* Types */}
        <div className="flex flex-wrap gap-2 mb-4">
          {pokemon.types.map((type) => (
            <span
              key={type.type.name}
              className={`px-3 py-1 text-xs font-medium rounded-full text-white ${typeColors[type.type.name] || 'bg-zinc-400'}`}
            >
              {type.type.name}
            </span>
          ))}
        </div>

        {/* Stats Preview */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">HP</p>
            <p className="font-bold text-zinc-700 dark:text-zinc-200">
              {pokemon.stats.find((s) => s.stat.name === 'hp')?.base_stat || 0}
            </p>
          </div>
          <div className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">ATK</p>
            <p className="font-bold text-zinc-700 dark:text-zinc-200">
              {pokemon.stats.find((s) => s.stat.name === 'attack')?.base_stat || 0}
            </p>
          </div>
          <div className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">DEF</p>
            <p className="font-bold text-zinc-700 dark:text-zinc-200">
              {pokemon.stats.find((s) => s.stat.name === 'defense')?.base_stat || 0}
            </p>
          </div>
        </div>

        {/* Detail Button */}
        <Link
          href={`/pokemon/${pokemon.name}`}
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors group/btn"
        >
          Ver Detalhes
          <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </div>
  )
}