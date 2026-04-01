import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PokeNext',
  description: 'Explore o mundo Pokémon',
}

export default function TutorialLayout({
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