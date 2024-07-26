import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';
import { getCookie } from "cookies-next";


const getTokenFromCookies = (): string | undefined => {
  return getCookie("authToken") 
};

class APIManager {
  private static instance: APIManager;
  private axiosInstance: AxiosInstance;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, 
    });
  }

  public static getInstance(): APIManager {
    if (!APIManager.instance) {
      APIManager.instance = new APIManager();
    }
    return APIManager.instance;
  }

  public async request<T>(
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    params: any = {},
    data: any = null,
    headers: AxiosRequestConfig['headers'] = {},
    requiresAuth: boolean = false
  ): Promise<T> {
    if (requiresAuth) {
      const token = getTokenFromCookies();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        throw new Error('Authentication token not found');
      }
    }

    const config: AxiosRequestConfig = {
      method,
      url,
      params,
      data,
      headers,
    };

    try {
      const response = await this.axiosInstance.request<T>(config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async get<T>(url: string, params: any = {}, headers: AxiosRequestConfig['headers'] = {}, requiresAuth: boolean = false): Promise<T> {
    return this.request<T>('get', url, params, null, headers, requiresAuth);
  }

  public async post<T>(url: string, data: any, headers: AxiosRequestConfig['headers'] = {}, requiresAuth: boolean = false): Promise<T> {
    return this.request<T>('post', url, {}, data, headers, requiresAuth);
  }

  public async put<T>(url: string, data: any, headers: AxiosRequestConfig['headers'] = {}, requiresAuth: boolean = false): Promise<T> {
    return this.request<T>('put', url, {}, data, headers, requiresAuth);
  }

  public async delete<T>(url: string, params: any = {}, headers: AxiosRequestConfig['headers'] = {}, requiresAuth: boolean = false): Promise<T> {
    return this.request<T>('delete', url, params, null, headers, requiresAuth);
  }

  public async postMultipart<T>(url: string, formData: FormData, headers: AxiosRequestConfig['headers'] = {}, requiresAuth: boolean = false): Promise<T> {
    headers['Content-Type'] = 'multipart/form-data';
    return this.request<T>('post', url, {}, formData, headers, requiresAuth);
  }
}

export default APIManager.getInstance(); 
