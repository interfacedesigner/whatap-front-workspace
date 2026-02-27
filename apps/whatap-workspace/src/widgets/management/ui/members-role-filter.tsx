import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';

interface MembersRoleFilterProps {
  roles: string[];
  value: string;
  onChange: (value: string) => void;
}

export function MembersRoleFilter({ roles, value, onChange }: MembersRoleFilterProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className='w-[180px]'>
        <SelectValue placeholder='All Roles' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='all'>All Roles</SelectItem>
        {roles.map((role) => (
          <SelectItem key={role} value={role}>
            {role}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
