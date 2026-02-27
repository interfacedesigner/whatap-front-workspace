/**
 * MemberInviteStep (Step 3)
 * @description 이메일 태그 입력 + 역할 프리셋 + 초대 목록
 */
import { type MemberRolePreset, memberEmailSchema, memberInviteAtom } from '@/features/onboarding';
import { Badge } from '@/shared/components/ui/badge';
import { Label } from '@/shared/components/ui/label';
import { cn } from '@/shared/lib/utils';
import { useAtom } from 'jotai';
import { Mail, UserPlus, X } from 'lucide-react';
import { Code2, Eye, Shield } from 'lucide-react';

import { MEMBER_ROLE_PRESETS } from '../model/onboarding-presets';
import { PresetRadioCard } from './PresetRadioCard';
import { TagInput } from './TagInput';

const ROLE_ICONS = {
  viewer: Eye,
  developer: Code2,
  admin: Shield,
} as const;

interface MemberInviteStepProps {
  className?: string;
}

export function MemberInviteStep({ className }: MemberInviteStepProps) {
  const [data, setData] = useAtom(memberInviteAtom);

  const validateEmail = (value: string): string | null => {
    const result = memberEmailSchema.safeParse(value);
    return result.success ? null : (result.error.issues[0]?.message ?? 'Invalid email');
  };

  const handleEmailsChange = (emails: string[]) => {
    const newMembers = emails.map((email) => ({
      email,
      role: data.rolePreset,
    }));
    setData((prev) => ({ ...prev, invitedMembers: newMembers }));
  };

  const handleRolePresetChange = (value: string) => {
    const role = value as MemberRolePreset;
    setData((prev) => ({
      ...prev,
      rolePreset: role,
      invitedMembers: prev.invitedMembers.map((m) => ({ ...m, role })),
    }));
  };

  const handleRemoveMember = (email: string) => {
    setData((prev) => ({
      ...prev,
      invitedMembers: prev.invitedMembers.filter((m) => m.email !== email),
    }));
  };

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {/* Role Selection */}
      <div className='flex flex-col gap-3'>
        <Label className='text-sm font-medium'>Default Role for Invited Members</Label>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
          {MEMBER_ROLE_PRESETS.map((role) => (
            <PresetRadioCard
              key={role.value}
              value={role.value}
              selected={data.rolePreset === role.value}
              onSelect={handleRolePresetChange}
              title={role.title}
              description={role.description}
              icon={ROLE_ICONS[role.value as keyof typeof ROLE_ICONS]}
            />
          ))}
        </div>
      </div>

      {/* Email Input */}
      <div className='flex flex-col gap-2'>
        <Label className='text-sm font-medium'>
          <div className='flex items-center gap-2'>
            <Mail className='w-4 h-4' />
            Invite by Email
          </div>
        </Label>
        <TagInput
          tags={data.invitedMembers.map((m) => m.email)}
          onTagsChange={handleEmailsChange}
          placeholder='Enter email addresses...'
          validate={validateEmail}
          maxTags={20}
        />
      </div>

      {/* Invited Members List */}
      {data.invitedMembers.length > 0 && (
        <div className='flex flex-col gap-3'>
          <div className='flex items-center justify-between'>
            <Label className='text-sm font-medium'>
              <div className='flex items-center gap-2'>
                <UserPlus className='w-4 h-4' />
                Invited Members ({data.invitedMembers.length})
              </div>
            </Label>
          </div>

          <div className='flex flex-col gap-2 max-h-[240px] overflow-y-auto'>
            {data.invitedMembers.map((member) => (
              <div
                key={member.email}
                className='flex items-center justify-between p-3 rounded-md border border-zinc-100 bg-zinc-50'
              >
                <div className='flex items-center gap-3 min-w-0'>
                  <div className='flex items-center justify-center w-8 h-8 rounded-full bg-[#296cf2]/10 shrink-0'>
                    <Mail className='w-4 h-4 text-[#296cf2]' />
                  </div>
                  <div className='min-w-0'>
                    <p className='text-sm text-[#222] truncate'>{member.email}</p>
                  </div>
                </div>

                <div className='flex items-center gap-2 shrink-0'>
                  <Badge variant='outline' className='text-xs capitalize'>
                    {member.role}
                  </Badge>
                  <button
                    type='button'
                    onClick={() => handleRemoveMember(member.email)}
                    className='p-1 rounded hover:bg-zinc-200 transition-colors'
                  >
                    <X className='w-3.5 h-3.5 text-zinc-400' />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
