import { useCallback, useMemo, useSyncExternalStore } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

type Listener = () => void;

class AuthStore {
  private state: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
  };

  private listeners = new Set<Listener>();

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth() {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        this.state = {
          user: JSON.parse(storedUser),
          isAuthenticated: true,
          isLoading: false,
        };
      } catch {
        this.state = { user: null, isAuthenticated: false, isLoading: false };
      }
    } else {
      this.state = { user: null, isAuthenticated: false, isLoading: false };
    }
  }

  getSnapshot = () => this.state;

  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  private emit() {
    this.listeners.forEach((listener) => listener());
  }

  login(user: User) {
    this.state = { user, isAuthenticated: true, isLoading: false };
    localStorage.setItem('auth_user', JSON.stringify(user));
    this.emit();
  }

  logout() {
    this.state = { user: null, isAuthenticated: false, isLoading: false };
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    this.emit();
  }

  setLoading(isLoading: boolean) {
    this.state = { ...this.state, isLoading };
    this.emit();
  }
}

export const authStore = new AuthStore();

export function useAuth() {
  const state = useSyncExternalStore(authStore.subscribe, authStore.getSnapshot);

  const login = useCallback((user: User) => {
    authStore.login(user);
  }, []);

  const logout = useCallback(() => {
    authStore.logout();
  }, []);

  return useMemo(
    () => ({
      ...state,
      login,
      logout,
    }),
    [state, login, logout],
  );
}
