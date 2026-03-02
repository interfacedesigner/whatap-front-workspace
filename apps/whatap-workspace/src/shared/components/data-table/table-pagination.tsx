import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { type KeyboardEvent, useCallback, useState } from 'react';

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

interface TablePaginationProps {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  goToPage: (page: number) => void;
}

export function TablePagination({
  page,
  pageSize,
  totalCount,
  totalPages,
  onPageChange,
  onPageSizeChange,
  goToPage,
}: TablePaginationProps) {
  const [pageInput, setPageInput] = useState(String(page));

  const handlePageInputKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const value = Number(pageInput);
        goToPage(value);
        setPageInput(String(Math.max(1, Math.min(value || 1, totalPages))));
      }
    },
    [pageInput, goToPage, totalPages],
  );

  const handlePageInputBlur = useCallback(() => {
    setPageInput(String(page));
  }, [page]);

  const handlePrevious = useCallback(() => {
    const newPage = page - 1;
    onPageChange(newPage);
    setPageInput(String(newPage));
  }, [page, onPageChange]);

  const handleNext = useCallback(() => {
    const newPage = page + 1;
    onPageChange(newPage);
    setPageInput(String(newPage));
  }, [page, onPageChange]);

  const startRow = (page - 1) * pageSize + 1;
  const endRow = Math.min(page * pageSize, totalCount);

  return (
    <div className='flex items-center justify-between border-t px-3 py-2'>
      <div className='flex items-center gap-2 text-xs text-muted-foreground'>
        <span>Rows per page</span>
        <Select value={String(pageSize)} onValueChange={(val) => onPageSizeChange(Number(val))}>
          <SelectTrigger className='h-7 w-[62px] text-xs'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAGE_SIZE_OPTIONS.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className='ml-1 tabular-nums'>
          {startRow}-{endRow} of {totalCount}
        </span>
      </div>

      <div className='flex items-center gap-1.5'>
        <span className='text-xs text-muted-foreground'>Page</span>
        <Input
          className='h-7 w-12 text-center text-xs tabular-nums'
          value={pageInput}
          onChange={(e) => setPageInput(e.target.value)}
          onKeyDown={handlePageInputKeyDown}
          onBlur={handlePageInputBlur}
        />
        <span className='text-xs text-muted-foreground'>of {totalPages}</span>
        <Button variant='outline' size='icon' className='h-7 w-7' onClick={handlePrevious} disabled={page <= 1}>
          <ChevronLeft className='h-3.5 w-3.5' />
        </Button>
        <Button variant='outline' size='icon' className='h-7 w-7' onClick={handleNext} disabled={page >= totalPages}>
          <ChevronRight className='h-3.5 w-3.5' />
        </Button>
      </div>
    </div>
  );
}
