import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';

interface RolesTypeFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function RolesTypeFilter({ value, onChange }: RolesTypeFilterProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className='w-[180px]'>
        <SelectValue placeholder='All Types' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='all'>All Types</SelectItem>
        <SelectItem value='default'>Default</SelectItem>
        <SelectItem value='custom'>Custom</SelectItem>
      </SelectContent>
    </Select>
  );
}
