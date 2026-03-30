import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pokémon - PokéNext',
  description: 'Explore o mundo Pokémon',
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