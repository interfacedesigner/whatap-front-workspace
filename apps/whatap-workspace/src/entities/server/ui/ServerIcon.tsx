/**
 * ServerIcon Component
 * @description 32x32px 크기의 서버 상태 아이콘
 */
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip';
import { cn } from '@/shared/lib/utils';

import type { IconLabelOption, Server } from '../model/server.types';
import { STATUS_COLORS } from '../model/server.types';

export interface ServerIconProps {
  /** 서버 데이터 */
  server: Server;
  /** 아이콘 라벨 옵션 */
  labelOption?: IconLabelOption;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 서버 상태를 나타내는 32x32px 아이콘
 * - 상태에 따라 색상 표시 (ok: 초록, warning: 노랑, critical: 빨강, inactive: 회색)
 * - 호버 시 툴팁으로 상세 정보 표시
 */
export function ServerIcon({ server, labelOption = 'hostname', className }: ServerIconProps) {
  const statusColor = STATUS_COLORS[server.status];

  const getLabelText = (): string | null => {
    switch (labelOption) {
      case 'hostname':
        return server.hostname;
      case 'ip':
        return server.ip;
      case 'status':
        return server.status;
      default:
        return null;
    }
  };

  const labelText = getLabelText();

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <div className={cn('flex flex-col items-center gap-1 cursor-pointer', className)}>
            {/* 32x32 아이콘 */}
            <div
              className={cn(
                'w-8 h-8 rounded-sm flex items-center justify-center',
                'transition-transform hover:scale-110',
                statusColor,
              )}
              role='img'
              aria-label={`${server.hostname} - ${server.status}`}
            >
              <ServerSvgIcon className='w-5 h-5 text-white' />
            </div>

            {/* 라벨 */}
            {labelText && (
              <span className='text-xs text-muted-foreground truncate max-w-[64px] text-center' title={labelText}>
                {labelText}
              </span>
            )}
          </div>
        </TooltipTrigger>

        <TooltipContent side='top' className='max-w-xs'>
          <div className='space-y-1 text-sm'>
            <div className='font-medium'>{server.hostname}</div>
            <div className='text-muted-foreground'>
              <span className='font-mono'>{server.ip}</span>
            </div>
            <div className='flex items-center gap-2'>
              <span className={cn('inline-block w-2 h-2 rounded-full', statusColor)} />
              <span className='capitalize'>{server.status}</span>
            </div>
            <div className='text-muted-foreground'>
              {server.osType} | {server.serverType} | {server.cores} cores
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/** 서버 SVG 아이콘 */
function ServerSvgIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}
    >
      <rect width='20' height='8' x='2' y='2' rx='2' ry='2' />
      <rect width='20' height='8' x='2' y='14' rx='2' ry='2' />
      <line x1='6' x2='6.01' y1='6' y2='6' />
      <line x1='6' x2='6.01' y1='18' y2='18' />
    </svg>
  );
}
