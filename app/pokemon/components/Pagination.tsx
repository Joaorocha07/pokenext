'use client'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (_page: number) => void
}

export function Pagination({ 
    currentPage, totalPages, onPageChange 
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  
  const getVisiblePages = () => {
    if (totalPages <= 7) return pages
    
    if (currentPage <= 4) return [...pages.slice(0, 5), '...', totalPages]
    if (currentPage >= totalPages - 3) return [1, '...', ...pages.slice(-5)]
    
    return [
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      totalPages
    ]
  }

  const visiblePages = getVisiblePages()

  return (
    <div className="flex items-center justify-center gap-2 mt-8 mb-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 
                   disabled:opacity-50 disabled:cursor-not-allowed
                   hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
      >
        ←
      </button>

      {visiblePages.map((page, idx) => (
        <button
          key={idx}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
          className={`px-4 py-2 rounded-lg font-medium transition-colors
            ${page === currentPage 
              ? 'bg-yellow-400 text-black' 
              : page === '...'
                ? 'cursor-default'
                : 'bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700'
            }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 
                   disabled:opacity-50 disabled:cursor-not-allowed
                   hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
      >
        →
      </button>
    </div>
  )
}