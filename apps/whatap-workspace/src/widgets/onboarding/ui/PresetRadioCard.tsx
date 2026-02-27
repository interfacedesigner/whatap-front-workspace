/**
 * PresetRadioCard
 * @description Preset 선택용 라디오 카드. 선택 시 테두리 강조 + 체크 아이콘 표시
 * Step 1/3/4/5에서 공통 사용
 */
import { cn } from '@/shared/lib/utils';
import { Check } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface PresetRadioCardProps {
  value: string;
  selected: boolean;
  onSelect: (value: string) => void;
  title: string;
  description: string;
  icon?: LucideIcon;
  badge?: string | undefined;
  disabled?: boolean;
}

export function PresetRadioCard({
  value,
  selected,
  onSelect,
  title,
  description,
  icon: Icon,
  badge,
  disabled = false,
}: PresetRadioCardProps) {
  return (
    <button
      type='button'
      onClick={() => !disabled && onSelect(value)}
      disabled={disabled}
      className={cn(
        'relative flex flex-col gap-2 rounded-lg border p-4 text-left transition-all w-full',
        'hover:border-[#296cf2]/40 hover:bg-[#296cf2]/[0.02]',
        selected ? 'border-[#296cf2] bg-[#296cf2]/[0.04] ring-1 ring-[#296cf2]/20' : 'border-zinc-200 bg-white',
        disabled && 'opacity-50 cursor-not-allowed hover:border-zinc-200 hover:bg-white',
      )}
    >
      {/* Selected check indicator */}
      {selected && (
        <div className='absolute top-3 right-3 flex items-center justify-center w-5 h-5 rounded-full bg-[#296cf2]'>
          <Check className='w-3 h-3 text-white' />
        </div>
      )}

      {/* Icon + Badge row */}
      <div className='flex items-center gap-2'>
        {Icon && (
          <div
            className={cn(
              'flex items-center justify-center w-8 h-8 rounded-md',
              selected ? 'bg-[#296cf2]/10 text-[#296cf2]' : 'bg-zinc-100 text-zinc-500',
            )}
          >
            <Icon className='w-4 h-4' />
          </div>
        )}
        {badge && (
          <span
            className={cn(
              'text-[10px] font-semibold px-1.5 py-0.5 rounded',
              selected ? 'bg-[#296cf2]/10 text-[#296cf2]' : 'bg-zinc-100 text-zinc-500',
            )}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Title */}
      <h4 className={cn('text-sm font-semibold', selected ? 'text-[#222]' : 'text-zinc-700')}>{title}</h4>

      {/* Description */}
      <p className='text-xs text-zinc-500 leading-relaxed'>{description}</p>
    </button>
  );
}
