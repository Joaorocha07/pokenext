import "./globals.css"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "PokeNext | Pokédex Completa com Stats e Favoritos",
    template: "%s | PokeNext"
  },
  
  description: "Explore mais de 1000 Pokémons com a PokeNext. Pokédex completa com estatísticas detalhadas, busca inteligente, favoritos e dados oficiais. Ideal para treinadores e jogadores competitivos.",
  
  metadataBase: new URL("https://pokenextweb.vercel.app"),

  openGraph: {
    title: "PokeNext - Pokédex Completa Online",
    description: "Descubra, pesquise e favorite seus Pokémons. Mais de 1000 Pokémons com stats detalhados.",
    url: "https://pokenextweb.vercel.app",
    siteName: "PokeNext",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/pokemon-wallpaper.png",
        width: 1200,
        height: 630,
        alt: "PokeNext - Pokédex Online"
      }
    ]
  },
  
  twitter: {
    card: "summary_large_image",
    title: "PokeNext - Pokédex Completa",
    description: "Explore mais de 1000 Pokémons com stats detalhados",
    images: ["/pokemon-wallpaper.png"]
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    }
  },
  
  alternates: {
    canonical: "https://pokenextweb.vercel.app"
  },
  
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png"
  },
  
  manifest: "/manifest.json"
}

// ✅ SCHEMA.ORG JSON-LD (dados estruturados)
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "PokeNext",
  "applicationCategory": "GameApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "BRL"
  },
  "description": "Pokédex online completa com mais de 1000 Pokémons, estatísticas detalhadas e ferramentas para jogadores.",
  "url": "https://pokenextweb.vercel.app",
  "author": {
    "@type": "Organization",
    "name": "PokeNext"
  }
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR" 
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        <link rel="preconnect" href="https://pokeapi.co" />
        <link rel="dns-prefetch" href="https://pokeapi.co" />
      </head>
      
      <body 
        className="min-h-full flex flex-col"
        suppressHydrationWarning
      >
        <Analytics />
        {children}
      </body>
    </html>
  )
}