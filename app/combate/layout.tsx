import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Calculadora de Dano Pokémon | PokeNext',
    template: '%s | Combate PokeNext'
  },
  description: 'Calcule dano de ataques Pokémon, descubra vantagens de tipos e fraquezas. Ferramenta essencial para batalhas competitivas e jogadores de Pokémon GO, Scarlet/Violet e jogos principais.',
  
  keywords: [
    'calculadora dano pokemon',
    'vantagens tipos pokemon',
    'fraquezas pokemon',
    'batalhas competitivas',
    'pokemon go pvp',
    'type chart pokemon',
    'matchup pokemon'
  ],
  
  openGraph: {
    title: 'Calculadora de Combate Pokémon | PokeNext',
    description: 'Descubra vantagens de tipos, calcule dano de ataques e domine as batalhas Pokémon com nossa ferramenta completa.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'PokeNext'
  },
  
  alternates: {
    canonical: 'https://pokenextweb.vercel.app/combate'
  },
  
  robots: {
    index: true,
    follow: true
  }
}

export default function CombateLayout({
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