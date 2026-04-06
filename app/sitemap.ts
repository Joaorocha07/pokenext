import { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pokemons = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1000")
    .then(res => res.json())
  
  const pokemonUrls = pokemons.results.map((p: any, index: number) => ({
    url: `https://pokenextweb.vercel.app/pokemon/${index + 1}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8
  }))
  
  return [
    {
      url: "https://pokenextweb.vercel.app",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1
    },
    ...pokemonUrls
  ]
}