/**
 * GroupSelector Component
 * @description 그룹화 기준 선택 드롭다운
 */
import type { GroupOptionKey } from '@/entities/server';
import { GROUP_OPTION_LABELS } from '@/entities/server';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { cn } from '@/shared/lib/utils';

export interface GroupSelectorProps {
  /** 라벨 */
  label: string;
  /** 선택된 값 */
  value: GroupOptionKey | null;
  /** 변경 핸들러 */
  onChange: (value: GroupOptionKey | null) => void;
  /** 제외할 옵션 (다른 셀렉터에서 이미 선택된 값) */
  excludeValues?: (GroupOptionKey | null)[];
  /** 비활성화 */
  disabled?: boolean;
  /** 추가 CSS 클래스 */
  className?: string;
}

const GROUP_OPTIONS: GroupOptionKey[] = [
  'defaultGroup',
  'serverType',
  'OSType',
  'OSVersion',
  'cloudRegion',
  'csp',
  'cloudInstanceType',
  'model',
  'hwSerial',
];

/**
 * 그룹화 기준 선택 드롭다운
 */
export function GroupSelector({
  label,
  value,
  onChange,
  excludeValues = [],
  disabled = false,
  className,
}: GroupSelectorProps) {
  const availableOptions = GROUP_OPTIONS.filter((opt) => !excludeValues.includes(opt));

  const handleChange = (newValue: string) => {
    if (newValue === '__none__') {
      onChange(null);
    } else {
      onChange(newValue as GroupOptionKey);
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className='text-sm text-muted-foreground whitespace-nowrap'>{label}</span>
      <Select value={value ?? '__none__'} onValueChange={handleChange} disabled={disabled}>
        <SelectTrigger className='w-[140px]'>
          <SelectValue placeholder='선택' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='__none__'>없음</SelectItem>
          {availableOptions.map((option) => (
            <SelectItem key={option} value={option}>
              {GROUP_OPTION_LABELS[option]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
