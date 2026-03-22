import axios from 'axios'

const rawBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
// Fix: Ensure VITE_API_URL doesn't result in duplicating /api
const BASE_URL = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;
const API_BASE_URL = BASE_URL.endsWith('/api') ? BASE_URL : `${BASE_URL}/api`;

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

    // Fix: Safely handle undefined error.config (e.g. CORS failure before request completes)
    const originalRequest = error.config || {};

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

      // Safe retry logic if API request exists
      if (originalRequest.url && originalRequest._retryCount < 3) {
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

// Wrapper functions with generic Try-Catch
export const apiGet = async (endpoint) => {
  try { return await apiClient.get(endpoint) } catch(err) { throw err }
}
export const apiPost = async (endpoint, body) => {
  try { return await apiClient.post(endpoint, body) } catch(err) { throw err }
}
export const apiPut = async (endpoint, body) => {
  try { return await apiClient.put(endpoint, body) } catch(err) { throw err }
}
export const apiDelete = async (endpoint) => {
  try { return await apiClient.delete(endpoint) } catch(err) { throw err }
}
