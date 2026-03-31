import type { AuthConfig, AuthResponse } from './types.js';

export interface IAuthenticationModule {
  authenticate(): Promise<string>;
  getToken(): string | null;
}

export class AuthenticationModule implements IAuthenticationModule {
  private token: string | null = null;

  constructor(
    private config: AuthConfig,
    private apiBaseUrl: string
  ) {}

  async authenticate(): Promise<string> {
    // Token-based authentication
    if (this.config.type === 'token') {
      if (!this.config.token) {
        throw new Error('ACCESS_TOKEN environment variable is required for token authentication');
      }
      this.token = this.config.token;
      return this.token;
    }

    // Email/password authentication
    if (this.config.type === 'email_password') {
      if (!this.config.email || !this.config.password) {
        throw new Error('EMAIL and PASSWORD environment variables are required for email/password authentication');
      }

      try {
        const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: this.config.email,
            password: this.config.password,
          }),
        });

        if (!response.ok) {
          throw new Error(`Authentication failed: HTTP ${response.status} ${response.statusText}`);
        }

        const data: AuthResponse = await response.json();
        
        if (!data.token) {
          throw new Error('Authentication response does not contain a token');
        }

        this.token = data.token;
        return this.token;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Authentication failed: ${error.message}`);
        }
        throw new Error('Authentication failed with unknown error');
      }
    }

    throw new Error(`Unsupported authentication type: ${this.config.type}`);
  }

  getToken(): string | null {
    return this.token;
  }
}
