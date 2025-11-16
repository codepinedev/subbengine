import type { AxiosInstance, AxiosRequestConfig } from "axios"
import axios from "axios";


export interface ClientOptions {
  apiKey: string
  baseUrl?: string
}

export class Client {
  private client: AxiosInstance;

  constructor(options: ClientOptions) {
    if (!options.apiKey) throw new Error("An API Key is required.")

    this.client = axios.create({
      baseURL: options.baseUrl ?? 'http://localhost:9999/sdk-api/v1/',
      headers: {
        'x-api-key': options.apiKey
      }
    })

    this.client.interceptors.response.use((res) => res, (err) => {
      const message = err?.response.data?.message || err?.message || 'Unknown API Error';
      return Promise.reject(new Error(message));
    })
  }

  async request<T>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.client.request<T>(config);
    return response.data;
  }
}
