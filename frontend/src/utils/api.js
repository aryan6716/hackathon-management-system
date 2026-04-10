import axios from "axios";

// Prefer VITE_API_BASE_URL. Keep VITE_API_URL as a backward-compatible fallback.
const rawApiBase =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "http://localhost:8000/api"
    : "https://hackathonhub.up.railway.app/api");

export const API_BASE_URL = rawApiBase.replace(/\/$/, "");

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

if (typeof window !== "undefined") {
  console.log("[API] Base URL:", API_BASE_URL);
}

// ======================
// Helper: Get token
// ======================
const getToken = () => localStorage.getItem("token");

export const apiUrl = (path) =>
  `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

const emitApiEvent = (name) => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(name));
  }
};

let isDisconnected = false;

const parseError = async (res, fallbackMessage) => {
  const contentType = res.headers.get("content-type") || "";
  let payload = {};

  if (contentType.includes("application/json")) {
    payload = await res.json().catch(() => ({}));
  } else {
    const text = await res.text().catch(() => "");
    payload = text ? { message: text } : {};
  }

  const message = payload?.message || fallbackMessage;
  const error = new Error(message);
  error.name = "ApiError";
  error.status = res.status;
  error.code = payload?.code;
  throw error;
};

const isNetworkError = (error) => {
  // Browsers throw TypeError('Failed to fetch') for network/CORS/DNS failures.
  if (error?.name === "TypeError") return true;
  if (typeof error?.message === "string") {
    const m = error.message.toLowerCase();
    return m.includes("failed to fetch") || m.includes("networkerror");
  }
  return false;
};

const request = async (
  url,
  options = {},
  fallbackMessage = "API request failed"
) => {
  emitApiEvent("api_request_start");

  try {
    const token = getToken();
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    };

    const requestUrl = apiUrl(url);
    console.log("[API] Request URL:", requestUrl);

    const res = await fetch(requestUrl, {
      ...options,
      headers,
    });

    if (!res.ok) {
      await parseError(res, fallbackMessage);
    }

    if (isDisconnected) {
      isDisconnected = false;
      emitApiEvent("api_reconnected");
    }

    if (res.status === 204) return {};
    return res.json();
  } catch (error) {
    if (isNetworkError(error) && !isDisconnected) {
      isDisconnected = true;
      emitApiEvent("api_disconnected");
    }
    throw error;
  } finally {
    emitApiEvent("api_request_end");
  }
};

// ======================
// GET
// ======================
export const apiGet = async (url) => {
  return request(url, {}, "API GET failed");
};

// ======================
// POST
// ======================
export const apiPost = async (url, body) => {
  return request(
    url,
    {
      method: "POST",
      body: JSON.stringify(body),
    },
    "API POST failed"
  );
};

// ======================
// PUT
// ======================
export const apiPut = async (url, body) => {
  return request(
    url,
    {
      method: "PUT",
      body: JSON.stringify(body),
    },
    "API PUT failed"
  );
};

// ======================
// DELETE
// ======================
export const apiDelete = async (url) => {
  return request(
    url,
    {
      method: "DELETE",
    },
    "API DELETE failed"
  );
};
