// composables/useLoginLogic.js
export const useLogin = () => {
    const username = ref('Sabri13')
    const password = ref('123')
    const isLoading = ref(false)
    const errors = reactive({
      username: '',
      password: '',
      form: ''
    })
  
    const router = useRouter()
    const { login , logout } = useAuth()
  
    // Handle login submission
    const handleLogin = async () => {
      try {
        isLoading.value = true
        errors.form = ''
  
        const success = await login({
          username: username.value,
          password: password.value
        })
        
        if (success) {
          router.push('/')
        } else {
          errors.form = 'Invalid email or password'
        }
      } catch (error) {
        console.error('Login error::::', error)
        errors.form = 'Authentication failed. Please try again.'
      } finally {
        isLoading.value = false
      }
    }
  
    return {
      username,
      password,
      isLoading,
      errors,
      handleLogin,
      logout
    }
  }
  