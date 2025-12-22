// Bexio API Client

const BEXIO_API_BASE = "https://api.bexio.com/2.0";

export class BexioClient {
  private token: string;

  constructor(token?: string) {
    this.token = token || process.env.BEXIO_API_TOKEN || "";
    if (!this.token) {
      throw new Error("BEXIO_API_TOKEN is not configured");
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${BEXIO_API_BASE}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }
      throw new BexioApiError(
        response.status,
        errorData.message || `Bexio API error: ${response.status}`,
        errorData
      );
    }

    // Handle empty responses
    const text = await response.text();
    if (!text) {
      return {} as T;
    }

    return JSON.parse(text);
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export class BexioApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = "BexioApiError";
    this.status = status;
    this.data = data;
  }
}

// Singleton instance
let clientInstance: BexioClient | null = null;

export function getBexioClient(): BexioClient {
  if (!clientInstance) {
    clientInstance = new BexioClient();
  }
  return clientInstance;
}
