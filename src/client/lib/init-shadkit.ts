/* eslint-disable no-restricted-globals */
import axios from 'axios';
import { getAppConfig } from './api';
import { DefaultPreferences } from '@/types/app';
import { queryOptions } from '@tanstack/react-query';
import { getAxiosInstance, setAxiosInstance } from 'sn-shadcn-kit';
import { DefaultESLintOptions, DefaultPrettierOptions } from '@/types/defaults';

declare global {
  interface Window {
    g_ck?: string;
  }
}

function isDevelopment() {
  const username = import.meta.env.VITE_REACT_APP_USER;
  const tokenSpoof = import.meta.env.VITE_SPOOF_TOKEN;
  const axiosInstance = axios.create({ withCredentials: true });

  if (tokenSpoof) {
    axiosInstance.defaults.headers['X-UserToken'] = tokenSpoof;
  } else {
    axiosInstance.defaults.auth = {
      username,
      password: import.meta.env.VITE_REACT_APP_PASSWORD,
    };
  }

  setAxiosInstance(axiosInstance);

  return axiosInstance;
}

async function isProduction() {
  const axiosInstance = getAxiosInstance();
  return axiosInstance;
}

export async function bootstrapApp(signal?: AbortSignal) {
  const mode = import.meta.env.MODE;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _axios = mode === 'development' ? isDevelopment() : await isProduction();

  const config = await getAppConfig(signal);
  console.log("App Config:", config);

  //Core rules always enforced
  if (config.esLintConfig?.rules) {
    config.esLintConfig.rules['no-const-assign'] = 'error';
  }

  return {...config};
}

export const configQuery = queryOptions({
  queryKey: ['appConfig'],
  // staleTime: Infinity,
  // gcTime: Infinity,
  retry: 0,
  // refetchOnWindowFocus: true,
  queryFn: async ({ signal }) => {
    const config = await bootstrapApp(signal);
    return {
      ...config,
      preferences: config.preferences ?? DefaultPreferences,
      esLintConfig: config.esLintConfig ?? DefaultESLintOptions,
      prettierConfig: config.prettierConfig ?? DefaultPrettierOptions,
    };
  },
});