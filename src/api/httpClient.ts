import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  AxiosHeaders,
} from "axios";
import { API_CONFIG } from "./config";

// Extend the request config type to include additional properties
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _skipErrorMessage?: boolean;
}

/**
 * Setup axios interceptors for API calls
 */
const setupAxiosInterceptors = (instance: AxiosInstance) => {
  /**
   * Handles request success.
   * @param config - The request config
   * @returns The request config
   */
  const onRequestSuccess = async (
    config: ExtendedAxiosRequestConfig
  ): Promise<ExtendedAxiosRequestConfig> => {
    config.headers = config.headers ?? new AxiosHeaders();

    // Set base URL for all API calls
    if (!config.baseURL) {
      config.baseURL = API_CONFIG.baseURL;
    }

    // Set timeout
    if (!config.timeout) {
      config.timeout = API_CONFIG.timeout;
    }

    // Ensure cookies are sent to backend (if using cookie-based auth)
    config.withCredentials = true;

    // Set default headers
    if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  };

  /**
   * Handles response success.
   * @param response - The response
   * @returns The response
   */
  const onResponseSuccess = async (response: AxiosResponse) => {
    return Promise.resolve(response);
  };

  /**
   * Handles response error.
   * @param error - The error
   * @returns The error
   */
  const onResponseError = async (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized - Token may be expired");
    }

    const isNetworkError =
      error.code === "ECONNABORTED" ||
      error.code === "ERR_NETWORK" ||
      error.code === "ERR_CONNECTION_ABORTED" ||
      error.code === "ERR_CONNECTION_TIMED_OUT" ||
      error.code === "ERR_INTERNET_DISCONNECTED" ||
      (typeof error.message === "string" &&
        (error.message.toLowerCase().includes("network") ||
          error.message.includes("timeout")));

    if (isNetworkError) {
      console.error("Network error:", error.message);
    }

    return Promise.reject(error);
  };

  // Apply interceptors to the axios instance
  instance.interceptors.request.use(
    onRequestSuccess as (
      _config: InternalAxiosRequestConfig
    ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>
  );

  instance.interceptors.response.use(onResponseSuccess, onResponseError);
};

// Create axios instance
const httpClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Setup interceptors
setupAxiosInterceptors(httpClient);

export default httpClient;
