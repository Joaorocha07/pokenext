const BASE_URL = 'https://pokeapi.co/api/v2'

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {

  const url = endpoint.startsWith('http') 
    ? endpoint 
    : `${BASE_URL}${endpoint}`

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  })

  console.log(response)

  if (!response.ok) {
    throw new Error(
      `Erro na API: ${response.status} - ${response.statusText}`
    )
  }

  return response.json() as Promise<T>
}