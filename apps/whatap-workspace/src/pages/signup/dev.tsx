import { TEST_SCENARIOS, type TestScenarioEntry, useSetSignupScenario } from '@/features/signup';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';

export const Route = createFileRoute('/signup/dev')({
  component: DevPage,
});

function ScenarioCard({ entry, onSelect }: { entry: TestScenarioEntry; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className='w-full text-left border border-[#adadad]/30 rounded-lg p-5 hover:border-[#296cf2]/50 hover:shadow-md transition-all group cursor-pointer bg-white'
    >
      <div className='flex items-center justify-between mb-3'>
        <div className='flex items-center gap-2'>
          <h3 className='text-base font-semibold text-[#222]'>{entry.label}</h3>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${entry.badgeColor}`}>{entry.badge}</span>
        </div>
        <ArrowRight className='w-4 h-4 text-[#adadad] group-hover:text-[#296cf2] transition-colors' />
      </div>

      <p className='text-sm text-[#757575] mb-4 leading-relaxed'>{entry.description}</p>

      {/* Flow steps */}
      <div className='flex flex-col gap-1'>
        {entry.flow.map((step, i) => (
          <div key={i} className='flex items-center gap-2 text-xs text-[#757575]'>
            <span className='w-4 h-4 rounded-full bg-[#f5f5f5] flex items-center justify-center text-[10px] font-medium text-[#222] shrink-0'>
              {i + 1}
            </span>
            <code className='font-mono text-[11px]'>{step}</code>
          </div>
        ))}
      </div>

      {/* Account info for invited scenarios */}
      {entry.scenario.type !== 'default' && (
        <div className='mt-4 pt-3 border-t border-[#adadad]/15 flex flex-col gap-1'>
          <span className='text-[10px] text-[#adadad] uppercase tracking-wider font-medium'>Test Account</span>
          <span className='text-xs text-[#222] font-mono'>{entry.scenario.email}</span>
          {entry.scenario.inviterName && (
            <span className='text-xs text-[#757575]'>Invited by: {entry.scenario.inviterName}</span>
          )}
          {entry.scenario.workspaces && (
            <span className='text-xs text-[#757575]'>
              Workspaces: {entry.scenario.workspaces.map((ws) => ws.name).join(', ')}
            </span>
          )}
        </div>
      )}
    </button>
  );
}

function DevPage() {
  const navigate = useNavigate();
  const setScenario = useSetSignupScenario();

  const handleSelect = (entry: TestScenarioEntry) => {
    setScenario(entry.scenario);

    if (entry.scenario.token) {
      navigate({ to: '/signup', search: { token: entry.scenario.token, email: entry.scenario.email } });
    } else {
      navigate({ to: '/signup', search: { token: undefined, email: undefined } });
    }
  };

  return (
    <div className='min-h-screen bg-[#fafbfc] px-4 py-12'>
      <div className='max-w-2xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-8'>
          <div className='inline-flex items-center gap-2 bg-amber-50 text-amber-700 text-xs font-medium px-3 py-1.5 rounded-full mb-4'>
            <span className='w-1.5 h-1.5 rounded-full bg-amber-500' />
            Development Only
          </div>
          <h1 className='text-2xl font-bold text-[#222]'>Signup Flow Test Hub</h1>
          <p className='text-sm text-[#757575] mt-2'>아래 시나리오를 선택하여 각 가입 플로우를 테스트할 수 있습니다.</p>
        </div>

        {/* Scenario Cards */}
        <div className='flex flex-col gap-4'>
          {TEST_SCENARIOS.map((entry) => (
            <ScenarioCard key={entry.scenario.type} entry={entry} onSelect={() => handleSelect(entry)} />
          ))}
        </div>

        {/* Footer note */}
        <p className='text-center text-xs text-[#adadad] mt-8'>
          이 페이지는 개발/테스트 전용입니다. 프로덕션 배포 시 제거하세요.
        </p>
      </div>
    </div>
  );
}
