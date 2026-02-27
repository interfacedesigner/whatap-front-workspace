/**
 * WorkspaceSetupStep (Step 1)
 * @description 워크스페이스 이름, 리전, 스케일 프리셋, 업종 선택
 */
import {
  type IndustryCode,
  type RegionOption,
  type WorkspacePreset,
  workspaceSetupAtom,
  workspaceSetupSchema,
} from '@/features/onboarding';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { cn } from '@/shared/lib/utils';
import { useAtom } from 'jotai';
import { Building2, Rocket, Settings } from 'lucide-react';
import { useState } from 'react';

import { INDUSTRY_PRESETS, REGIONS, WORKSPACE_PRESETS } from '../model/onboarding-presets';
import { PresetRadioCard } from './PresetRadioCard';

const PRESET_ICONS = {
  startup: Rocket,
  enterprise: Building2,
  custom: Settings,
} as const;

interface WorkspaceSetupStepProps {
  className?: string;
}

export function WorkspaceSetupStep({ className }: WorkspaceSetupStepProps) {
  const [data, setData] = useAtom(workspaceSetupAtom);
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameTouched, setNameTouched] = useState(false);

  const handleNameChange = (value: string) => {
    setData((prev) => ({ ...prev, name: value }));
    if (nameTouched) {
      const result = workspaceSetupSchema.shape.name.safeParse(value);
      setNameError(result.success ? null : (result.error.issues[0]?.message ?? null));
    }
  };

  const handleNameBlur = () => {
    setNameTouched(true);
    const result = workspaceSetupSchema.shape.name.safeParse(data.name);
    setNameError(result.success ? null : (result.error.issues[0]?.message ?? null));
  };

  const handleRegionChange = (value: string) => {
    setData((prev) => ({ ...prev, region: value as RegionOption }));
  };

  const handlePresetChange = (value: string) => {
    setData((prev) => ({ ...prev, preset: value as WorkspacePreset }));
  };

  const handleIndustryChange = (value: string) => {
    setData((prev) => ({ ...prev, industry: value as IndustryCode }));
  };

  // Custom 프리셋일 때는 업종 선택 비노출 (POL_ONB_016)
  const showIndustrySelection = data.preset !== 'custom';

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {/* Workspace Name */}
      <div className='flex flex-col gap-2'>
        <Label htmlFor='workspace-name' className='text-sm font-medium'>
          Workspace Name <span className='text-red-500'>*</span>
        </Label>
        <Input
          id='workspace-name'
          placeholder='e.g. Production Monitoring'
          value={data.name}
          onChange={(e) => handleNameChange(e.target.value)}
          onBlur={handleNameBlur}
          className={cn(
            nameTouched && nameError && 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20',
          )}
        />
        {nameTouched && nameError && <p className='text-xs text-red-500'>{nameError}</p>}
        <p className='text-xs text-zinc-400'>This will be the display name for your workspace.</p>
      </div>

      {/* Region */}
      <div className='flex flex-col gap-2'>
        <Label htmlFor='region' className='text-sm font-medium'>
          Region
        </Label>
        <Select value={data.region} onValueChange={handleRegionChange}>
          <SelectTrigger id='region'>
            <SelectValue placeholder='Select a region' />
          </SelectTrigger>
          <SelectContent>
            {REGIONS.map((region) => (
              <SelectItem key={region.value} value={region.value}>
                <span className='flex items-center gap-2'>
                  <span>{region.flag}</span>
                  <span>{region.label}</span>
                  <span className='text-zinc-400 text-xs'>— {region.location}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className='text-xs text-zinc-400'>Choose the region closest to your servers for optimal performance.</p>
      </div>

      {/* Scale Preset Selection */}
      <div className='flex flex-col gap-3'>
        <Label className='text-sm font-medium'>Workspace Preset</Label>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
          {WORKSPACE_PRESETS.map((preset) => (
            <PresetRadioCard
              key={preset.value}
              value={preset.value}
              selected={data.preset === preset.value}
              onSelect={handlePresetChange}
              title={preset.title}
              description={preset.description}
              icon={PRESET_ICONS[preset.value]}
              badge={preset.badge}
            />
          ))}
        </div>
      </div>

      {/* Industry Selection — Startup/Enterprise 선택 시만 표시 */}
      {showIndustrySelection && (
        <div className='flex flex-col gap-3'>
          <Label className='text-sm font-medium'>
            Industry{' '}
            <span className='text-xs text-zinc-400 font-normal ml-1'>— Optimizes monitoring rules & ActionBooks</span>
          </Label>
          <div className='grid grid-cols-2 md:grid-cols-5 gap-2'>
            {INDUSTRY_PRESETS.map((industry) => (
              <button
                key={industry.value}
                type='button'
                onClick={() => handleIndustryChange(industry.value)}
                className={cn(
                  'flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all text-center cursor-pointer',
                  data.industry === industry.value
                    ? 'border-[#296cf2] bg-[#296cf2]/[0.04] shadow-sm'
                    : 'border-zinc-200 hover:border-zinc-300 bg-white',
                )}
              >
                <span className='text-xl'>{industry.icon}</span>
                <span
                  className={cn(
                    'text-xs font-medium',
                    data.industry === industry.value ? 'text-[#296cf2]' : 'text-[#222]',
                  )}
                >
                  {industry.title}
                </span>
                <span className='text-[10px] text-zinc-400 line-clamp-2 leading-tight'>{industry.description}</span>
              </button>
            ))}
          </div>
          <p className='text-xs text-zinc-400'>
            Industry selection adds domain-specific monitoring rules and ActionBooks on top of common defaults.
          </p>
        </div>
      )}
    </div>
  );
}
