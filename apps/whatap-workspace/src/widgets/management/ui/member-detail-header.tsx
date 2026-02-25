import type { Member } from '@/entities/management';
import { MEMBER_STATUS_CONFIG, formatDate, formatDateTime } from '@/entities/management';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, Calendar, Clock, Mail } from 'lucide-react';

interface MemberDetailHeaderProps {
  member: Member;
  wsid: string;
}

export function MemberDetailHeader({ member, wsid }: MemberDetailHeaderProps) {
  const statusConfig = MEMBER_STATUS_CONFIG[member.status];

  return (
    <div className='space-y-4'>
      <Link to='/ws/$wsid/management/members' params={{ wsid }}>
        <Button variant='ghost' size='sm' className='gap-1'>
          <ArrowLeft className='h-4 w-4' />
          Back to Members
        </Button>
      </Link>
      <Card>
        <CardContent className='pt-6'>
          <div className='flex items-start gap-4'>
            <Avatar className='h-14 w-14'>
              <AvatarFallback className='text-lg'>{member.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className='flex-1 space-y-2'>
              <div className='flex items-center gap-3'>
                <h2 className='text-xl font-semibold'>{member.name}</h2>
                <Badge variant='outline' className={statusConfig.className}>
                  {statusConfig.label}
                </Badge>
              </div>
              <div className='flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground'>
                <span className='flex items-center gap-1.5'>
                  <Mail className='h-3.5 w-3.5' />
                  {member.email}
                </span>
                <span className='flex items-center gap-1.5'>
                  <Calendar className='h-3.5 w-3.5' />
                  Created {formatDate(member.createdAt)}
                </span>
                <span className='flex items-center gap-1.5'>
                  <Clock className='h-3.5 w-3.5' />
                  Last login {formatDateTime(member.lastLoginAt)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
