import { Heart, Search, Sparkles, Zap } from 'lucide-react'

import Link from 'next/link'

import Image from 'next/image'

import LogoPokemon from '@/assets/logo-pokemon.png'

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-50 via-white to-zinc-100 dark:from-black dark:via-zinc-950 dark:to-black overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <header className="relative z-10 w-full py-8 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <Link 
            href="/" 
            className="group relative"
          >  
            <div className="relative flex flex-col items-center gap-3">
              <div className="relative w-48 h-16 sm:w-56 sm:h-20 lg:w-64 lg:h-24 transform group-hover:scale-105 transition-transform duration-300">
                <Image
                  src={LogoPokemon}
                  alt="PokéNext"
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex flex-col items-center justify-center px-4 py-12 lg:py-20">
        <div className="relative w-full max-w-6xl mb-12">
          <div className="absolute -left-4 lg:left-20 top-0 w-32 h-32 lg:w-48 lg:h-48 animate-bounce-slow opacity-80 hover:opacity-100 transition-opacity">
            <Image
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png"
              alt="Charizard"
              fill
              className="object-contain drop-shadow-2xl hover:scale-110 transition-transform duration-500"
              unoptimized
            />
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 -top-8 w-40 h-40 lg:w-64 lg:h-64 animate-float z-20">
            <Image
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
              alt="Pikachu"
              fill
              className="object-contain drop-shadow-2xl hover:scale-110 transition-transform duration-500"
              unoptimized
            />
            <div className="absolute inset-0 bg-yellow-400/30 rounded-full blur-3xl -z-10 animate-pulse" />
          </div>

          <div className="absolute -right-4 lg:right-20 top-4 w-32 h-32 lg:w-48 lg:h-48 animate-bounce-slow delay-500 opacity-80 hover:opacity-100 transition-opacity">
            <Image
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png"
              alt="Blastoise"
              fill
              className="object-contain drop-shadow-2xl hover:scale-110 transition-transform duration-500"
              unoptimized
            />
          </div>

          <div className="absolute left-10 lg:left-40 bottom-0 w-28 h-28 lg:w-40 lg:h-40 animate-float delay-700 opacity-70 hover:opacity-100 transition-opacity hidden sm:block">
            <Image
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png"
              alt="Venusaur"
              fill
              className="object-contain drop-shadow-2xl"
              unoptimized
            />
          </div>

          <div className="absolute right-10 lg:right-40 bottom-0 w-28 h-28 lg:w-40 lg:h-40 animate-float delay-300 opacity-70 hover:opacity-100 transition-opacity hidden sm:block">
            <Image
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png"
              alt="Gengar"
              fill
              className="object-contain drop-shadow-2xl"
              unoptimized
            />
          </div>
        </div>

        <div className="relative z-30 text-center mt-48 sm:mt-56 lg:mt-64 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-sm font-medium mb-6 animate-fade-in-up">
            <Zap className="w-4 h-4" />
            <span>Mais de 1000 Pokémons disponíveis</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-zinc-900 dark:text-white mb-6 leading-tight animate-fade-in-up delay-100">
            Explore o mundo{' '}
            <span className="bg-linear-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Pokémon
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            Descubra, pesquise e favorite seus Pokémons preferidos. 
            Uma experiência completa com dados oficiais da PokéAPI, 
            estatísticas detalhadas e uma interface moderna.
          </p>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-12 animate-fade-in-up delay-300">
            <Feature icon={<Search className="w-5 h-5" />} text="Busca inteligente" />
            <Feature icon={<Heart className="w-5 h-5" />} text="Favoritos salvos" />
            <Feature icon={<Sparkles className="w-5 h-5" />} text="Detalhes completos" />
          </div>

          <div className="animate-fade-in-up delay-400">
            <Link
              href="/pokemon"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-linear-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold text-lg rounded-full shadow-xl shadow-yellow-400/25 hover:shadow-2xl hover:shadow-yellow-400/40 transition-all duration-300 hover:scale-105"
            >
              <span>Explorar Pokémons</span>
            </Link>
            
            <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-500">
              Grátis • Sem cadastro • Cache inteligente
            </p>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-4xl mx-auto w-full animate-fade-in-up delay-500">
          <Stat number="1000+" label="Pokémons" />
          <Stat number="18" label="Tipos" />
          <Stat number="8" label="Gerações" />
          <Stat number="∞" label="Diversão" />
        </div>
      </main>

      <footer className="relative z-10 py-8 text-center text-zinc-500 dark:text-zinc-600 text-sm">
        <p>© 2024 PokéNext • Feito com Next.js e Tailwind CSS</p>
      </footer>
    </div>
  )
}

function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
      <span className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-yellow-500">
        {icon}
      </span>
      <span className="font-medium">{text}</span>
    </div>
  )
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
        {number}
      </div>
      <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{label}</div>
    </div>
  )
}