import type { User } from '../model';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
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
