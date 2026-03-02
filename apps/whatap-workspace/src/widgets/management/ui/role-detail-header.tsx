import type { Role } from '@/entities/management';
import { ROLE_TYPE_CONFIG, formatDate } from '@/entities/management';
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
import { Calendar, Check, Copy, FileText, Pencil, Shield, Trash2, X } from 'lucide-react';
import { useCallback, useState } from 'react';

interface RoleDetailHeaderProps {
  role: Role;
  wsid: string;
  onNameUpdate?: (name: string) => void;
  onDescriptionUpdate?: (description: string) => void;
  onDeleteClick?: () => void;
}

export function RoleDetailHeader({
  role,
  wsid,
  onNameUpdate,
  onDescriptionUpdate,
  onDeleteClick,
}: RoleDetailHeaderProps) {
  const typeConfig = ROLE_TYPE_CONFIG[role.type];
  const isCustom = role.type === 'custom';

  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(role.name);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [editDesc, setEditDesc] = useState(role.description);
  const [copied, setCopied] = useState(false);

  const handleCopyId = useCallback(() => {
    void navigator.clipboard.writeText(role.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [role.id]);

  const handleSaveName = useCallback(() => {
    const trimmed = editName.trim();
    if (trimmed && trimmed !== role.name && onNameUpdate) {
      onNameUpdate(trimmed);
    }
    setIsEditingName(false);
  }, [editName, role.name, onNameUpdate]);

  const handleCancelNameEdit = useCallback(() => {
    setEditName(role.name);
    setIsEditingName(false);
  }, [role.name]);

  const handleSaveDesc = useCallback(() => {
    const trimmed = editDesc.trim();
    if (trimmed && trimmed !== role.description && onDescriptionUpdate) {
      onDescriptionUpdate(trimmed);
    }
    setIsEditingDesc(false);
  }, [editDesc, role.description, onDescriptionUpdate]);

  const handleCancelDescEdit = useCallback(() => {
    setEditDesc(role.description);
    setIsEditingDesc(false);
  }, [role.description]);

  return (
    <div className='space-y-4'>
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to='/ws/$wsid/management/roles' params={{ wsid }}>
                Roles
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{role.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardContent>
          <div className='space-y-2'>
            {/* Name + Badges + Actions */}
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
                            handleCancelNameEdit();
                          }
                        }}
                      />
                      <Button variant='ghost' size='icon' className='h-7 w-7' onClick={handleSaveName}>
                        <Check className='h-4 w-4 text-emerald-600' />
                      </Button>
                      <Button variant='ghost' size='icon' className='h-7 w-7' onClick={handleCancelNameEdit}>
                        <X className='h-4 w-4 text-muted-foreground' />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h2 className='text-xl font-semibold'>{role.name}</h2>
                      {isCustom && onNameUpdate && (
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-7 w-7'
                          onClick={() => {
                            setEditName(role.name);
                            setIsEditingName(true);
                          }}
                        >
                          <Pencil className='h-3.5 w-3.5 text-muted-foreground' />
                        </Button>
                      )}
                    </>
                  )}
                  <Badge variant='outline' className={typeConfig.className}>
                    {typeConfig.label}
                  </Badge>
                  <Badge variant={role.scope === 'cross-workspace' ? 'default' : 'secondary'}>
                    {role.scope === 'cross-workspace' ? 'Cross-Workspace' : 'Workspace'}
                  </Badge>
                </div>
                {/* Copy ID */}
                <TooltipProvider>
                  <Tooltip {...(copied ? { open: true } : {})}>
                    <TooltipTrigger asChild>
                      <button
                        type='button'
                        onClick={handleCopyId}
                        className='flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors'
                      >
                        <span className='font-mono'>{role.id}</span>
                        <Copy className='h-3 w-3' />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{copied ? 'Copied!' : 'Copy ID'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Action Buttons — Custom only */}
              {isCustom && (
                <div className='flex items-center gap-2'>
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
              )}
            </div>

            {/* Meta Info */}
            <div className='flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground'>
              <span className='flex items-center gap-1.5'>
                {isEditingDesc ? (
                  <div className='flex items-center gap-2'>
                    <Input
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      className='h-7 w-80 text-sm'
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveDesc();
                        }
                        if (e.key === 'Escape') {
                          handleCancelDescEdit();
                        }
                      }}
                    />
                    <Button variant='ghost' size='icon' className='h-6 w-6' onClick={handleSaveDesc}>
                      <Check className='h-3.5 w-3.5 text-emerald-600' />
                    </Button>
                    <Button variant='ghost' size='icon' className='h-6 w-6' onClick={handleCancelDescEdit}>
                      <X className='h-3.5 w-3.5 text-muted-foreground' />
                    </Button>
                  </div>
                ) : (
                  <>
                    <FileText className='h-3.5 w-3.5' />
                    {role.description}
                    {isCustom && onDescriptionUpdate && (
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-5 w-5 ml-1'
                        onClick={() => {
                          setEditDesc(role.description);
                          setIsEditingDesc(true);
                        }}
                      >
                        <Pencil className='h-3 w-3 text-muted-foreground' />
                      </Button>
                    )}
                  </>
                )}
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
