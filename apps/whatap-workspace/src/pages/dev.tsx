import { Link, createFileRoute } from '@tanstack/react-router';
import { ArrowRight, ExternalLink, KeyRound, LogIn, Shield, UserPlus } from 'lucide-react';

export const Route = createFileRoute('/dev')({
  component: DevHubPage,
});

interface FlowCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  status: 'ready' | 'partial' | 'planned';
  frames: string[];
}

function FlowCard({ title, description, icon, href, status, frames }: FlowCardProps) {
  const statusConfig = {
    ready: {
      label: 'Ready',
      color: 'bg-green-50 text-green-700',
      dot: 'bg-green-500',
    },
    partial: {
      label: 'Partial',
      color: 'bg-amber-50 text-amber-700',
      dot: 'bg-amber-500',
    },
    planned: {
      label: 'Planned',
      color: 'bg-gray-100 text-gray-500',
      dot: 'bg-gray-400',
    },
  };

  const config = statusConfig[status];
  const isClickable = status !== 'planned';

  const content = (
    <div
      className={`w-full text-left border border-[#adadad]/30 rounded-xl p-6 transition-all bg-white ${
        isClickable ? 'hover:border-[#296cf2]/50 hover:shadow-lg cursor-pointer group' : 'opacity-60 cursor-not-allowed'
      }`}
    >
      <div className='flex items-start justify-between mb-4'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-lg bg-[#296cf2]/10 flex items-center justify-center text-[#296cf2]'>
            {icon}
          </div>
          <div>
            <h3 className='text-lg font-semibold text-[#222]'>{title}</h3>
            <span
              className={`inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full ${config.color}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
              {config.label}
            </span>
          </div>
        </div>
        {isClickable && <ArrowRight className='w-5 h-5 text-[#adadad] group-hover:text-[#296cf2] transition-colors' />}
      </div>

      <p className='text-sm text-[#757575] mb-4 leading-relaxed'>{description}</p>

      {/* Figma Frames */}
      <div className='flex flex-wrap gap-1.5'>
        {frames.map((frame, i) => (
          <code key={i} className='text-[10px] font-mono bg-[#f5f5f5] text-[#555] px-2 py-1 rounded'>
            {frame}
          </code>
        ))}
      </div>
    </div>
  );

  if (isClickable) {
    return <Link to={href as '/readme' | '/login' | '/reset-password'}>{content}</Link>;
  }

  return content;
}

function DevHubPage() {
  const flows: FlowCardProps[] = [
    {
      title: 'Sign up',
      description: '신규 가입 플로우. 일반 가입, 초대 가입(단일/다중 워크스페이스) 시나리오 테스트',
      icon: <UserPlus className='w-5 h-5' />,
      href: '/readme',
      status: 'ready',
      frames: ['/signup-default', '/signup-invited', '/signup/lead-Info-*', '/signup/verify-*', '/signup-success/*'],
    },
    {
      title: 'Sign in',
      description: '로그인 플로우. 이메일/비밀번호 또는 Google OAuth로 로그인',
      icon: <LogIn className='w-5 h-5' />,
      href: '/login',
      status: 'ready',
      frames: ['/signin-default', '/signin/invalid', '/signin/locked'],
    },
    {
      title: 'Password Reset',
      description: '비밀번호 재설정 플로우. 이메일 발송, 코드 검증, 새 비밀번호 설정',
      icon: <KeyRound className='w-5 h-5' />,
      href: '/reset-password',
      status: 'ready',
      frames: ['/reset-password', '/reset-password/verify', '/reset-password/new-password', '/reset-password/success'],
    },
    {
      title: 'MFA Setup',
      description: '다중 인증 설정 플로우. Authenticator App, SMS, Email 방식 선택 및 설정',
      icon: <Shield className='w-5 h-5' />,
      href: '/mfa-setup',
      status: 'planned',
      frames: ['/mfa-setup/select', '/mfa-setup/authenticator/*', '/mfa-setup/sms/*', '/mfa-setup/email/*'],
    },
  ];

  return (
    <div className='min-h-screen bg-[#fafbfc] px-4 py-12'>
      <div className='max-w-3xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-10'>
          <div className='inline-flex items-center gap-2 bg-amber-50 text-amber-700 text-xs font-medium px-3 py-1.5 rounded-full mb-4'>
            <span className='w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse' />
            Development Only
          </div>
          <h1 className='text-3xl font-bold text-[#222] mb-2'>WhaTap Auth Flow Hub</h1>
          <p className='text-sm text-[#757575]'>인증 관련 모든 플로우를 테스트할 수 있는 개발자 허브입니다.</p>
        </div>

        {/* Quick Links */}
        <div className='flex items-center justify-center gap-4 mb-8'>
          <a
            href='http://localhost:5173'
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-1.5 text-xs text-[#296cf2] hover:underline'
          >
            <ExternalLink className='w-3 h-3' />
            localhost:5173
          </a>
          <span className='text-[#adadad]'>•</span>
          <Link
            to='/signup'
            search={{ token: undefined, email: undefined }}
            className='inline-flex items-center gap-1.5 text-xs text-[#296cf2] hover:underline'
          >
            Direct: /signup
          </Link>
          <span className='text-[#adadad]'>•</span>
          <Link to='/login' className='inline-flex items-center gap-1.5 text-xs text-[#296cf2] hover:underline'>
            Direct: /login
          </Link>
        </div>

        {/* Flow Cards */}
        <div className='grid gap-4'>
          {flows.map((flow) => (
            <FlowCard key={flow.title} {...flow} />
          ))}
        </div>

        {/* Figma Link */}
        <div className='mt-10 p-4 bg-white border border-[#adadad]/20 rounded-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <h4 className='text-sm font-medium text-[#222]'>Figma Design Reference</h4>
              <p className='text-xs text-[#757575] mt-0.5'>node-id=102-6350 (Signup Section)</p>
            </div>
            <a
              href='https://www.figma.com/design/y5bosVJQewFatHUicHl4Bn/-WorkSpace--UX-UI-Design-Assets?node-id=102-6350'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-1.5 text-xs text-[#296cf2] hover:underline bg-[#296cf2]/5 px-3 py-1.5 rounded-lg'
            >
              <ExternalLink className='w-3 h-3' />
              Open in Figma
            </a>
          </div>
        </div>

        {/* Figma Frame Mapping Table */}
        <div className='mt-6 p-4 bg-white border border-[#adadad]/20 rounded-lg'>
          <h4 className='text-sm font-medium text-[#222] mb-3'>Figma 프레임 매핑</h4>
          <div className='overflow-x-auto'>
            <table className='w-full text-xs'>
              <thead>
                <tr className='border-b border-[#adadad]/20'>
                  <th className='text-left py-2 px-2 text-[#757575] font-medium'>Figma 프레임</th>
                  <th className='text-left py-2 px-2 text-[#757575] font-medium'>코드 라우트</th>
                  <th className='text-left py-2 px-2 text-[#757575] font-medium'>상태</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-[#adadad]/10'>
                <tr>
                  <td className='py-2 px-2 font-mono text-[#555]'>/signup-default</td>
                  <td className='py-2 px-2 font-mono text-[#296cf2]'>/signup</td>
                  <td className='py-2 px-2'>
                    <span className='text-green-600'>✓</span>
                  </td>
                </tr>
                <tr>
                  <td className='py-2 px-2 font-mono text-[#555]'>/signup-invited</td>
                  <td className='py-2 px-2 font-mono text-[#296cf2]'>/signup?token=xxx</td>
                  <td className='py-2 px-2'>
                    <span className='text-green-600'>✓</span>
                  </td>
                </tr>
                <tr>
                  <td className='py-2 px-2 font-mono text-[#555]'>/signup/lead-Info-default</td>
                  <td className='py-2 px-2 font-mono text-[#296cf2]'>/signup/lead-info</td>
                  <td className='py-2 px-2'>
                    <span className='text-green-600'>✓</span>
                  </td>
                </tr>
                <tr>
                  <td className='py-2 px-2 font-mono text-[#555]'>/signup/verify-*</td>
                  <td className='py-2 px-2 font-mono text-[#296cf2]'>/signup/verify</td>
                  <td className='py-2 px-2'>
                    <span className='text-green-600'>✓</span>
                  </td>
                </tr>
                <tr>
                  <td className='py-2 px-2 font-mono text-[#555]'>/signup-success/*</td>
                  <td className='py-2 px-2 font-mono text-[#296cf2]'>/signup/success</td>
                  <td className='py-2 px-2'>
                    <span className='text-green-600'>✓</span>
                  </td>
                </tr>
                <tr>
                  <td className='py-2 px-2 font-mono text-[#555]'>/signin-default</td>
                  <td className='py-2 px-2 font-mono text-[#296cf2]'>/login</td>
                  <td className='py-2 px-2'>
                    <span className='text-green-600'>✓</span>
                  </td>
                </tr>
                <tr>
                  <td className='py-2 px-2 font-mono text-[#555]'>/reset-password/*</td>
                  <td className='py-2 px-2 font-mono text-[#296cf2]'>/reset-password/*</td>
                  <td className='py-2 px-2'>
                    <span className='text-green-600'>✓</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Status Legend */}
        <div className='mt-6 flex items-center justify-center gap-6 text-xs text-[#757575]'>
          <div className='flex items-center gap-1.5'>
            <span className='w-2 h-2 rounded-full bg-green-500' />
            Ready: 테스트 가능
          </div>
          <div className='flex items-center gap-1.5'>
            <span className='w-2 h-2 rounded-full bg-amber-500' />
            Partial: 일부 구현
          </div>
          <div className='flex items-center gap-1.5'>
            <span className='w-2 h-2 rounded-full bg-gray-400' />
            Planned: 미구현
          </div>
        </div>

        {/* Footer */}
        <p className='text-center text-xs text-[#adadad] mt-8'>
          이 페이지는 개발/테스트 전용입니다. 프로덕션 배포 시 제거하세요.
        </p>
      </div>
    </div>
  );
}
