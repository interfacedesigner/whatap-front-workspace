import type { User } from '../model';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  workspaceId?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export async function loginApi(credentials: LoginCredentials): Promise<LoginResponse> {
  // Development mock for Google OAuth
  if (credentials.email === 'google-user@gmail.com' && credentials.password === 'google-oauth-mock') {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
    return {
      user: {
        id: 'google-user-123',
        email: 'google-user@gmail.com',
        name: 'Google User',
      },
      token: 'mock-google-oauth-token',
    };
  }

  // Development mock for regular login (when API is not available)
  if (import.meta.env.DEV) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Mock successful login for testing
    if (credentials.email && credentials.password) {
      // 기존 회원: workspace가 이미 존재하는 사용자
      if (credentials.email === 'existed-user@whatap.io') {
        return {
          user: {
            id: 'existed-user-001',
            email: 'existed-user@whatap.io',
            name: 'WhaTap User',
          },
          token: 'mock-existed-user-token',
          workspaceId: 'ws-default-001',
        };
      }
      // 온보딩 사용자: workspace 미생성 → 온보딩으로 라우팅
      const onboardingEmails = [
        'onboarding@whatap.io',
        'onboarding-01@whatap.io',
        'onboarding-02@whatap.io',
        'onboarding-03@whatap.io',
      ];
      if (onboardingEmails.includes(credentials.email)) {
        const idx = onboardingEmails.indexOf(credentials.email);
        return {
          user: {
            id: `onboarding-user-${String(idx + 1).padStart(3, '0')}`,
            email: credentials.email,
            name: `Onboarding User ${idx + 1}`,
          },
          token: `mock-onboarding-token-${idx + 1}`,
          // workspaceId 없음 → 온보딩 진행 필요
        };
      }
      return {
        user: {
          id: 'dev-user-123',
          email: credentials.email,
          name: credentials.email.split('@')[0] ?? '',
        },
        token: 'mock-dev-token',
      };
    }
  }

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Login failed' }));
    throw new Error(error.message || 'Login failed');
  }

  return response.json();
}

export async function logoutApi(): Promise<void> {
  const token = localStorage.getItem('auth_token');

  await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function refreshTokenApi(): Promise<{ token: string }> {
  const token = localStorage.getItem('auth_token');

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Token refresh failed');
  }

  return response.json();
}
