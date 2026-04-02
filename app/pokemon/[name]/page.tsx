import { notFound } from 'next/navigation'

import { Metadata } from 'next'

import { FavoriteButton } from './FavoriteButton'

import type { Pokemon } from '@/services/pokeapi/types'

import { pokemonService } from '@/services/pokeapi/pokemonService'

import {
  ArrowLeft, 
  Heart,
  Ruler, 
  Shield, 
  Sparkles,  
  Sword, 
  Target,
  Weight,
  Wind,
  Zap
} from 'lucide-react'

import Link from 'next/link'

import Image from 'next/image'

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ name: string }> 
}): Promise<Metadata> {
  const { name } = await params
  
  let pokemon: Pokemon
  
  try {
    pokemon = await pokemonService.getByIdOrName(name.toLowerCase())
  } catch {
    // Se não encontrar, retorna metadata padrão
    return {
      title: 'Pokémon não encontrado | PokeNext',
      description: 'O Pokémon que você procura não foi encontrado na nossa Pokédex.'
    }
  }

  // Formata o nome: pikachu → Pikachu
  const formattedName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
  
  // Extrai tipos para a descrição
  const types = pokemon.types.map(t => t.type.name).join(', ')
  
  // Extrai stats principais
  const hp = pokemon.stats.find(s => s.stat.name === 'hp')?.base_stat || 0
  const attack = pokemon.stats.find(s => s.stat.name === 'attack')?.base_stat || 0
  const defense = pokemon.stats.find(s => s.stat.name === 'defense')?.base_stat || 0

  return {
    // Título otimizado com keywords
    title: `${formattedName} - Stats, Tipos e Fraquezas | PokeNext`,
    
    // Descrição rica e detalhada (150-160 caracteres ideal)
    description: `${formattedName} é um Pokémon do tipo ${types}. Stats: HP ${hp}, Ataque ${attack}, Defesa ${defense}. Veja evoluções, habilidades, moveset e fraquezas na PokeNext.`,
    
    // Open Graph para redes sociais
    openGraph: {
      title: `${formattedName} - Pokédex Completa | PokeNext`,
      description: `Descubra tudo sobre ${formattedName}. Tipo ${types}, stats base, evoluções, habilidades e melhores movesets para batalhas.`,
      url: `https://pokenextweb.vercel.app/pokemon/${pokemon.name}`,
      siteName: 'PokeNext',
      locale: 'pt_BR',
      type: 'article',
      images: [
        {
          url: pokemonService.getImageUrl(pokemon.id, { official: true }),
          width: 475,
          height: 475,
          alt: `${formattedName} - Pokémon ${types}`
        }
      ]
    },
    
    // Twitter Cards
    twitter: {
      card: 'summary_large_image',
      title: `${formattedName} - Pokédex PokeNext`,
      description: `Stats, tipos e fraquezas de ${formattedName}. Pokédex completa com dados oficiais.`,
      images: [pokemonService.getImageUrl(pokemon.id, { official: true })]
    },
    
    alternates: {
      canonical: `https://pokenextweb.vercel.app/pokemon/${pokemon.name}`
    },
    
    // Keywords relacionadas (Google não usa meta keywords, mas outros sim)
    keywords: [
      pokemon.name,
      `${pokemon.name} pokemon`,
      `${pokemon.name} stats`,
      `${pokemon.name} fraquezas`,
      `${pokemon.name} evolução`,
      'pokedex',
      'pokemon',
      ...pokemon.types.map(t => `pokemon tipo ${t.type.name}`)
    ]
  }
}

const typeColors: Record<string, { 
    bg: string; text: string; gradient: string 
}> = {
  normal: { 
    bg: 'bg-zinc-400', 
    text: 'text-zinc-700',
    gradient: 'from-zinc-400 to-zinc-600'
  },
  fire: { 
    bg: 'bg-orange-500', 
    text: 'text-orange-700',
    gradient: 'from-orange-400 to-red-600'
  },
  water: { 
    bg: 'bg-blue-500', 
    text: 'text-blue-700',
    gradient: 'from-blue-400 to-blue-600'
  },
  electric: { 
    bg: 'bg-yellow-400', 
    text: 'text-yellow-700',
    gradient: 'from-yellow-300 to-yellow-500'
  },
  grass: { 
    bg: 'bg-green-500', 
    text: 'text-green-700',
    gradient: 'from-green-400 to-emerald-600'
  },
  ice: { 
    bg: 'bg-cyan-300', 
    text: 'text-cyan-700',
    gradient: 'from-cyan-300 to-blue-400'
  },
  fighting: { 
    bg: 'bg-red-600', 
    text: 'text-red-700',
    gradient: 'from-red-500 to-red-700'
  },
  poison: { 
    bg: 'bg-purple-500', 
    text: 'text-purple-700',
    gradient: 'from-purple-400 to-purple-600'
  },
  ground: { 
    bg: 'bg-amber-600', 
    text: 'text-amber-700',
    gradient: 'from-amber-500 to-yellow-600'
  },
  flying: { 
    bg: 'bg-sky-400', 
    text: 'text-sky-700',
    gradient: 'from-sky-300 to-blue-500'
  },
  psychic: { 
    bg: 'bg-pink-500', 
    text: 'text-pink-700',
    gradient: 'from-pink-400 to-rose-500'
  },
  bug: { 
    bg: 'bg-lime-500', 
    text: 'text-lime-700',
    gradient: 'from-lime-400 to-green-500'
  },
  rock: { 
    bg: 'bg-stone-500', 
    text: 'text-stone-700',
    gradient: 'from-stone-400 to-stone-600'
  },
  ghost: { 
    bg: 'bg-violet-600', 
    text: 'text-violet-700',
    gradient: 'from-violet-500 to-purple-700'
  },
  dragon: { 
    bg: 'bg-indigo-600', 
    text: 'text-indigo-700',
    gradient: 'from-indigo-500 to-purple-600'
  },
  dark: { 
    bg: 'bg-neutral-700', 
    text: 'text-neutral-300',
    gradient: 'from-neutral-600 to-neutral-800'
  },
  steel: { 
    bg: 'bg-slate-400', 
    text: 'text-slate-700',
    gradient: 'from-slate-300 to-slate-500'
  },
  fairy: { 
    bg: 'bg-rose-300', 
    text: 'text-rose-700',
    gradient: 'from-rose-300 to-pink-400'
  },
}

export default async function PokemonDetailPage({ 
  params 
}: { 
  params: Promise<{ name: string }> 
}) {
  const { name } = await params
  
  let pokemon: Pokemon

  try {
    pokemon = await pokemonService.getByIdOrName(name)
  } catch {
    notFound()
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: pokemon.name,
    description: `Pokémon ${pokemon.name} - Tipo: ${pokemon.types.map(t => t.type.name).join('/')}`,
    image: pokemonService.getImageUrl(pokemon.id, { official: true }),
    url: `https://pokenextweb.vercel.app/pokemon/${pokemon.name}`,
    gameItem: {
      '@type': 'Thing',
      name: pokemon.name,
      additionalProperty: pokemon.stats.map(stat => ({
        '@type': 'PropertyValue',
        name: stat.stat.name,
        value: stat.base_stat
      }))
    }
  }

  const mainType = pokemon.types[0]?.type.name || 'normal'
  const theme = typeColors[mainType] || typeColors.normal

  const stats = {
    hp: pokemon.stats.find((s) => s.stat.name === 'hp')?.base_stat || 0,
    attack: pokemon.stats.find((s) => s.stat.name === 'attack')?.base_stat || 0,
    defense: pokemon.stats.find((s) => s.stat.name === 'defense')?.base_stat || 0,
    specialAttack: pokemon.stats.find((s) => s.stat.name === 'special-attack')?.base_stat || 0,
    specialDefense: pokemon.stats.find((s) => s.stat.name === 'special-defense')?.base_stat || 0,
    speed: pokemon.stats.find((s) => s.stat.name === 'speed')?.base_stat || 0,
  }

  const totalStats = Object.values(stats).reduce((a, b) => a + b, 0)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-zinc-50 dark:bg-black">
        <div className={`bg-linear-to-br ${theme.gradient} relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full" />
            <div className="absolute bottom-10 right-10 w-48 h-48 border-4 border-white rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border-4 border-white rounded-full" />
          </div>

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link
              href="/pokemon"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Link>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="relative flex justify-center">
                <div className="relative w-72 h-72 sm:w-96 sm:h-96">
                  <Image
                    src={
                      pokemonService.getImageUrl(pokemon.id, { official: true })
                    }
                    alt={pokemon.name}
                    fill
                    className="object-contain drop-shadow-2xl animate-bounce-slow"
                    priority
                  />
                </div>
              </div>

              <div className="text-white">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-white/60 font-mono text-lg">
                    #{String(pokemon.id).padStart(3, '0')}
                  </span>
                  <FavoriteButton pokemonId={pokemon.id} />
                </div>

                <h1 className="text-5xl sm:text-7xl font-bold capitalize mb-4">
                  {pokemon.name}
                </h1>

                <div className="flex flex-wrap gap-3 mb-6">
                  {pokemon.types.map((type) => (
                    <span
                      key={type.type.name}
                      className={`px-6 py-2 rounded-full text-lg font-medium capitalize bg-white/20 backdrop-blur-sm border border-white/30`}
                    >
                      {type.type.name}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <InfoCard 
                    icon={<Weight className="w-5 h-5" />}
                    label="Peso"
                    value={`${pokemon.weight / 10} kg`}
                  />
                  <InfoCard 
                    icon={<Ruler className="w-5 h-5" />}
                    label="Altura"
                    value={`${pokemon.height / 10} m`}
                  />
                  <InfoCard 
                    icon={<Sparkles className="w-5 h-5" />}
                    label="Experiência"
                    value={pokemon.base_experience.toString()}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-8">
            <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-6 flex items-center gap-2">
                <Target className="w-6 h-6 text-red-500" />
                Status Base
              </h2>

              <div className="space-y-4">
                <StatBar label="HP" value={stats.hp} max={255} icon={<Heart className="w-4 h-4" />} color="bg-red-500" />
                <StatBar label="Ataque" value={stats.attack} max={255} icon={<Sword className="w-4 h-4" />} color="bg-orange-500" />
                <StatBar label="Defesa" value={stats.defense} max={255} icon={<Shield className="w-4 h-4" />} color="bg-blue-500" />
                <StatBar label="Ataque Esp." value={stats.specialAttack} max={255} icon={<Zap className="w-4 h-4" />} color="bg-yellow-500" />
                <StatBar label="Defesa Esp." value={stats.specialDefense} max={255} icon={<Shield className="w-4 h-4" />} color="bg-green-500" />
                <StatBar label="Velocidade" value={stats.speed} max={255} icon={<Wind className="w-4 h-4" />} color="bg-pink-500" />
              </div>

              <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-700">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-600 dark:text-zinc-400 font-medium">Total</span>
                  <span className="text-2xl font-bold text-zinc-800 dark:text-white">{totalStats}</span>
                </div>
              </div>
            </section>

            <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-500" />
                Habilidades
              </h2>

              <div className="space-y-4">
                {pokemon.abilities.map((ability) => (
                  <div
                    key={ability.ability.name}
                    className={`p-4 rounded-2xl border-2 ${
                      ability.is_hidden 
                        ? 'border-purple-200 bg-purple-50 dark:border-purple-900 dark:bg-purple-950/30' 
                        : 'border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-lg font-semibold capitalize text-zinc-800 dark:text-white">
                        {ability.ability.name.replace('-', ' ')}
                      </h3>
                      {ability.is_hidden && (
                        <span className="px-3 py-1 text-xs font-medium bg-purple-500 text-white rounded-full">
                          Hidden
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {ability.is_hidden 
                        ? 'Habilidade oculta que pode ser revelada em circunstâncias especiais.'
                        : 'Habilidade padrão disponível normalmente.'}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-bold text-zinc-800 dark:text-white mb-4">
                  Principais Movimentos
                </h3>
                <div className="flex flex-wrap gap-2">
                  {pokemon.moves.slice(0, 8).map((move) => (
                    <span
                      key={move.move.name}
                      className="px-3 py-1.5 text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg capitalize"
                    >
                      {move.move.name.replace('-', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}

function InfoCard({ 
  icon, 
  label, 
  value 
}: { 
  icon: React.ReactNode
  label: string
  value: string 
}) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
      <div className="flex justify-center mb-2">{icon}</div>
      <p className="text-white/60 text-sm">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  )
}

function StatBar({ 
  label, 
  value, 
  max, 
  icon,
  color 
}: { 
  label: string
  value: number
  max: number
  icon: React.ReactNode
  color: string
}) {
  const percentage = Math.min((value / max) * 100, 100)
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
          {icon}
          <span className="font-medium">{label}</span>
        </div>
        <span className="font-bold text-zinc-800 dark:text-white">{value}</span>
      </div>
      <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}