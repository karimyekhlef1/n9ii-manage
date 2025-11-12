// plugins/axios.js
import axios from 'axios'

export default defineNuxtPlugin((nuxtApp) => {
  const axiosInstance = axios.create({
    baseURL: 'http://nqeyv2.runasp.net/api',
    timeout: 1000000,
    headers: {
      'Content-Type': 'application/json',
      'Content-Type': 'multipart/form-data',
    }
  })
  
  // Request interceptor
  axiosInstance.interceptors.request.use(
    (config) => {
      // Add token to headers if available
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )
  
  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Handle errors globally
      if (error.response?.status === 401) {
        // Handle unauthorized error
        // e.g., redirect to login page
      }
      return Promise.reject(error)
    }
  )

  // Provide axios to the rest of the app
  return {
    provide: {
      axios: axiosInstance
    }
  }
})