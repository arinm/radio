import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string>;
}

export function Pagination({ currentPage, totalPages, basePath, searchParams = {} }: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildHref = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page > 1) params.set('page', String(page));
    else params.delete('page');
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  // Generate page numbers to show
  const pages: (number | 'ellipsis')[] = [];
  const delta = 2;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== 'ellipsis') {
      pages.push('ellipsis');
    }
  }

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Paginare">
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1)}
          className="flex h-9 items-center gap-1 rounded-lg border border-border px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Pagina anterioara"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Inapoi</span>
        </Link>
      ) : (
        <span className="flex h-9 items-center gap-1 rounded-lg border border-border px-3 text-sm text-muted-foreground opacity-50">
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Inapoi</span>
        </span>
      )}

      {/* Page numbers */}
      {pages.map((page, idx) =>
        page === 'ellipsis' ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground">
            ...
          </span>
        ) : (
          <Link
            key={page}
            href={buildHref(page)}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors',
              page === currentPage
                ? 'bg-primary text-primary-foreground'
                : 'border border-border text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
            aria-label={`Pagina ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </Link>
        ),
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={buildHref(currentPage + 1)}
          className="flex h-9 items-center gap-1 rounded-lg border border-border px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Pagina urmatoare"
        >
          <span className="hidden sm:inline">Inainte</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className="flex h-9 items-center gap-1 rounded-lg border border-border px-3 text-sm text-muted-foreground opacity-50">
          <span className="hidden sm:inline">Inainte</span>
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
