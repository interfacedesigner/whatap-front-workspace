import { Card, CardContent } from '@/shared/components/ui/card';
import { createFileRoute } from '@tanstack/react-router';
import { FileText } from 'lucide-react';

export const Route = createFileRoute('/_authenticated/ws/$wsid/_workspace/management/audit-logs/')({
  component: AuditLogsPage,
});

function AuditLogsPage() {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-semibold tracking-tight'>Audit Logs</h1>
        <p className='mt-1 text-sm text-muted-foreground'>
          Track all authorization and access changes across workspaces
        </p>
      </div>
      <Card>
        <CardContent className='flex flex-col items-center justify-center py-16'>
          <FileText className='mb-4 h-12 w-12 text-muted-foreground/50' />
          <h3 className='text-lg font-medium'>Coming Soon</h3>
          <p className='mt-1 text-sm text-muted-foreground'>
            Audit log tracking will be available in the next release.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
