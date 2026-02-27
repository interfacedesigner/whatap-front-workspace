/**
 * ActionBookStep (Step 5)
 * @description LLM 연결 + Preset 선택 + 업종별 ActionBook 병합 + AutoAction 토글
 */
import {
  type ActionBookPreset,
  type LlmProvider,
  actionBookAtom,
  testLlmConnectionApi,
  workspaceSetupAtom,
} from '@/features/onboarding';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Switch } from '@/shared/components/ui/switch';
import { cn } from '@/shared/lib/utils';
import { useAtom, useAtomValue } from 'jotai';
import { BookOpen, CheckCircle2, Loader2, Shield, Sparkles, XCircle, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

import {
  ACTIONBOOK_PRESETS,
  INDUSTRY_ACTIONBOOKS,
  INDUSTRY_PRESETS,
  LLM_PROVIDERS,
  getMergedActionBooks,
} from '../model/onboarding-presets';
import { PresetRadioCard } from './PresetRadioCard';

const PRESET_ICONS = {
  'basic-ops': BookOpen,
  'incident-response': Shield,
  'full-automation': Sparkles,
} as const;

interface ActionBookStepProps {
  className?: string;
}

export function ActionBookStep({ className }: ActionBookStepProps) {
  const [data, setData] = useAtom(actionBookAtom);
  const workspaceSetup = useAtomValue(workspaceSetupAtom);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const industry = workspaceSetup.industry;
  const industryInfo = INDUSTRY_PRESETS.find((p) => p.value === industry);
  const industryActionBooks = INDUSTRY_ACTIONBOOKS[industry];

  // Preset 변경 시 업종별 병합 ActionBook 목록 적용
  const handlePresetChange = (value: string) => {
    const merged = getMergedActionBooks(value as ActionBookPreset, industry);
    setData((prev) => ({
      ...prev,
      preset: value as ActionBookPreset,
      actionBooks: merged,
    }));
  };

  // 초기 로드 시 preset + 업종에 해당하는 ActionBook 로드
  useEffect(() => {
    if (data.actionBooks.length === 0) {
      const merged = getMergedActionBooks(data.preset, industry);
      setData((prev) => ({
        ...prev,
        actionBooks: merged,
      }));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleProviderChange = (value: string) => {
    setData((prev) => ({ ...prev, llmProvider: value as LlmProvider }));
    setTestResult(null);
  };

  const handleApiKeyChange = (value: string) => {
    setData((prev) => ({ ...prev, llmApiKey: value }));
    setTestResult(null);
  };

  const handleTestConnection = async () => {
    if (!data.llmProvider || !data.llmApiKey) {
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const result = await testLlmConnectionApi({
        provider: data.llmProvider,
        apiKey: data.llmApiKey,
      });
      setTestResult(result);
    } catch {
      setTestResult({ success: false, message: 'Connection test failed.' });
    } finally {
      setIsTesting(false);
    }
  };

  const handleToggleAutoAction = (actionBookId: string) => {
    setData((prev) => ({
      ...prev,
      actionBooks: prev.actionBooks.map((ab) =>
        ab.id === actionBookId ? { ...ab, autoActionEnabled: !ab.autoActionEnabled } : ab,
      ),
    }));
  };

  const handleGlobalAutoActionToggle = (enabled: boolean) => {
    setData((prev) => ({ ...prev, autoActionEnabled: enabled }));
  };

  const selectedProvider = LLM_PROVIDERS.find((p) => p.value === data.llmProvider);

  // 업종 특화 ActionBook 개수
  const industryBookCount = data.actionBooks.filter(
    (ab) =>
      ab.id.includes('-ecom-') || ab.id.includes('-fint-') || ab.id.includes('-game-') || ab.id.includes('-saas-'),
  ).length;

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {/* Industry Badge */}
      {industry !== 'IND_GEN' && industryInfo && (
        <div className='flex items-center gap-2 px-3 py-2 rounded-md bg-[#296cf2]/[0.04] border border-[#296cf2]/20'>
          <span className='text-sm'>{industryInfo.icon}</span>
          <span className='text-xs text-[#296cf2] font-medium'>{industryInfo.title} industry ActionBooks included</span>
        </div>
      )}

      {/* LLM Provider Connection */}
      <div className='flex flex-col gap-4 p-4 rounded-lg border border-zinc-200 bg-zinc-50'>
        <div className='flex items-center gap-2'>
          <Sparkles className='w-4 h-4 text-[#296cf2]' />
          <Label className='text-sm font-medium'>LLM Provider (Optional)</Label>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          <div className='flex flex-col gap-1.5'>
            <Label className='text-xs text-zinc-500'>Provider</Label>
            <Select value={data.llmProvider ?? ''} onValueChange={handleProviderChange}>
              <SelectTrigger>
                <SelectValue placeholder='Select provider...' />
              </SelectTrigger>
              <SelectContent>
                {LLM_PROVIDERS.map((provider) => (
                  <SelectItem key={provider.value} value={provider.value}>
                    <div className='flex flex-col'>
                      <span>{provider.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedProvider && <p className='text-xs text-zinc-400'>{selectedProvider.description}</p>}
          </div>

          <div className='flex flex-col gap-1.5'>
            <Label className='text-xs text-zinc-500'>API Key</Label>
            <div className='flex gap-2'>
              <Input
                type='password'
                value={data.llmApiKey}
                onChange={(e) => handleApiKeyChange(e.target.value)}
                placeholder={selectedProvider?.placeholder ?? 'Enter API key...'}
                disabled={!data.llmProvider}
                className='flex-1'
              />
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={handleTestConnection}
                disabled={!data.llmProvider || !data.llmApiKey || isTesting}
                className='shrink-0'
              >
                {isTesting ? <Loader2 className='w-4 h-4 animate-spin' /> : 'Test'}
              </Button>
            </div>
            {testResult && (
              <div
                className={cn(
                  'flex items-center gap-1.5 text-xs',
                  testResult.success ? 'text-green-600' : 'text-red-500',
                )}
              >
                {testResult.success ? <CheckCircle2 className='w-3.5 h-3.5' /> : <XCircle className='w-3.5 h-3.5' />}
                {testResult.message}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ActionBook Preset */}
      <div className='flex flex-col gap-3'>
        <Label className='text-sm font-medium'>ActionBook Preset</Label>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
          {ACTIONBOOK_PRESETS.map((preset) => (
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

      {/* Global Auto-Action Toggle */}
      <div className='flex items-center justify-between p-4 rounded-lg border border-zinc-200 bg-zinc-50'>
        <div className='flex items-center gap-3'>
          <Zap className='w-5 h-5 text-amber-500' />
          <div>
            <p className='text-sm font-medium text-[#222]'>Auto-Action</p>
            <p className='text-xs text-zinc-500'>Allow ActionBooks to execute automatically on incidents</p>
          </div>
        </div>
        <Switch checked={data.autoActionEnabled} onCheckedChange={handleGlobalAutoActionToggle} />
      </div>

      {/* Industry AutoAction Rules */}
      {industry !== 'IND_GEN' && industryActionBooks.autoActionRules.length > 0 && (
        <div className='flex flex-col gap-2'>
          <Label className='text-xs text-zinc-500 font-medium'>Industry Auto-Action Rules</Label>
          <div className='flex flex-col gap-1'>
            {industryActionBooks.autoActionRules.map((rule) => (
              <div
                key={rule}
                className='flex items-center gap-2 px-3 py-1.5 rounded bg-[#296cf2]/[0.03] text-xs text-zinc-600'
              >
                <Zap className='w-3 h-3 text-amber-500 shrink-0' />
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ActionBook List */}
      <div className='flex flex-col gap-2'>
        <div className='flex items-center gap-2'>
          <Label className='text-sm font-medium'>ActionBooks ({data.actionBooks.length})</Label>
          {industryBookCount > 0 && (
            <Badge variant='outline' className='text-[10px] text-[#296cf2] border-[#296cf2]/30 bg-[#296cf2]/[0.04]'>
              +{industryBookCount} industry
            </Badge>
          )}
        </div>
        <div className='flex flex-col gap-2 max-h-[300px] overflow-y-auto'>
          {data.actionBooks.map((ab) => {
            const isIndustryBook =
              ab.id.includes('-ecom-') ||
              ab.id.includes('-fint-') ||
              ab.id.includes('-game-') ||
              ab.id.includes('-saas-');
            return (
              <div
                key={ab.id}
                className={cn(
                  'flex items-center justify-between p-3 rounded-md border bg-white',
                  isIndustryBook ? 'border-[#296cf2]/20' : 'border-zinc-100',
                )}
              >
                <div className='flex items-start gap-3 min-w-0 flex-1'>
                  <div
                    className={cn(
                      'flex items-center justify-center w-8 h-8 rounded-md shrink-0',
                      ab.severity === 'critical' ? 'bg-red-50' : 'bg-blue-50',
                    )}
                  >
                    <BookOpen
                      className={cn('w-4 h-4', ab.severity === 'critical' ? 'text-red-500' : 'text-blue-500')}
                    />
                  </div>
                  <div className='min-w-0'>
                    <div className='flex items-center gap-2'>
                      <p className='text-sm font-medium text-[#222] truncate'>{ab.name}</p>
                      <Badge
                        variant='outline'
                        className={cn(
                          'text-[10px]',
                          ab.severity === 'critical'
                            ? 'text-red-600 border-red-200 bg-red-50'
                            : 'text-blue-600 border-blue-200 bg-blue-50',
                        )}
                      >
                        {ab.severity}
                      </Badge>
                      {isIndustryBook && (
                        <Badge variant='outline' className='text-[9px] text-[#296cf2] border-[#296cf2]/30 px-1 py-0'>
                          industry
                        </Badge>
                      )}
                    </div>
                    <p className='text-xs text-zinc-500 line-clamp-1'>{ab.description}</p>
                    <Badge variant='outline' className='text-[10px] text-zinc-400 mt-1'>
                      {ab.category}
                    </Badge>
                  </div>
                </div>

                <div className='flex items-center gap-2 shrink-0 ml-3'>
                  <span className='text-[10px] text-zinc-400'>Auto</span>
                  <Switch
                    checked={ab.autoActionEnabled}
                    onCheckedChange={() => handleToggleAutoAction(ab.id)}
                    disabled={!data.autoActionEnabled}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
