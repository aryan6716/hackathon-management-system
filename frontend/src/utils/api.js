import axios from "axios";

const rawApiBase = `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api`;
export const API_BASE_URL = rawApiBase.replace(/\/$/, "");

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

const emitApiEvent = (name, detail = null) => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(name, { detail }));
  }
};

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  emitApiEvent("api_request_start");
  return config;
}, (error) => {
  emitApiEvent("api_request_end");
  return Promise.reject(error);
});

let isDisconnected = false;

apiClient.interceptors.response.use(
  (response) => {
    if (isDisconnected) {
      isDisconnected = false;
      emitApiEvent("api_reconnected");
    }
    emitApiEvent("api_request_end");
    return response.data; // Return inner data automatically
  },
  (error) => {
    emitApiEvent("api_request_end");
    
    // Check network errors
    if (!error.response && !isDisconnected) {
      isDisconnected = true;
      emitApiEvent("api_disconnected");
    }

    // 401 Unauthorized handling
    if (error.response?.status === 401) {
      emitApiEvent("auth_expired");
    }

    const message = error.response?.data?.message || error.message || "API request failed";
    const enhancedError = new Error(message);
    enhancedError.status = error.response?.status;
    enhancedError.code = error.response?.data?.code;
    
    // Optionally alert global toaster
    emitApiEvent("toast_error", message);

    return Promise.reject(enhancedError);
  }
);

// === Request Deduplication Cache ===
const pendingRequests = new Map();

const request = async (method, url, data = null, options = {}) => {
  // Create a unique key for deduplication (only GETs usually)
  const reqKey = method === 'GET' ? `${method}:${url}` : null;

  if (reqKey && pendingRequests.has(reqKey)) {
    return pendingRequests.get(reqKey);
  }

  const promise = apiClient({
    method,
    url,
    data,
    ...options
  }).finally(() => {
    if (reqKey) pendingRequests.delete(reqKey);
  });

  if (reqKey) {
    pendingRequests.set(reqKey, promise);
  }

  return promise;
};

// ======================
// VERBS
// ======================
export const apiGet = (url) => request("GET", url);
export const apiPost = (url, body) => request("POST", url, body);
export const apiPut = (url, body) => request("PUT", url, body);
export const apiDelete = (url) => request("DELETE", url);
