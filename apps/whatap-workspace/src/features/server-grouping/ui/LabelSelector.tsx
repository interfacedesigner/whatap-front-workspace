/**
 * LabelSelector Component
 * @description 서버 아이콘 라벨 옵션 선택 드롭다운
 */
import type { IconLabelOption } from '@/entities/server';
import { ICON_LABEL_OPTIONS } from '@/entities/server';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { cn } from '@/shared/lib/utils';

export interface LabelSelectorProps {
  /** 선택된 값 */
  value: IconLabelOption;
  /** 변경 핸들러 */
  onChange: (value: IconLabelOption) => void;
  /** 비활성화 */
  disabled?: boolean;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 서버 아이콘 라벨 옵션 선택 드롭다운
 */
export function LabelSelector({ value, onChange, disabled = false, className }: LabelSelectorProps) {
  const handleChange = (newValue: string) => {
    if (newValue === '__none__') {
      onChange(null);
    } else {
      onChange(newValue as Exclude<IconLabelOption, null>);
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className='text-sm text-muted-foreground whitespace-nowrap'>라벨</span>
      <Select value={value ?? '__none__'} onValueChange={handleChange} disabled={disabled}>
        <SelectTrigger className='w-[120px]'>
          <SelectValue placeholder='선택' />
        </SelectTrigger>
        <SelectContent>
          {ICON_LABEL_OPTIONS.map((option) => (
            <SelectItem key={option.value ?? '__none__'} value={option.value ?? '__none__'}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
