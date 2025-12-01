import { ref } from 'vue'

export function useApi() {
  const { $axios } = useNuxtApp()
  const token = useCookie('auth-token').value

  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)
  
  // Helper function to create request options with authentication headers
  const createRequestOptions = (options = {}) => {
    return {
      ...options,
      headers: {
         'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(options.headers || {})
      }
    }
  }
  
  const fetchData = async (endpoint, options = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const mergedOptions = createRequestOptions(options)
      const response = await $axios.get(endpoint, mergedOptions)
      data.value = response.data
      return response.data
    } catch (err) {
      error.value = err.message || 'Something went wrong'
      return null
    } finally {
      loading.value = false
    }
  }
  
  const postData = async (endpoint, payload, options = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const mergedOptions = createRequestOptions(options)
      const response = await $axios.post(endpoint, payload, mergedOptions)
      data.value = response.data
      return response.data
    } catch (err) {
      error.value = err.message || 'Something went wrong'
      return null
    } finally {
      loading.value = false
    }
  }
  
  const putData = async (endpoint, payload, options = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const mergedOptions = createRequestOptions(options)
      const response = await $axios.put(endpoint, payload, mergedOptions)
      data.value = response.data
      return response.data
    } catch (err) {
      error.value = err.message || 'Something went wrong'
      return null
    } finally {
      loading.value = false
    }
  }
  
  const patchData = async (endpoint, payload, options = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const mergedOptions = createRequestOptions(options)
      const response = await $axios.patch(endpoint, payload, mergedOptions)
      data.value = response.data
      return response.data
    } catch (err) {
      error.value = err.message || 'Something went wrong'
      return null
    } finally {
      loading.value = false
    }
  }
  
  const deleteData = async (endpoint, options = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const mergedOptions = createRequestOptions(options)
      const response = await $axios.delete(endpoint, mergedOptions)
      data.value = response.data
      return response.data
    } catch (err) {
      error.value = err.message || 'Something went wrong'
      return null
    } finally {
      loading.value = false
    }
  }
  
  return {
    data,
    loading,
    error,
    fetch: fetchData,
    post: postData,
    put: putData,
    patch: patchData,
    delete: deleteData
  }
}