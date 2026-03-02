import type { Member } from '@/entities/management';
import { MEMBER_STATUS_CONFIG, formatDate, formatDateTime } from '@/entities/management';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/components/ui/breadcrumb';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip';
import { Link } from '@tanstack/react-router';
import { Calendar, Check, Clock, Copy, Mail, Pencil, ShieldCheck, ShieldOff, Trash2, X } from 'lucide-react';
import { useCallback, useState } from 'react';

interface MemberDetailHeaderProps {
  member: Member;
  wsid: string;
  onNameUpdate?: (name: string) => void;
  onDeleteClick?: () => void;
  onDeactivateClick?: () => void;
}

export function MemberDetailHeader({
  member,
  wsid,
  onNameUpdate,
  onDeleteClick,
  onDeactivateClick,
}: MemberDetailHeaderProps) {
  const statusConfig = MEMBER_STATUS_CONFIG[member.status];
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(member.name);
  const [copied, setCopied] = useState(false);

  const handleCopyId = useCallback(() => {
    void navigator.clipboard.writeText(member.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [member.id]);

  const handleSaveName = useCallback(() => {
    const trimmed = editName.trim();
    if (trimmed && trimmed !== member.name && onNameUpdate) {
      onNameUpdate(trimmed);
    }
    setIsEditingName(false);
  }, [editName, member.name, onNameUpdate]);

  const handleCancelEdit = useCallback(() => {
    setEditName(member.name);
    setIsEditingName(false);
  }, [member.name]);

  return (
    <div className='space-y-4'>
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to='/ws/$wsid/management/members' params={{ wsid }}>
                Members
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{member.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardContent>
          <div className='flex items-start gap-4'>
            <Avatar className='h-14 w-14'>
              <AvatarFallback className='text-lg'>{member.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className='flex-1 space-y-2'>
              {/* Name + Status + Actions */}
              <div className='flex items-start justify-between'>
                <div className='space-y-1'>
                  <div className='flex items-center gap-3'>
                    {isEditingName ? (
                      <div className='flex items-center gap-2'>
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className='h-8 w-60'
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSaveName();
                            }
                            if (e.key === 'Escape') {
                              handleCancelEdit();
                            }
                          }}
                        />
                        <Button variant='ghost' size='icon' className='h-7 w-7' onClick={handleSaveName}>
                          <Check className='h-4 w-4 text-emerald-600' />
                        </Button>
                        <Button variant='ghost' size='icon' className='h-7 w-7' onClick={handleCancelEdit}>
                          <X className='h-4 w-4 text-muted-foreground' />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <h2 className='text-xl font-semibold'>{member.name}</h2>
                        {onNameUpdate && (
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-7 w-7'
                            onClick={() => {
                              setEditName(member.name);
                              setIsEditingName(true);
                            }}
                          >
                            <Pencil className='h-3.5 w-3.5 text-muted-foreground' />
                          </Button>
                        )}
                      </>
                    )}
                    <Badge variant='outline' className={statusConfig.className}>
                      {statusConfig.label}
                    </Badge>
                  </div>
                  {/* Member ID */}
                  <TooltipProvider>
                    <Tooltip {...(copied ? { open: true } : {})}>
                      <TooltipTrigger asChild>
                        <button
                          type='button'
                          onClick={handleCopyId}
                          className='flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors'
                        >
                          <span className='font-mono'>{member.id}</span>
                          <Copy className='h-3 w-3' />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{copied ? 'Copied!' : 'Copy ID'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {/* Action Buttons */}
                <div className='flex items-center gap-2'>
                  {onDeactivateClick && (
                    <Button variant='outline' size='sm' className='gap-1.5' onClick={onDeactivateClick}>
                      {member.status === 'active' ? (
                        <>
                          <ShieldOff className='h-3.5 w-3.5' />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <ShieldCheck className='h-3.5 w-3.5' />
                          Activate
                        </>
                      )}
                    </Button>
                  )}
                  {onDeleteClick && (
                    <Button
                      variant='outline'
                      size='sm'
                      className='gap-1.5 text-destructive hover:text-destructive'
                      onClick={onDeleteClick}
                    >
                      <Trash2 className='h-3.5 w-3.5' />
                      Delete
                    </Button>
                  )}
                </div>
              </div>

              {/* Meta Info */}
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
