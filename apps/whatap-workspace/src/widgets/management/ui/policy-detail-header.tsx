import type { Policy } from '@/entities/management';
import { formatDate } from '@/entities/management';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, Calendar, FileText } from 'lucide-react';

interface PolicyDetailHeaderProps {
  policy: Policy;
  wsid: string;
}

export function PolicyDetailHeader({ policy, wsid }: PolicyDetailHeaderProps) {
  return (
    <div className='space-y-4'>
      <Link to='/ws/$wsid/management/policies' params={{ wsid }}>
        <Button variant='ghost' size='sm' className='gap-1'>
          <ArrowLeft className='h-4 w-4' />
          Back to Policies
        </Button>
      </Link>
      <Card>
        <CardContent className='pt-6'>
          <div className='space-y-2'>
            <h2 className='text-xl font-semibold'>{policy.name}</h2>
            <div className='flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground'>
              <span className='flex items-center gap-1.5'>
                <FileText className='h-3.5 w-3.5' />
                {policy.description}
              </span>
              <span className='flex items-center gap-1.5'>
                <Calendar className='h-3.5 w-3.5' />
                Created {formatDate(policy.createdAt)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
