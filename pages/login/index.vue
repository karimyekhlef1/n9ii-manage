<!-- pages/login.vue -->
<script setup>
import { useLogin } from '~/composables/useLogin'
import logo from '~/public/njiik.png' // Better: put image in assets or public

const {
  username,
  password,
  isLoading,
  errors,
  handleLogin,
} = useLogin()
</script>

<template>
  <div class="login-wrapper">
    <!-- Background Gradient + Overlay -->
    <div class="bg-gradient"></div>
    <div class="bg-overlay"></div>

    <v-container fluid class="fill-height pa-0">
      <v-row class="fill-height ma-0" align="center" justify="center">
        
        <!-- Left Panel - Hero Section (Desktop only) -->
        <v-col cols="12" md="6" class="pa-0 d-none d-md-block">
          <div class="hero-panel">
            <div class="hero-content">
              <img :src="logo" alt="Logo" class="logo" />
              <h1 class="text-h3 font-weight-black text-white mb-4 drop-shadow">
                Welcome Back
              </h1>
              <p class="text-h6 text-white opacity-90 mb-8 max-w-96">
                Secure access to your powerful admin dashboard. Manage everything with ease.
              </p>
              <v-chip
                color="white"
                text-color="primary"
                size="large"
                class="px-6 py-4 text-button font-weight-bold shadow-lg"
                elevation="8"
              >
                <v-icon start>mdi-shield-check</v-icon>
                Admin Portal
              </v-chip>
            </div>
          </div>
        </v-col>

        <!-- Right Panel - Login Form -->
        <v-col cols="12" sm="10" md="6" lg="5" xl="4">
          <div class="form-wrapper pa-6 pa-sm-10">
            <v-card
              elevation="24"
              rounded="xl"
              class="pa-8 pa-md-10 login-card"
              :class="{ 'border-primary': $vuetify.theme.dark }"
            >
              <!-- Mobile Logo -->
              <div class="text-center mb-8 d-md-none">
                <img :src="logo" alt="Logo" class="mobile-logo" />
              </div>

              <div class="d-flex align-center mb-6">
                <v-avatar color="primary" size="48" class="mr-4">
                  <v-icon size="28" color="white">mdi-shield-account</v-icon>
                </v-avatar>
                <div>
                  <h2 class="text-h5 font-weight-bold">Admin Login</h2>
                  <p class="text-body-2 text-medium-emphasis mt-1">
                    Sign in to access your dashboard
                  </p>
                </div>
              </div>

              <v-form @submit.prevent="handleLogin" class="mt-6">
                <v-alert
                  v-if="errors.form"
                  type="error"
                  variant="tonal"
                  class="mb-6 rounded-lg"
                  icon="mdi-alert-circle"
                >
                  {{ errors.form }}
                </v-alert>

                <v-text-field
                  v-model="username"
                  label="Username"
                  prepend-inner-icon="mdi-account"
                  variant="outlined"
                  density="comfortable"
                  :error-messages="errors.username"
                  class="mb-5"
                  autofocus
                  clearable
                  autocomplete="username"
                />

                <v-text-field
                  v-model="password"
                  label="Password"
                  type="password"
                  prepend-inner-icon="mdi-lock-outline"
                  variant="outlined"
                  density="comfortable"
                  :error-messages="errors.password"
                  class="mb-4"
                  autocomplete="current-password"
                  clearable
                />

                <div class="d-flex flex-wrap justify-space-between align-center mb-8 gap-4">
                  <v-checkbox
                    label="Remember this device"
                    density="compact"
                    hide-details
                    color="primary"
                  />
                  <v-btn variant="text" color="primary" size="small">
                    Forgot Password?
                  </v-btn>
                </div>

                <v-btn
                  type="submit"
                  color="primary"
                  size="x-large"
                  block
                  rounded="lg"
                  :loading="isLoading"
                  :disabled="isLoading"
                  class="mb-6 text-button font-weight-bold shadow-lg"
                  elevation="4"
                >
                  <v-icon start>mdi-login-variant</v-icon>
                  Sign In
                </v-btn>

                <!-- Optional subtle footer -->
                <div class="text-center">
                  <small class="text-disabled">
                    © {{ new Date().getFullYear() }} Your Company. All rights reserved.
                  </small>
                </div>
              </v-form>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.bg-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: 1;
}

.bg-overlay {
  position: absolute;
  inset: 0;
  background: url('data:image/svg+xml,...') repeat; /* optional subtle pattern */
  opacity: 0.1;
  z-index: 2;
}

/* Hero Panel - Glassmorphism + Parallax feel */
.hero-panel {
  height: 100vh;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.7));
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 3;
}

.hero-content {
  text-align: center;
  padding: 2rem;
  animation: fadeUp 0.8s ease-out;
}

.logo {
  width: 180px;
  height: auto;
  margin-bottom: 2rem;
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
  animation: float 6s ease-in-out infinite;
}

.mobile-logo {
  width: 120px;
  height: auto;
  margin-bottom: 1rem;
}

.drop-shadow { text-shadow: 0 4px 12px rgba(0,0,0,0.4); }
.max-w-96 { max-width: 24rem; margin: 0 auto; }

.form-wrapper {
  position: relative;
  z-index: 10;
  animation: slideInRight 0.7s ease-out;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
  transition: all 0.3s ease;
}

.dark .login-card {
  background: rgba(30, 30, 46, 0.95);
}

/* Animations */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(50px); }
  to   { opacity: 1; transform: translateX(0); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.gap-4 { gap: 1rem; }

/* Responsive tweaks */
@media (max-width: 960px) {
  .hero-panel { display: none; }
  .bg-gradient { background: linear-gradient(135deg, #667eea, #764ba2); }
}
</style>