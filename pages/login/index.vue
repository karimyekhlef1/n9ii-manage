<!-- pages/login.vue -->
<script setup>
import { useLogin } from '~/composables/useLogin'

// Import login logic
const {
  username,
  password,
  isLoading,
  errors,
  handleLogin,
} = useLogin()
</script>

<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center" class="fill-height">
      <!-- Welcome Section (Left Side) -->
      <v-col cols="12" md="6" lg="5" class="d-none d-md-flex">
        <v-card elevation="0" rounded="lg" class="welcome-section fill-height" color="primary">
          <v-card-text class="d-flex flex-column justify-center align-center text-center pa-8" style="height: 100%;">
            <v-img src="/api/placeholder/200/200" alt="Admin Logo" max-width="120" class="mb-8"></v-img>
            <h1 class="text-h3 font-weight-bold text-white mb-4">Welcome Back</h1>
            <p class="text-subtitle-1 text-white mb-8">
              Access your dashboard to manage your content, users, and settings.
            </p>
            <v-chip color="white" class="px-4">
              <span class="text-primary">Admin Portal</span>
            </v-chip>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Login Form (Right Side) -->
      <v-col cols="12" sm="10" md="6" lg="5">
        <v-card elevation="4" rounded="lg" class="pa-6">
          <div class="d-flex align-center mb-6">
            <v-icon size="x-large" color="primary" class="mr-3">mdi-shield-account</v-icon>
            <v-card-title class="text-h5 font-weight-bold pa-0">
              Admin Login
            </v-card-title>
          </div>
          
          <p class="text-body-2 text-medium-emphasis mb-6">
            Please enter your credentials to access the admin dashboard.
          </p>
          
          <v-form @submit.prevent="handleLogin">
            <v-alert
              v-if="errors.form"
              type="error"
              class="mb-4"
              density="compact"
            >
              {{ errors.form }}
            </v-alert>
            
            <v-text-field
              v-model="username"
              label="Username"
              type="text"
              :error-messages="errors.username"
              prepend-inner-icon="mdi-account"
              variant="outlined"
              required
              class="mb-3"
            ></v-text-field>
            
            <v-text-field
              v-model="password"
              label="Password"
              type="password"
              :error-messages="errors.password"
              prepend-inner-icon="mdi-lock"
              variant="outlined"
              required
              class="mb-6"
            ></v-text-field>
            
            <div class="d-flex justify-space-between align-center mb-6">
              <v-checkbox label="Remember me" density="compact" hide-details></v-checkbox>
              <v-btn variant="text" color="primary" size="small">Forgot Password?</v-btn>
            </div>
            
            <v-btn
              prepend-icon="mdi-login"
              color="primary"
              size="large"
              type="submit"
              block
              :loading="isLoading"
              class="mb-4"
            >
              Login
            </v-btn>
            
     
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.welcome-section {
  height: 100%;
  min-height: 500px;
  display: flex;
  align-items: center;
}
</style>