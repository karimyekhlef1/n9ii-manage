// composables/useAuth.js
import axios from "axios"
export const useAuth = () => {
    const isAuthenticated = useCookie('auth-is-authenticated', () => false)
    const user = useCookie('auth-user', () => null)
    const token = useCookie('auth-token', { maxAge: 60 * 60 * 24 * 7 })
    
    // Function to login user
    const login = async (credentials) => {
      try {
        // Using Axios instead of useFetch
        console.log("credentials",credentials)
        const response = await axios.post('https://nqeyv2.runasp.net/api/Auth/login', 
          {...credentials,appType: "Admin"

           })
        

           console.log("response",response)
           console.log("token",response.data.data.token)
           console.log("user",response.data.data.payload)


        response.data.success
        if (response.data.success) {

          isAuthenticated.value = true
          token.value=  response.data.data.token
          user.value = response.data.data.payload
          return true
        

        }
        return false
      } catch (error) {
          console.log("222222222")

        // console.error('Login error:', error.response || error)
        return false
      }
    }
    
    // Function to logout user
    const logout = () => {
      token.value = null
      isAuthenticated.value = false
      user.value = null
      navigateTo('/login')
    }
    
    // Check if user is authenticated on app initialization
    const checkAuth = async () => {
      if (token.value) {
        try {
          // Using Axios for the auth check
          const response = await axios.get('https://nqeyv2.runasp.net/api/Auth/login', {
            headers: {
              'Authorization': `Bearer ${token.value}`
            }
          })
          
          if (response.data) {
            isAuthenticated.value = true
            user.value = response.data.user || response.data
          } else {
            logout()
          }
        } catch (error) {
          console.error('Auth check error:', error.response || error)
          logout()
        }
      }
    }
    
    return {
      isAuthenticated,
      user,
      login,
      logout,
      checkAuth
    }
  }