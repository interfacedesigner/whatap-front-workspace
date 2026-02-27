/**
 * MonitoringRulesStep (Step 4)
 * @description Preset 선택 + 업종별 규칙 병합 + 규칙 미리보기 + 채널 설정
 */
import {
  type DeliveryChannelType,
  type MonitoringPreset,
  monitoringRulesAtom,
  workspaceSetupAtom,
} from '@/features/onboarding';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Switch } from '@/shared/components/ui/switch';
import { cn } from '@/shared/lib/utils';
import { useAtom, useAtomValue } from 'jotai';
import { AlertTriangle, Bell, Settings, Shield, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

import { INDUSTRY_PRESETS, MONITORING_PRESETS, getMergedMonitoringRules } from '../model/onboarding-presets';
import { PresetRadioCard } from './PresetRadioCard';

const PRESET_ICONS = {
  basic: Bell,
  advanced: Zap,
  custom: Settings,
} as const;

const SEVERITY_COLORS: Record<string, string> = {
  critical: 'bg-red-100 text-red-700 border-red-200',
  warning: 'bg-amber-100 text-amber-700 border-amber-200',
  info: 'bg-blue-100 text-blue-700 border-blue-200',
};

interface MonitoringRulesStepProps {
  className?: string;
}

export function MonitoringRulesStep({ className }: MonitoringRulesStepProps) {
  const [data, setData] = useAtom(monitoringRulesAtom);
  const workspaceSetup = useAtomValue(workspaceSetupAtom);
  const [channelType, setChannelType] = useState<DeliveryChannelType>('email');
  const [channelConfig, setChannelConfig] = useState('');

  const industry = workspaceSetup.industry;
  const industryInfo = INDUSTRY_PRESETS.find((p) => p.value === industry);

  // Preset 변경 시 업종별 병합 규칙 적용
  const handlePresetChange = (value: string) => {
    const merged = getMergedMonitoringRules(value as MonitoringPreset, industry);
    setData((prev) => ({
      ...prev,
      preset: value as MonitoringPreset,
      eventRules: merged.eventRules,
      incidentRules: merged.incidentRules,
      deliveryChannels: [
        ...prev.deliveryChannels,
        ...merged.deliveryChannels.filter((mc) => !prev.deliveryChannels.some((ec) => ec.id === mc.id)),
      ],
    }));
  };

  // 초기 로드 시 preset + 업종에 해당하는 규칙 로드
  useEffect(() => {
    if (data.eventRules.length === 0 && data.preset !== 'custom') {
      const merged = getMergedMonitoringRules(data.preset, industry);
      setData((prev) => ({
        ...prev,
        eventRules: merged.eventRules,
        incidentRules: merged.incidentRules,
      }));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddChannel = () => {
    if (!channelConfig.trim()) {
      return;
    }

    const newChannel = {
      id: `ch-${Date.now()}`,
      type: channelType,
      name: `${channelType} - ${channelConfig}`,
      config: { value: channelConfig },
      enabled: true,
    };

    setData((prev) => ({
      ...prev,
      deliveryChannels: [...prev.deliveryChannels, newChannel],
    }));
    setChannelConfig('');
  };

  const handleToggleChannel = (channelId: string) => {
    setData((prev) => ({
      ...prev,
      deliveryChannels: prev.deliveryChannels.map((ch) => (ch.id === channelId ? { ...ch, enabled: !ch.enabled } : ch)),
    }));
  };

  const handleRemoveChannel = (channelId: string) => {
    setData((prev) => ({
      ...prev,
      deliveryChannels: prev.deliveryChannels.filter((ch) => ch.id !== channelId),
    }));
  };

  // 업종 특화 규칙 개수 표시
  const industryEventCount = data.eventRules.filter(
    (r) => r.id.includes('-ecom-') || r.id.includes('-fint-') || r.id.includes('-game-') || r.id.includes('-saas-'),
  ).length;
  const industryIncidentCount = data.incidentRules.filter(
    (r) => r.id.includes('-ecom-') || r.id.includes('-fint-') || r.id.includes('-game-') || r.id.includes('-saas-'),
  ).length;

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {/* Industry Badge */}
      {industry !== 'IND_GEN' && industryInfo && (
        <div className='flex items-center gap-2 px-3 py-2 rounded-md bg-[#296cf2]/[0.04] border border-[#296cf2]/20'>
          <span className='text-sm'>{industryInfo.icon}</span>
          <span className='text-xs text-[#296cf2] font-medium'>{industryInfo.title} industry rules will be added</span>
        </div>
      )}

      {/* Preset Selection */}
      <div className='flex flex-col gap-3'>
        <Label className='text-sm font-medium'>Monitoring Preset</Label>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
          {MONITORING_PRESETS.map((preset) => (
            <PresetRadioCard
              key={preset.value}
              value={preset.value}
              selected={data.preset === preset.value}
              onSelect={handlePresetChange}
              title={preset.title}
              description={preset.description}
              icon={PRESET_ICONS[preset.value]}
            />
          ))}
        </div>
      </div>

      {/* Rules Preview */}
      {data.preset !== 'custom' && (
        <div className='flex flex-col gap-4'>
          {/* Event Rules */}
          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-2'>
              <AlertTriangle className='w-4 h-4 text-amber-500' />
              <Label className='text-sm font-medium'>Event Rules ({data.eventRules.length})</Label>
              {industryEventCount > 0 && (
                <Badge variant='outline' className='text-[10px] text-[#296cf2] border-[#296cf2]/30 bg-[#296cf2]/[0.04]'>
                  +{industryEventCount} industry
                </Badge>
              )}
            </div>
            <div className='rounded-lg border border-zinc-200 overflow-hidden'>
              <table className='w-full text-sm'>
                <thead className='bg-zinc-50'>
                  <tr>
                    <th className='text-left px-3 py-2 font-medium text-zinc-500'>Rule</th>
                    <th className='text-left px-3 py-2 font-medium text-zinc-500'>Condition</th>
                    <th className='text-left px-3 py-2 font-medium text-zinc-500'>Severity</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-zinc-100'>
                  {data.eventRules.map((rule) => {
                    const isIndustryRule =
                      rule.id.includes('-ecom-') ||
                      rule.id.includes('-fint-') ||
                      rule.id.includes('-game-') ||
                      rule.id.includes('-saas-');
                    return (
                      <tr key={rule.id} className={isIndustryRule ? 'bg-[#296cf2]/[0.02]' : ''}>
                        <td className='px-3 py-2 text-[#222]'>
                          <span className='flex items-center gap-1.5'>
                            {rule.name}
                            {isIndustryRule && (
                              <Badge
                                variant='outline'
                                className='text-[9px] text-[#296cf2] border-[#296cf2]/30 px-1 py-0'
                              >
                                industry
                              </Badge>
                            )}
                          </span>
                        </td>
                        <td className='px-3 py-2 text-zinc-500 font-mono text-xs'>
                          {rule.metric} {rule.condition} {rule.threshold}
                          {rule.metric.includes('rate') ? '%' : rule.metric.includes('latency') ? 'ms' : '%'}
                        </td>
                        <td className='px-3 py-2'>
                          <Badge variant='outline' className={cn('text-xs capitalize', SEVERITY_COLORS[rule.severity])}>
                            {rule.severity}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Incident Rules */}
          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-2'>
              <Shield className='w-4 h-4 text-red-500' />
              <Label className='text-sm font-medium'>Incident Rules ({data.incidentRules.length})</Label>
              {industryIncidentCount > 0 && (
                <Badge variant='outline' className='text-[10px] text-[#296cf2] border-[#296cf2]/30 bg-[#296cf2]/[0.04]'>
                  +{industryIncidentCount} industry
                </Badge>
              )}
            </div>
            <div className='rounded-lg border border-zinc-200 overflow-hidden'>
              <table className='w-full text-sm'>
                <thead className='bg-zinc-50'>
                  <tr>
                    <th className='text-left px-3 py-2 font-medium text-zinc-500'>Rule</th>
                    <th className='text-left px-3 py-2 font-medium text-zinc-500'>Trigger</th>
                    <th className='text-left px-3 py-2 font-medium text-zinc-500'>Auto-Escalation</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-zinc-100'>
                  {data.incidentRules.map((rule) => {
                    const isIndustryRule =
                      rule.id.includes('-ecom-') ||
                      rule.id.includes('-fint-') ||
                      rule.id.includes('-game-') ||
                      rule.id.includes('-saas-');
                    return (
                      <tr key={rule.id} className={isIndustryRule ? 'bg-[#296cf2]/[0.02]' : ''}>
                        <td className='px-3 py-2 text-[#222]'>
                          <span className='flex items-center gap-1.5'>
                            {rule.name}
                            {isIndustryRule && (
                              <Badge
                                variant='outline'
                                className='text-[9px] text-[#296cf2] border-[#296cf2]/30 px-1 py-0'
                              >
                                industry
                              </Badge>
                            )}
                          </span>
                        </td>
                        <td className='px-3 py-2 text-zinc-500 font-mono text-xs'>{rule.triggerCondition}</td>
                        <td className='px-3 py-2'>
                          <Badge
                            variant='outline'
                            className={cn(
                              'text-xs',
                              rule.autoEscalation ? 'text-green-600 border-green-200 bg-green-50' : 'text-zinc-500',
                            )}
                          >
                            {rule.autoEscalation ? 'Enabled' : 'Disabled'}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Custom Preset 안내 */}
      {data.preset === 'custom' && (
        <div className='flex items-center justify-center p-8 rounded-lg border border-dashed border-zinc-300 text-zinc-400 text-sm'>
          Custom rules can be configured after onboarding is complete.
        </div>
      )}

      {/* Delivery Channels */}
      <div className='flex flex-col gap-3'>
        <Label className='text-sm font-medium'>Delivery Channels (Optional)</Label>

        {/* Add Channel */}
        <div className='flex items-end gap-2'>
          <div className='flex-1'>
            <Select value={channelType} onValueChange={(v) => setChannelType(v as DeliveryChannelType)}>
              <SelectTrigger className='h-9'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='email'>Email</SelectItem>
                <SelectItem value='slack'>Slack Webhook</SelectItem>
                <SelectItem value='pagerduty'>PagerDuty</SelectItem>
                <SelectItem value='webhook'>Custom Webhook</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='flex-[2]'>
            <Input
              value={channelConfig}
              onChange={(e) => setChannelConfig(e.target.value)}
              placeholder={
                channelType === 'email'
                  ? 'team@company.com'
                  : channelType === 'slack'
                    ? 'https://hooks.slack.com/...'
                    : channelType === 'pagerduty'
                      ? 'Integration key'
                      : 'https://...'
              }
              className='h-9'
              onKeyDown={(e) => e.key === 'Enter' && handleAddChannel()}
            />
          </div>
          <button
            type='button'
            onClick={handleAddChannel}
            className='h-9 px-3 rounded-md bg-[#296cf2] text-white text-sm hover:bg-[#1e5ad9] transition-colors shrink-0'
          >
            Add
          </button>
        </div>

        {/* Channel List */}
        {data.deliveryChannels.length > 0 && (
          <div className='flex flex-col gap-2'>
            {data.deliveryChannels.map((channel) => (
              <div
                key={channel.id}
                className='flex items-center justify-between p-3 rounded-md border border-zinc-100 bg-zinc-50'
              >
                <div className='flex items-center gap-3 min-w-0'>
                  <Badge variant='outline' className='text-xs capitalize shrink-0'>
                    {channel.type}
                  </Badge>
                  <span className='text-sm text-zinc-600 truncate'>{channel.config.value}</span>
                </div>
                <div className='flex items-center gap-2 shrink-0'>
                  <Switch checked={channel.enabled} onCheckedChange={() => handleToggleChannel(channel.id)} />
                  <button
                    type='button'
                    onClick={() => handleRemoveChannel(channel.id)}
                    className='p-1 text-zinc-400 hover:text-red-500 transition-colors'
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
