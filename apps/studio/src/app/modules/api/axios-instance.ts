import { createAxiosInstance } from '@repo/query/api';
import type { InternalAxiosRequestConfig } from 'axios';
import Axios from 'axios';

import { RoutePaths } from '../../routes/paths.const.js';
import { getStoredToken } from '../auth/auth.js';

export const axiosInstance = createAxiosInstance();

const authRequestInterceptor = (config: InternalAxiosRequestConfig) => {
  config.headers = config.headers ?? {};

  const token = getStoredToken();
  if (token != null && token !== '') {
    config.headers.authorization = `Bearer ${token}`;
  }

  return config;
};

const excludedErrorPaths: string[] = [RoutePaths.ERROR_FORBIDDEN];
const forbiddenInterceptor = (error: unknown) => {
  if (
    Axios.isAxiosError(error) &&
    error.response?.status === 401 &&
    !excludedErrorPaths.includes(window.location.pathname)
  ) {
    window.location.href = RoutePaths.ERROR_FORBIDDEN;
  }

  return Promise.reject(error);
};

axiosInstance.interceptors.request.use(authRequestInterceptor);
axiosInstance.interceptors.response.use((_) => _, forbiddenInterceptor);
