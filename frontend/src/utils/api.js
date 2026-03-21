import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const API_BASE_URL = `${BASE_URL}/api`;

// Create pure scalable Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10s maximum wait
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// === REQUEST INTERCEPTOR ===
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API Request] -> ${config.baseURL || ''}${config.url || ''}`);
    // TopProgressBar Hook
    window.dispatchEvent(new Event('api_request_start'))

    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    window.dispatchEvent(new Event('api_request_end'))
    return Promise.reject(error)
  }
)

// === RESPONSE INTERCEPTOR ===
apiClient.interceptors.response.use(
  (response) => {
    // TopProgressBar Hook
    window.dispatchEvent(new Event('api_request_end'))

    // The backend standardizes success payloads under `data.data`
    if (response.data && response.data.success !== undefined && !response.data.success) {
      return Promise.reject(new Error(response.data.message || 'API operation failed'))
    }

    return response.data.data !== undefined ? response.data.data : response.data
  },
  async (error) => {
    window.dispatchEvent(new Event('api_request_end'))

    const originalRequest = error.config

    if (error.response) {
      // Server rendered standard HTTP error
      if (error.response.status === 401) {
        localStorage.removeItem('token')
        // We do not reload here to allow React Router to gracefully fall back
      }

      const errorMessage = error.response.data?.message || `API request failed: ${error.response.status}`
      console.error('[API Error Backend]:', errorMessage);
      return Promise.reject(new Error(errorMessage))
    }

    // Network / Timeout Failure Pipeline
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error' || !error.response) {
      console.error('[API Error Network]:', error.message || 'System Disconnected');
      console.warn('System Network Error Detect -> Transitioning to Disconnected State')
      window.dispatchEvent(new Event('api_disconnected'))

      // --- EXPONENTIAL BACKOFF RETRY SYSTEM ---
      if (!originalRequest._retryCount) {
        originalRequest._retryCount = 0
      }

      if (originalRequest._retryCount < 3) {
        originalRequest._retryCount++
        
        // Wait 1s, 2s, 4s respectively
        const backoffDelay = Math.pow(2, originalRequest._retryCount - 1) * 1000
        console.log(`Retrying request... attempt ${originalRequest._retryCount} in ${backoffDelay}ms`)
        
        await new Promise(resolve => setTimeout(resolve, backoffDelay))
        return apiClient(originalRequest)
      } else {
        return Promise.reject(new Error('Unable to connect to server. Maximum retries exceeded.'))
      }
    }

    return Promise.reject(error)
  }
)

export const apiGet = (endpoint) => apiClient.get(endpoint)
export const apiPost = (endpoint, body) => apiClient.post(endpoint, body)
export const apiPut = (endpoint, body) => apiClient.put(endpoint, body)
export const apiDelete = (endpoint) => apiClient.delete(endpoint)
