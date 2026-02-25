import type { Role } from '@/entities/management';
import { formatDate } from '@/entities/management';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, Calendar, FileText, Shield } from 'lucide-react';

interface RoleDetailHeaderProps {
  role: Role;
  wsid: string;
}

export function RoleDetailHeader({ role, wsid }: RoleDetailHeaderProps) {
  return (
    <div className='space-y-4'>
      <Link to='/ws/$wsid/management/roles' params={{ wsid }}>
        <Button variant='ghost' size='sm' className='gap-1'>
          <ArrowLeft className='h-4 w-4' />
          Back to Roles
        </Button>
      </Link>
      <Card>
        <CardContent className='pt-6'>
          <div className='space-y-2'>
            <div className='flex items-center gap-3'>
              <h2 className='text-xl font-semibold'>{role.name}</h2>
              <Badge variant={role.scope === 'cross-workspace' ? 'default' : 'secondary'}>
                {role.scope === 'cross-workspace' ? 'Cross-Workspace' : 'Workspace'}
              </Badge>
            </div>
            <div className='flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground'>
              <span className='flex items-center gap-1.5'>
                <FileText className='h-3.5 w-3.5' />
                {role.description}
              </span>
              <span className='flex items-center gap-1.5'>
                <Calendar className='h-3.5 w-3.5' />
                Created {formatDate(role.createdAt)}
              </span>
              <span className='flex items-center gap-1.5'>
                <Shield className='h-3.5 w-3.5' />
                {role.permissionIds.length} permissions
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
