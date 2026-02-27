/**
 * OnboardingLayout
 * @description 온보딩 전용 풀스크린 레이아웃 (사이드바 없음, 상단 Logo 헤더만)
 */
import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';

interface OnboardingLayoutProps {
  children: ReactNode;
}

export function OnboardingLayout({ children }: OnboardingLayoutProps) {
  return (
    <div className='min-h-screen flex flex-col bg-[#FAFBFC]'>
      {/* Header */}
      <header className='flex items-center h-14 px-6 border-b border-zinc-100 bg-white shrink-0'>
        <Link to='/' className='flex items-center gap-2'>
          <div className='bg-[#1E3A8A] text-white flex items-center justify-center rounded-lg w-8 h-8 shrink-0'>
            <span className='font-bold text-sm'>O</span>
          </div>
          <span className='font-semibold text-sm text-[#222]'>OpsGent</span>
        </Link>
      </header>

      {/* Content */}
      <main className='flex-1 overflow-auto'>{children}</main>
    </div>
  );
}
