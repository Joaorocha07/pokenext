export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-20 h-20 border-4 border-zinc-200 dark:border-zinc-700 rounded-full" />
        {/* Spinning ring */}
        <div className="absolute inset-0 w-20 h-20 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        {/* Inner pokeball */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-red-500 rounded-full animate-bounce" />
        </div>
      </div>
      <p className="mt-6 text-lg font-medium text-zinc-600 dark:text-zinc-300 animate-pulse">
        Procurando Pokémon...
      </p>
    </div>
  )
}