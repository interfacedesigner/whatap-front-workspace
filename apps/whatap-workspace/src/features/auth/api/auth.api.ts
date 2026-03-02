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
  // Development mock (when API is not available)
  if (import.meta.env.DEV) {
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (credentials.email && credentials.password) {
      // ① 기존 사용자: workspace 보유 → Overview로 이동
      if (credentials.email === 'existed-user@whatap.io') {
        return {
          user: {
            id: 'existed-user-001',
            email: 'existed-user@whatap.io',
            name: 'Existing User',
          },
          token: 'mock-existed-user-token',
          workspaceId: 'ws-default-001',
        };
      }

      // ② 온보딩 사용자: workspace 미생성 → 온보딩 플로우로 이동
      if (credentials.email === 'onboarding@whatap.io') {
        return {
          user: {
            id: 'onboarding-user-001',
            email: 'onboarding@whatap.io',
            name: 'Onboarding User',
          },
          token: 'mock-onboarding-token',
          // workspaceId 없음 → 온보딩 진행 필요
        };
      }

      // ③ 기타 이메일: 기존 사용자로 처리 (dev 편의)
      return {
        user: {
          id: 'dev-user-123',
          email: credentials.email,
          name: credentials.email.split('@')[0] ?? '',
        },
        token: 'mock-dev-token',
        workspaceId: 'ws-default-001',
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
