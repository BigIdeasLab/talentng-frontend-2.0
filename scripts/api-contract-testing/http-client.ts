export interface IHttpClient {
  request<T>(method: string, path: string, token: string): Promise<T>;
}

export class HttpClient implements IHttpClient {
  constructor(
    private baseUrl: string,
    private timeout: number = 30000
  ) {}

  async request<T>(method: string, path: string, token: string): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle HTTP errors
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Parse JSON response
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      clearTimeout(timeoutId);

      // Handle timeout
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timeout after ${this.timeout}ms`);
      }

      // Handle network errors
      if (error instanceof TypeError) {
        throw new Error(`Network error: ${error.message}`);
      }

      // Re-throw other errors
      throw error;
    }
  }
}
