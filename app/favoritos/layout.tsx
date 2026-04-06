import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Meus Pokémons Favoritos | PokeNext',
    template: '%s | Favoritos PokeNext'
  },
  description: 'Gerencie sua lista de Pokémons favoritos na PokeNext. Salve seus Pokémon preferidos, organize times e acesse rapidamente stats, evoluções e habilidades dos seus companions.',
  
  keywords: [
    'pokemons favoritos',
    'lista pokemon',
    'meus pokemons',
    'salvar pokemon',
    'times pokemon',
    'pokedex pessoal'
  ],
  
  openGraph: {
    title: 'Meus Pokémons Favoritos | PokeNext',
    description: 'Sua coleção pessoal de Pokémons favoritos. Salve, organize e compare seus Pokémon preferidos.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'PokeNext'
  },
  
  alternates: {
    canonical: 'https://pokenextweb.vercel.app/favoritos'
  },
  
  robots: {
    index: true, 
    follow: true
  }
}

export default function FavoritosLayout({
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