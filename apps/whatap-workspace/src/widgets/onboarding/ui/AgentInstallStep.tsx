/**
 * AgentInstallStep (Step 2)
 * @description OS 탭 + 설치 명령어 + 연결 폴링 + 서버 목록
 */
import {
  type AgentPlatform,
  agentInstallAtom,
  createdWorkspaceIdAtom,
  getInstallScript,
  pollAgentStatusApi,
  resetAgentPollingApi,
  workspaceSetupAtom,
} from '@/features/onboarding';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { cn } from '@/shared/lib/utils';
import { useAtom, useAtomValue } from 'jotai';
import { CheckCircle2, Loader2, RefreshCw, Server } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { AGENT_PLATFORMS } from '../model/onboarding-presets';
import { CodeBlock } from './CodeBlock';

interface AgentInstallStepProps {
  className?: string;
}

export function AgentInstallStep({ className }: AgentInstallStepProps) {
  const [data, setData] = useAtom(agentInstallAtom);
  const workspaceSetup = useAtomValue(workspaceSetupAtom);
  const workspaceId = useAtomValue(createdWorkspaceIdAtom);
  const [isPolling, setIsPolling] = useState(false);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Generate install script
  const installScript = getInstallScript({
    accessKey: workspaceId ? `ak-${workspaceId}` : 'ak-pending',
    region: workspaceSetup.region,
    platform: data.platform,
  });

  // Polling for connected servers
  const startPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      return;
    }

    setIsPolling(true);
    resetAgentPollingApi();

    const poll = async () => {
      try {
        const result = await pollAgentStatusApi();
        setData((prev) => ({
          ...prev,
          connectedServers: result.servers,
        }));
      } catch {
        // Silent fail on polling
      }
    };

    // Initial poll
    poll();

    // Poll every 3 seconds
    pollIntervalRef.current = setInterval(poll, 3000);
  }, [setData]);

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    setIsPolling(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  const handlePlatformChange = (platform: string) => {
    setData((prev) => ({ ...prev, platform: platform as AgentPlatform }));
  };

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {/* Platform Selection Tabs */}
      <Tabs value={data.platform} onValueChange={handlePlatformChange}>
        <TabsList className='w-full'>
          {AGENT_PLATFORMS.map((platform) => (
            <TabsTrigger key={platform.value} value={platform.value} className='flex-1 text-xs'>
              <span className='mr-1'>{platform.icon}</span>
              {platform.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {AGENT_PLATFORMS.map((platform) => (
          <TabsContent key={platform.value} value={platform.value} className='mt-4'>
            <div className='flex flex-col gap-3'>
              <div className='flex items-center gap-2'>
                <Badge variant='outline' className='text-xs'>
                  {platform.os}
                </Badge>
                <Badge variant='outline' className='text-xs'>
                  {platform.arch}
                </Badge>
              </div>
              <p className='text-sm text-zinc-500'>
                Run the following command on your {platform.os} server to install the OpsGent agent:
              </p>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Install Script */}
      <CodeBlock code={installScript} language='bash' title='install.sh' />

      {/* Polling Section */}
      <div className='flex flex-col gap-4 p-4 rounded-lg border border-zinc-200 bg-zinc-50'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Server className='w-4 h-4 text-zinc-500' />
            <h4 className='text-sm font-medium text-[#222]'>Connected Servers</h4>
            {data.connectedServers.length > 0 && (
              <Badge className='bg-green-100 text-green-700 border-0 text-xs'>
                {data.connectedServers.length} connected
              </Badge>
            )}
          </div>

          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={isPolling ? stopPolling : startPolling}
            className='text-xs'
          >
            {isPolling ? (
              <>
                <Loader2 className='w-3 h-3 mr-1 animate-spin' />
                Stop Detection
              </>
            ) : (
              <>
                <RefreshCw className='w-3 h-3 mr-1' />
                Start Detection
              </>
            )}
          </Button>
        </div>

        {/* Server List */}
        {data.connectedServers.length === 0 ? (
          <div className='flex flex-col items-center gap-2 py-6 text-center'>
            <div className='w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center'>
              <Server className='w-5 h-5 text-zinc-400' />
            </div>
            <p className='text-sm text-zinc-500'>No servers connected yet.</p>
            <p className='text-xs text-zinc-400'>
              Run the installation script on your server, then click &quot;Start Detection&quot;.
            </p>
          </div>
        ) : (
          <div className='flex flex-col gap-2'>
            {data.connectedServers.map((server) => (
              <div key={server.id} className='flex items-center gap-3 p-3 rounded-md bg-white border border-zinc-100'>
                <CheckCircle2 className='w-4 h-4 text-green-500 shrink-0' />
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium text-[#222] truncate'>{server.hostname}</p>
                  <p className='text-xs text-zinc-400'>
                    {server.ip} · {server.os}
                  </p>
                </div>
                <Badge variant='outline' className='text-xs text-green-600 border-green-200 bg-green-50'>
                  {server.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
