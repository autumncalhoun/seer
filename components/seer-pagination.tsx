// AI Generated: Can we wrap the shadcn pagination into an opinionated implementation for Seer? it should take in the total pages, the current page and it should only show the next three pages, then an elipses

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface SeerPaginationProps {
  totalPages: number
  currentPage: number
  getPageHref: (page: number) => string
  className?: string
}

export function SeerPagination({
  totalPages,
  currentPage,
  getPageHref,
  className,
}: SeerPaginationProps) {
  const pageNumbers = Array.from(
    { length: Math.min(3, totalPages - currentPage + 1) },
    (_, i) => currentPage + i,
  ).filter((p) => p <= totalPages)
  const hasMore = currentPage + 2 < totalPages

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          {currentPage <= 1 ? (
            <PaginationPrevious
              href="#"
              className="pointer-events-none opacity-50"
              aria-disabled
            />
          ) : (
            <PaginationPrevious href={getPageHref(currentPage - 1)} />
          )}
        </PaginationItem>
        {pageNumbers.map((pageNum) => (
          <PaginationItem key={pageNum}>
            <PaginationLink
              href={getPageHref(pageNum)}
              isActive={pageNum === currentPage}>
              {pageNum}
            </PaginationLink>
          </PaginationItem>
        ))}
        {hasMore && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem>
          {currentPage >= totalPages ? (
            <PaginationNext
              href="#"
              className="pointer-events-none opacity-50"
              aria-disabled
            />
          ) : (
            <PaginationNext href={getPageHref(currentPage + 1)} />
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
