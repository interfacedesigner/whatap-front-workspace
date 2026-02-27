/**
 * Onboarding Jotai Store
 * @description 온보딩 진행 상태 + 각 스텝 폼 데이터를 Jotai atomWithStorage로 관리
 * localStorage에 영구 저장하여 브라우저 새로고침/종료 후에도 진행 상태 유지
 */
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import {
  type ActionBookData,
  type AgentInstallData,
  DEFAULT_ACTIONBOOK,
  DEFAULT_AGENT_INSTALL,
  DEFAULT_MEMBER_INVITE,
  DEFAULT_MONITORING_RULES,
  DEFAULT_ONBOARDING_PROGRESS,
  DEFAULT_WORKSPACE_SETUP,
  type MemberInviteData,
  type MonitoringRulesData,
  type OnboardingProgress,
  type OnboardingStep,
  type WorkspaceSetupData,
} from './onboarding.types';

// =============================================================================
// Storage Keys
// =============================================================================

const STORAGE_PREFIX = 'opsgent_onboarding_';

// =============================================================================
// Progress Atom (atomWithStorage)
// =============================================================================

export const onboardingProgressAtom = atomWithStorage<OnboardingProgress>(
  `${STORAGE_PREFIX}progress`,
  DEFAULT_ONBOARDING_PROGRESS,
);

// =============================================================================
// Step Form Data Atoms (atomWithStorage)
// =============================================================================

export const workspaceSetupAtom = atomWithStorage<WorkspaceSetupData>(
  `${STORAGE_PREFIX}workspace_setup`,
  DEFAULT_WORKSPACE_SETUP,
);

export const agentInstallAtom = atomWithStorage<AgentInstallData>(
  `${STORAGE_PREFIX}agent_install`,
  DEFAULT_AGENT_INSTALL,
);

export const memberInviteAtom = atomWithStorage<MemberInviteData>(
  `${STORAGE_PREFIX}member_invite`,
  DEFAULT_MEMBER_INVITE,
);

export const monitoringRulesAtom = atomWithStorage<MonitoringRulesData>(
  `${STORAGE_PREFIX}monitoring_rules`,
  DEFAULT_MONITORING_RULES,
);

export const actionBookAtom = atomWithStorage<ActionBookData>(`${STORAGE_PREFIX}actionbook`, DEFAULT_ACTIONBOOK);

// =============================================================================
// Derived Atoms (읽기 전용)
// =============================================================================

/** 현재 스텝 번호 */
export const currentStepAtom = atom((get) => {
  return get(onboardingProgressAtom).currentStep;
});

/** 완료된 스텝 목록 */
export const completedStepsAtom = atom((get) => {
  return get(onboardingProgressAtom).completedSteps;
});

/** 스킵된 스텝 목록 */
export const skippedStepsAtom = atom((get) => {
  return get(onboardingProgressAtom).skippedSteps;
});

/** 온보딩 완료 여부 */
export const isOnboardingCompleteAtom = atom((get) => {
  return get(onboardingProgressAtom).isComplete;
});

/** 생성된 워크스페이스 ID */
export const createdWorkspaceIdAtom = atom((get) => {
  return get(onboardingProgressAtom).createdWorkspaceId;
});

/** 진행률 (퍼센트) */
export const progressPercentAtom = atom((get) => {
  const progress = get(onboardingProgressAtom);
  const doneCount = progress.completedSteps.length + progress.skippedSteps.length;
  return Math.round((doneCount / 5) * 100);
});

/** 현재 스텝이 건너뛸 수 있는지 */
export const isCurrentStepSkippableAtom = atom((get) => {
  const currentStep = get(currentStepAtom);
  // Step 1 (워크스페이스 생성)은 필수
  return currentStep !== 1;
});

/** 현재 스텝에서 다음으로 진행 가능한지 */
export const canProceedAtom = atom((get) => {
  const currentStep = get(currentStepAtom);

  if (currentStep === 1) {
    const setup = get(workspaceSetupAtom);
    return setup.name.trim().length >= 2;
  }

  // 나머지 스텝은 항상 진행 가능 (스킵 가능)
  return true;
});

/** 사이드바 위젯 닫기 상태 (세션 단위) */
export const widgetDismissedAtom = atom(false);

/** 온보딩 미완료 + 워크스페이스 있음 + 닫지 않음 → 사이드바 위젯 표시 조건 */
export const shouldShowOnboardingWidgetAtom = atom((get) => {
  const progress = get(onboardingProgressAtom);
  const dismissed = get(widgetDismissedAtom);
  return !progress.isComplete && progress.createdWorkspaceId !== null && !dismissed;
});

// =============================================================================
// Action Atoms (쓰기 전용)
// =============================================================================

/** 다음 스텝으로 이동 (현재 스텝 완료 처리) */
export const goToNextStepAtom = atom(null, (get, set) => {
  const progress = get(onboardingProgressAtom);
  const { currentStep, completedSteps } = progress;

  // 현재 스텝을 완료 목록에 추가
  const newCompleted = completedSteps.includes(currentStep) ? completedSteps : [...completedSteps, currentStep];

  if (currentStep < 5) {
    set(onboardingProgressAtom, {
      ...progress,
      currentStep: (currentStep + 1) as OnboardingStep,
      completedSteps: newCompleted,
    });
  } else {
    // 마지막 스텝 완료 → 온보딩 완료
    set(onboardingProgressAtom, {
      ...progress,
      completedSteps: newCompleted,
      isComplete: true,
    });
  }
});

/** 현재 스텝 건너뛰기 */
export const skipCurrentStepAtom = atom(null, (get, set) => {
  const progress = get(onboardingProgressAtom);
  const { currentStep, skippedSteps } = progress;

  if (currentStep === 1) {
    return;
  } // Step 1은 스킵 불가

  const newSkipped = skippedSteps.includes(currentStep) ? skippedSteps : [...skippedSteps, currentStep];

  if (currentStep < 5) {
    set(onboardingProgressAtom, {
      ...progress,
      currentStep: (currentStep + 1) as OnboardingStep,
      skippedSteps: newSkipped,
    });
  } else {
    set(onboardingProgressAtom, {
      ...progress,
      skippedSteps: newSkipped,
      isComplete: true,
    });
  }
});

/** 이전 스텝으로 이동 */
export const goToPreviousStepAtom = atom(null, (get, set) => {
  const progress = get(onboardingProgressAtom);
  const { currentStep } = progress;

  if (currentStep > 1) {
    set(onboardingProgressAtom, {
      ...progress,
      currentStep: (currentStep - 1) as OnboardingStep,
    });
  }
});

/** 특정 스텝으로 이동 (완료된 스텝이나 현재 스텝 이전으로만) */
export const goToStepAtom = atom(null, (get, set, targetStep: OnboardingStep) => {
  const progress = get(onboardingProgressAtom);
  const { completedSteps, skippedSteps } = progress;

  const isDone = completedSteps.includes(targetStep) || skippedSteps.includes(targetStep);
  const isCurrent = progress.currentStep === targetStep;

  if (isDone || isCurrent || targetStep < progress.currentStep) {
    set(onboardingProgressAtom, {
      ...progress,
      currentStep: targetStep,
    });
  }
});

/** 워크스페이스 ID 설정 (Step 1 완료 시) */
export const setCreatedWorkspaceIdAtom = atom(null, (get, set, workspaceId: string) => {
  const progress = get(onboardingProgressAtom);
  set(onboardingProgressAtom, {
    ...progress,
    createdWorkspaceId: workspaceId,
  });
});

/** 온보딩 완료 처리 */
export const completeOnboardingAtom = atom(null, (get, set) => {
  const progress = get(onboardingProgressAtom);
  set(onboardingProgressAtom, {
    ...progress,
    isComplete: true,
  });
});

/** 온보딩 전체 초기화 (디버그/리셋용) */
export const resetOnboardingAtom = atom(null, (_get, set) => {
  set(onboardingProgressAtom, DEFAULT_ONBOARDING_PROGRESS);
  set(workspaceSetupAtom, DEFAULT_WORKSPACE_SETUP);
  set(agentInstallAtom, DEFAULT_AGENT_INSTALL);
  set(memberInviteAtom, DEFAULT_MEMBER_INVITE);
  set(monitoringRulesAtom, DEFAULT_MONITORING_RULES);
  set(actionBookAtom, DEFAULT_ACTIONBOOK);
});
