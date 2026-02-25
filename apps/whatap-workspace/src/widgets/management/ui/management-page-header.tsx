import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Search } from 'lucide-react';

interface ManagementPageHeaderProps {
  title: string;
  description: string;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  ctaLabel: string;
  onCtaClick: () => void;
}

export function ManagementPageHeader({
  title,
  description,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  ctaLabel,
  onCtaClick,
}: ManagementPageHeaderProps) {
  return (
    <div className='space-y-4'>
      <div>
        <h1 className='text-2xl font-semibold tracking-tight'>{title}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>{description}</p>
      </div>
      <div className='flex items-center justify-between gap-4'>
        <div className='relative w-full max-w-sm'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className='pl-9'
          />
        </div>
        <Button onClick={onCtaClick}>{ctaLabel}</Button>
      </div>
    </div>
  );
}
