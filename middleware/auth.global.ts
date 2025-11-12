export default defineNuxtRouteMiddleware((to) => {
  // Get authentication state from cookies using a single operation
  const { value: isAuthenticated } = useCookie('auth-is-authenticated')
  
  const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password']
  if (publicRoutes.includes(to.path)) {
    return isAuthenticated ? navigateTo('/') : undefined
  }
  
  // if (!isAuthenticated) {
  //   // Store the intended destination to redirect back after login
  //   const redirectPath = to.fullPath
  //   return navigateTo({
  //     path: '/login',
  //     query: redirectPath !== '/' ? { redirect: redirectPath } : undefined
  //   })
  // }
  
  // If authenticated and trying to access a protected route, allow navigation
  return undefined
})