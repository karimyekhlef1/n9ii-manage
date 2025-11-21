export default defineNuxtPlugin(()=>{
    const app = useNuxtApp()
    addRouteMiddleware('auth',()=>{
        const {isAuthenticated}= useAuth()
        if(!isAuthenticated){
            return navigateTo('/login')
        }
    })

})