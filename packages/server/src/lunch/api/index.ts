import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export default class OpenAPI {
  private readonly _client: AxiosInstance;
  private readonly _apiKey: string;

  constructor(apiKey: string) {
    this._apiKey = apiKey;
    this._client = axios.create({
      baseURL: 'https://open.neis.go.kr/hub/',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  public get(
    path: string,
    params: {
      KEY?: string;
      Type?: 'xml' | 'json';
      pIndex?: number;
      pSize?: number;
      [key: string]: string | number | undefined;
    } = {},
    options?: AxiosRequestConfig<any>,
  ) {
    params.KEY = this._apiKey;
    params.Type = params.Type || 'json';
    return this._client.get(path, { params, ...options });
  }
}

export type APIWrapper<T> = {
  totalCount: number;
  row: T[];
};
