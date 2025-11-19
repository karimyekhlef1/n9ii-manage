export default defineNuxtRouteMiddleware((to) => {
  // Read cookie once (useCookie returns a Ref)
  const isAuthenticated = useCookie<boolean>('auth-is-authenticated')

  const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password']

  // User tries to visit a public page (login/register/etc.)
  if (publicRoutes.includes(to.path)) {
    // If already authenticated, redirect to home
    if (isAuthenticated.value) {
      return navigateTo('/')
    }
    return
  }

  // User tries to access a protected route
  if (!isAuthenticated.value) {
    const redirectPath = to.fullPath

    return navigateTo({
      path: '/login',
      query: redirectPath && redirectPath !== '/' 
        ? { redirect: redirectPath } 
        : undefined
    })
  }

  // Authenticated → allow navigation
  return
})
