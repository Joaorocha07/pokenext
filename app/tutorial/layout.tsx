import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Guias e Tutoriais Pokémon | PokeNext',
    template: '%s | Tutorial PokeNext'
  },
  description: 'Aprenda tudo sobre Pokémon com nossos tutoriais completos. Guia de tipos, como evoluir Eevee, melhores movesets, estratégias competitivas e dicas para iniciantes e treinadores avançados.',
  
  keywords: [
    'tutorial pokemon',
    'guia pokemon',
    'como jogar pokemon',
    'dicas pokemon go',
    'evoluções pokemon',
    'melhores ataques pokemon',
    'guia iniciante pokemon',
    'competitivo pokemon tutorial'
  ],
  
  openGraph: {
    title: 'Tutoriais e Guias Pokémon | Aprenda com PokeNext',
    description: 'Tutoriais completos sobre mecânicas de Pokémon, evoluções, estratégias de batalha e dicas para treinadores de todos os níveis.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'PokeNext'
  },
  
  alternates: {
    canonical: 'https://pokenextweb.vercel.app/tutorial'
  },
  
  robots: {
    index: true,
    follow: true
  }
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