import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Pokédex Completa | Mais de 1000 Pokémons | PokeNext',
    template: '%s | PokeNext Pokédex'
  },
  description: 'Pokédex online completa com mais de 1000 Pokémons. Busca inteligente, filtros por tipo, estatísticas detalhadas, evoluções e habilidades. A melhor Pokédex em português para treinadores.',
  
  keywords: [
    'pokedex completa',
    'pokedex online',
    'lista de pokemons',
    'todos os pokemons',
    'pokemon 1 a 1000',
    'pokedex nacional',
    'pokemon scarlet violet',
    'pokemon go lista'
  ],
  
  openGraph: {
    title: 'Pokédex Completa Online | Mais de 1000 Pokémons | PokeNext',
    description: 'Explore todos os Pokémons em nossa Pokédex online. Busca avançada, filtros por tipo, stats completos e informações detalhadas.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'PokeNext',
    images: [
      {
        url: 'https://pokenextweb.vercel.app/og-pokedex.jpg',
        width: 1200,
        height: 630,
        alt: 'Pokédex PokeNext - Mais de 1000 Pokémons'
      }
    ]
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'Pokédex Completa | PokeNext',
    description: 'Mais de 1000 Pokémons com busca inteligente e filtros avançados.'
  },
  
  alternates: {
    canonical: 'https://pokenextweb.vercel.app/pokemon'
  },
  
  robots: {
    index: true,
    follow: true
  }
}

export default function PokemonLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {children}
    </div>
  )
}