import { type ReactNode, createContext, useContext, useState } from 'react';

export interface WorkspaceInfo {
  id: string;
  name: string;
  role: string;
}

export interface LeadInfoData {
  companyName: string;
  industry: string;
  infrastructureSize: string;
}

export interface SignupScenario {
  type: 'default' | 'invited-single' | 'invited-multi';
  email: string;
  token?: string;
  inviterName?: string;
  workspaces?: WorkspaceInfo[];
  leadInfoPrefill?: Partial<LeadInfoData>;
}

const DEFAULT_SCENARIO: SignupScenario = {
  type: 'default',
  email: '',
};

interface SignupContextValue {
  scenario: SignupScenario;
  setScenario: (scenario: SignupScenario) => void;
}

const SignupContext = createContext<SignupContextValue | null>(null);

export function SignupProvider({ children }: { children: ReactNode }) {
  const [scenario, setScenario] = useState<SignupScenario>(DEFAULT_SCENARIO);

  return <SignupContext.Provider value={{ scenario, setScenario }}>{children}</SignupContext.Provider>;
}

export function useSignupScenario(): SignupScenario {
  const ctx = useContext(SignupContext);
  if (!ctx) {
    return DEFAULT_SCENARIO;
  }
  return ctx.scenario;
}

export function useSetSignupScenario(): (scenario: SignupScenario) => void {
  const ctx = useContext(SignupContext);
  if (!ctx) {
    return () => {
      /* noop outside provider */
    };
  }
  return ctx.setScenario;
}
