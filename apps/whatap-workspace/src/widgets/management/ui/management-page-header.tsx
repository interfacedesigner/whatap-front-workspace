import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Separator } from '@/shared/components/ui/separator';
import { Search } from 'lucide-react';
import type { ReactNode } from 'react';

interface ManagementPageHeaderProps {
  title: string;
  description: string;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  ctaLabel: string;
  onCtaClick: () => void;
  badge?: number | string;
  filterElement?: ReactNode;
}

export function ManagementPageHeader({
  title,
  description,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  ctaLabel,
  onCtaClick,
  badge,
  filterElement,
}: ManagementPageHeaderProps) {
  return (
    <div className='flex items-center justify-between gap-4'>
      {/* Left: Title + Badge + Description */}
      <div className='flex items-center gap-3 min-w-0 shrink-0'>
        <div className='flex items-center gap-2'>
          <h1 className='text-2xl font-semibold tracking-tight whitespace-nowrap'>{title}</h1>
          {badge != null && (
            <Badge variant='secondary' className='text-xs'>
              {badge}
            </Badge>
          )}
        </div>
        <Separator orientation='vertical' className='!h-4' />
        <p className='text-sm text-muted-foreground whitespace-nowrap truncate'>{description}</p>
      </div>

      {/* Right: Search + Filter + CTA */}
      <div className='flex items-center gap-3 shrink-0'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className='pl-9 w-[200px]'
          />
        </div>
        {filterElement}
        <Button onClick={onCtaClick}>{ctaLabel}</Button>
      </div>
    </div>
  );
}
