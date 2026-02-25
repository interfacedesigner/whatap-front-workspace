import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { useState } from 'react';

export interface LeadInfoData {
  companyName: string;
  industry: string;
  infrastructureSize: string;
  firstName: string;
  lastName: string;
  role: string;
  marketingConsent: boolean;
}

export interface LeadInfoFormProps {
  onContinue: (data: LeadInfoData) => void;
  onSkip: () => void;
  /** Pre-filled data for invited users */
  initialData?: Partial<LeadInfoData> | undefined;
}

const ROLES = ['SRE', 'DevOps', 'Backend', 'DBA', 'Platform', 'Engineering Manager', 'Security', 'Other'];

const INDUSTRIES = [
  'Software / SaaS',
  'IT Services',
  'Retail / E-commerce',
  'Pharma / Healthcare',
  'Transportation / Logistics',
  'Public Sector',
  'Finance / Banking',
  'Media / Entertainment',
  'Education',
  'Other',
];

const INFRA_SIZES = [
  { value: '1-50', label: '1\u201350 servers', desc: 'Small team or startup' },
  { value: '51-200', label: '51\u2013200 servers', desc: 'Growing organization' },
  { value: '201+', label: '201+ servers', desc: 'Enterprise scale' },
];

function validateCompanyName(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) {
    return 'Please enter your company name.';
  }
  if (trimmed.length < 2) {
    return 'Please enter your company name.';
  }
  if (trimmed.length > 120) {
    return 'Company name must be 120 characters or less.';
  }
  if (/\s{2,}/.test(trimmed)) {
    return 'Consecutive spaces are not allowed.';
  }
  return null;
}

export function LeadInfoForm({ onContinue, onSkip, initialData }: LeadInfoFormProps) {
  const [companyName, setCompanyName] = useState(initialData?.companyName ?? '');
  const [industry, setIndustry] = useState(initialData?.industry ?? '');
  const [infrastructureSize, setInfrastructureSize] = useState(initialData?.infrastructureSize ?? '');
  const [firstName, setFirstName] = useState(initialData?.firstName ?? '');
  const [lastName, setLastName] = useState(initialData?.lastName ?? '');
  const [role, setRole] = useState(initialData?.role ?? '');
  const [marketingConsent, setMarketingConsent] = useState(initialData?.marketingConsent ?? false);
  const [companyError, setCompanyError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const isValid = validateCompanyName(companyName) === null;

  const handleCompanyBlur = () => {
    setTouched(true);
    setCompanyError(validateCompanyName(companyName));
  };

  const handleContinue = () => {
    const err = validateCompanyName(companyName);
    setCompanyError(err);
    setTouched(true);
    if (!err) {
      onContinue({
        companyName: companyName.trim(),
        industry,
        infrastructureSize,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        role,
        marketingConsent,
      });
    }
  };

  return (
    <div className='w-full flex flex-col gap-6'>
      {/* Header */}
      <div className='flex flex-col gap-2'>
        <h1 className='text-2xl font-semibold text-[#222]'>Tell us about your organization</h1>
        <p className='text-sm text-[#757575]'>Help us personalize your experience and provide better support</p>
      </div>

      <div className='flex flex-col gap-4'>
        {/* Company name */}
        <div className='flex flex-col gap-1'>
          <Label htmlFor='company'>
            Company name <span className='text-red-500'>*</span>
          </Label>
          <Input
            id='company'
            placeholder='Company'
            value={companyName}
            onChange={(e) => {
              setCompanyName(e.target.value);
              if (touched) {
                setCompanyError(validateCompanyName(e.target.value));
              }
            }}
            onBlur={handleCompanyBlur}
            className={
              touched && companyError ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20' : ''
            }
          />
          {touched && companyError ? (
            <p className='text-xs text-red-500'>{companyError}</p>
          ) : (
            <p className='text-xs text-[#757575]'>Your organization or company name</p>
          )}
        </div>

        {/* Industry */}
        <div className='flex flex-col gap-1'>
          <Label>Industry</Label>
          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select an industry' />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map((ind) => (
                <SelectItem key={ind} value={ind}>
                  {ind}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Infrastructure size */}
        <div className='flex flex-col gap-1'>
          <Label>Infrastructure size</Label>
          <div className='flex flex-col gap-2'>
            {INFRA_SIZES.map((size) => (
              <label key={size.value} className='flex items-start gap-2.5 cursor-pointer'>
                <input
                  type='radio'
                  name='infrastructureSize'
                  value={size.value}
                  checked={infrastructureSize === size.value}
                  onChange={(e) => setInfrastructureSize(e.target.value)}
                  className='mt-0.5 accent-[#1E3A8A]'
                />
                <div>
                  <span className='text-sm text-[#222]'>{size.label}</span>
                  <span className='text-xs text-[#757575] ml-1'>({size.desc})</span>
                </div>
              </label>
            ))}
          </div>
          <p className='text-xs text-[#757575]'>Approximate number of servers you&apos;ll be monitoring</p>
        </div>

        {/* First name / Last name */}
        <div className='grid grid-cols-2 gap-3'>
          <div className='flex flex-col gap-1'>
            <Label htmlFor='firstName'>First name</Label>
            <Input id='firstName' placeholder='Alex' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div className='flex flex-col gap-1'>
            <Label htmlFor='lastName'>Last name</Label>
            <Input id='lastName' placeholder='Kim' value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
        </div>

        {/* Primary role */}
        <div className='flex flex-col gap-1'>
          <Label>Primary role</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select your role' />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className='text-xs text-[#757575]'>This helps us understand your needs better</p>
        </div>

        {/* Marketing consent */}
        <div className='flex items-start gap-2.5'>
          <Checkbox
            id='marketingConsent'
            checked={marketingConsent}
            onChange={(e) => setMarketingConsent(e.target.checked)}
            className='mt-0.5'
          />
          <label htmlFor='marketingConsent' className='text-sm text-[#222] leading-snug cursor-pointer'>
            I agree to receive product updates, technical guides, and marketing communications from (WorkSpace).
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className='flex flex-col gap-3'>
        <div className='flex gap-3'>
          <Button
            variant='outline'
            className='flex-1 border-[#E4E4E7] text-[#222] text-sm h-10 rounded-lg'
            onClick={onSkip}
          >
            Skip
          </Button>
          <Button
            disabled={!isValid}
            className='flex-1 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white text-sm h-10 rounded-lg disabled:opacity-50'
            onClick={handleContinue}
          >
            Continue
          </Button>
        </div>
        <p className='text-xs text-[#757575] text-center'>You can update this information later in Settings</p>
      </div>
    </div>
  );
}
