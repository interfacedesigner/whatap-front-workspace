import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';
import { Separator } from '@/shared/components/ui/separator';
import { type Theme, useTheme } from '@/shared/lib/theme';
import { cn } from '@/shared/lib/utils';
import { createFileRoute } from '@tanstack/react-router';
import { Monitor, Moon, Sun } from 'lucide-react';
import type { ReactNode } from 'react';

export const Route = createFileRoute('/_authenticated/ws/$wsid/_workspace/settings')({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className='flex flex-col gap-6 max-w-2xl'>
      <div>
        <h1 className='text-2xl font-semibold tracking-tight'>Settings</h1>
        <p className='text-sm text-muted-foreground mt-1'>Manage your workspace preferences.</p>
      </div>

      <Separator />

      <AppearanceSection />
    </div>
  );
}

function AppearanceSection() {
  const { theme, setTheme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Customize the look and feel of the application.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <Label className='text-sm font-medium'>Theme</Label>
          <p className='text-xs text-muted-foreground -mt-2'>Select a theme for the workspace interface.</p>
          <div className='grid grid-cols-3 gap-3'>
            <ThemeCard
              icon={<Sun className='size-5' />}
              label='Light'
              value='light'
              isSelected={theme === 'light'}
              onSelect={() => setTheme('light')}
            />
            <ThemeCard
              icon={<Moon className='size-5' />}
              label='Dark'
              value='dark'
              isSelected={theme === 'dark'}
              onSelect={() => setTheme('dark')}
            />
            <ThemeCard
              icon={<Monitor className='size-5' />}
              label='System'
              value='system'
              isSelected={theme === 'system'}
              onSelect={() => setTheme('system')}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ThemeCard({
  icon,
  label,
  value: _value,
  isSelected,
  onSelect,
}: {
  icon: ReactNode;
  label: string;
  value: Theme;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type='button'
      onClick={onSelect}
      className={cn(
        'flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors cursor-pointer',
        'hover:bg-accent/50',
        isSelected ? 'border-primary bg-primary/5' : 'border-border bg-card',
      )}
    >
      <div className={cn('text-muted-foreground', isSelected && 'text-primary')}>{icon}</div>
      <span className={cn('text-sm font-medium', isSelected ? 'text-primary' : 'text-foreground')}>{label}</span>
    </button>
  );
}
