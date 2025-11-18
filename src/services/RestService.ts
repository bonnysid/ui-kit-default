import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
} from 'axios';

export type RequestOptions<D = unknown, P = Record<string, unknown>> = Omit<
  AxiosRequestConfig<D>,
  'params' | 'method' | 'url'
> & { params?: P };

export class RestService {
  public readonly httpClient: AxiosInstance;

  public constructor(config?: CreateAxiosDefaults) {
    this.httpClient = axios.create(config);
  }

  public setBaseURL(baseURL: string) {
    this.httpClient.defaults.baseURL = baseURL;
  }

  addDefaultHeader(key: string, value: string) {
    this.httpClient.defaults.headers.common[key] = value;
  }

  removeDefaultHeader(key: string) {
    delete this.httpClient.defaults.headers.common[key];
  }

  public async request<R, D = unknown>(config: AxiosRequestConfig<D>) {
    return this.httpClient.request<R, AxiosResponse<R>, D>(config);
  }

  public async GET<R, P = Record<string, unknown>>(
    url: string,
    options: RequestOptions<never, P> = {},
  ) {
    const { params, ...rest } = options;
    return this.request<R>({ url, method: 'GET', params, ...rest });
  }

  public async POST<R, D = unknown>(url: string, options: RequestOptions<D> = {}) {
    return this.request<R, D>({ url, method: 'POST', ...(options ?? {}) });
  }

  public async PUT<R, D = unknown>(url: string, options: RequestOptions<D> = {}) {
    return this.request<R, D>({ url, method: 'PUT', ...(options ?? {}) });
  }

  public async PATCH<R, D = unknown>(url: string, options: RequestOptions<D> = {}) {
    return this.request<R, D>({ url, method: 'PATCH', ...(options ?? {}) });
  }

  public async DELETE<R, P = Record<string, unknown>>(
    url: string,
    options: RequestOptions<never, P> = {},
  ) {
    const { params, ...rest } = options;
    return this.request<R>({ url, method: 'DELETE', params, ...rest });
  }
}
