import { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type ResetPasswordStep = 'email' | 'verify' | 'new-password' | 'success';

interface ResetPasswordState {
  step: ResetPasswordStep;
  email: string;
  maskedEmail: string;
}

interface ResetPasswordContextValue extends ResetPasswordState {
  setEmail: (email: string) => void;
  setStep: (step: ResetPasswordStep) => void;
  reset: () => void;
}

const ResetPasswordContext = createContext<ResetPasswordContextValue | null>(null);

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) {
    return email;
  }
  if (local.length <= 2) {
    return `${local}***@${domain}`;
  }
  return `${local.slice(0, 2)}***@${domain}`;
}

const initialState: ResetPasswordState = {
  step: 'email',
  email: '',
  maskedEmail: '',
};

export function ResetPasswordProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ResetPasswordState>(initialState);

  const setEmail = useCallback((email: string) => {
    setState((prev) => ({
      ...prev,
      email,
      maskedEmail: maskEmail(email),
    }));
  }, []);

  const setStep = useCallback((step: ResetPasswordStep) => {
    setState((prev) => ({ ...prev, step }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      setEmail,
      setStep,
      reset,
    }),
    [state, setEmail, setStep, reset],
  );

  return <ResetPasswordContext.Provider value={value}>{children}</ResetPasswordContext.Provider>;
}

export function useResetPasswordContext() {
  const context = useContext(ResetPasswordContext);
  if (!context) {
    throw new Error('useResetPasswordContext must be used within ResetPasswordProvider');
  }
  return context;
}
