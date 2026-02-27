/**
 * OnboardingComplete
 * @description 온보딩 완료 화면: 체크 애니메이션 + 요약 카드 4개 + CTA
 */
import {
  actionBookAtom,
  agentInstallAtom,
  createdWorkspaceIdAtom,
  memberInviteAtom,
  monitoringRulesAtom,
  workspaceSetupAtom,
} from '@/features/onboarding';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';
import { useAtomValue } from 'jotai';
import { BookOpen, CheckCircle2, PartyPopper, Server, Shield, Users } from 'lucide-react';

interface OnboardingCompleteProps {
  onGoToDashboard: () => void;
  className?: string;
}

export function OnboardingComplete({ onGoToDashboard, className }: OnboardingCompleteProps) {
  const workspace = useAtomValue(workspaceSetupAtom);
  const agents = useAtomValue(agentInstallAtom);
  const members = useAtomValue(memberInviteAtom);
  const monitoring = useAtomValue(monitoringRulesAtom);
  const actionBook = useAtomValue(actionBookAtom);
  const workspaceId = useAtomValue(createdWorkspaceIdAtom);

  const summaryItems = [
    {
      icon: Server,
      color: '#059669',
      title: 'Agents',
      value: `${agents.connectedServers.length} servers connected`,
      detail:
        agents.connectedServers.length > 0
          ? agents.connectedServers.map((s) => s.hostname).join(', ')
          : 'No agents installed yet',
    },
    {
      icon: Users,
      color: '#7c3aed',
      title: 'Team Members',
      value: `${members.invitedMembers.length} invited`,
      detail:
        members.invitedMembers.length > 0
          ? members.invitedMembers
              .map((m) => m.email)
              .slice(0, 3)
              .join(', ') + (members.invitedMembers.length > 3 ? ` +${members.invitedMembers.length - 3} more` : '')
          : 'No members invited yet',
    },
    {
      icon: Shield,
      color: '#ea580c',
      title: 'Monitoring Rules',
      value: `${monitoring.eventRules.length} event · ${monitoring.incidentRules.length} incident`,
      detail: `${monitoring.preset} preset · ${monitoring.deliveryChannels.length} channels`,
    },
    {
      icon: BookOpen,
      color: '#0891b2',
      title: 'ActionBooks',
      value: `${actionBook.actionBooks.length} configured`,
      detail: actionBook.autoActionEnabled
        ? `Auto-action enabled · ${actionBook.llmProvider ?? 'No LLM'}`
        : 'Auto-action disabled',
    },
  ];

  return (
    <div className={cn('flex flex-col items-center gap-8 max-w-lg mx-auto py-8', className)}>
      {/* Success Icon */}
      <div className='flex flex-col items-center gap-4'>
        <div className='relative'>
          <div className='flex items-center justify-center w-20 h-20 rounded-full bg-green-100 animate-[scale-in_0.5s_ease-out]'>
            <CheckCircle2 className='w-10 h-10 text-green-600' />
          </div>
          <PartyPopper className='absolute -top-2 -right-2 w-6 h-6 text-amber-500' />
        </div>

        <div className='text-center'>
          <h2 className='text-2xl font-bold text-[#222]'>You&apos;re All Set!</h2>
          <p className='text-sm text-zinc-500 mt-1'>
            Your workspace <span className='font-semibold text-[#296cf2]'>{workspace.name || 'Workspace'}</span> is
            ready to go.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 w-full'>
        {summaryItems.map((item) => (
          <Card key={item.title} className='border-zinc-200'>
            <CardContent className='p-4'>
              <div className='flex items-start gap-3'>
                <div
                  className='flex items-center justify-center w-9 h-9 rounded-lg shrink-0'
                  style={{ backgroundColor: `${item.color}15` }}
                >
                  <item.icon className='w-4.5 h-4.5' style={{ color: item.color }} />
                </div>
                <div className='min-w-0'>
                  <p className='text-xs text-zinc-500'>{item.title}</p>
                  <p className='text-sm font-semibold text-[#222]'>{item.value}</p>
                  <p className='text-[11px] text-zinc-400 truncate mt-0.5'>{item.detail}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CTA */}
      <div className='flex flex-col items-center gap-3 w-full'>
        <Button
          type='button'
          onClick={onGoToDashboard}
          className='bg-[#296cf2] hover:bg-[#1e5ad9] text-white h-11 px-8 rounded-lg w-full sm:w-auto'
        >
          Go to Overview Dashboard
        </Button>
        <p className='text-xs text-zinc-400 text-center'>Workspace ID: {workspaceId ?? 'N/A'}</p>
      </div>
    </div>
  );
}
