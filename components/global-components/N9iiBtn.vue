<template>
  <v-app>
    <!-- Toolbar at the top of the screen -->
    <v-app-bar color="primary" height="48">
    <!-- Title of the application with adjusted margin and font size -->
      <v-app-bar-title class="text-h6 ms-3">
        <v-icon icon="mdi-apps"></v-icon>

        <span class="ms-1">My Application</span>
      </v-app-bar-title>
    </v-app-bar>

    <!-- Main content of the application -->
    <v-main>
      <NuxtPage />
    </v-main>

    <!-- Smaller footer at the bottom of the screen -->
    <v-footer color="secondary" height="30">
      <v-container class="text-center text-caption">
        © {{ new Date().getFullYear() }} My Application - All Rights Reserved
      </v-container>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

// Define props with defaults
const props = defineProps({
  label: { type: String, default: 'Click Me!' },
  color: { type: String, default: 'primary' }, // Vuetify colors
  variant: { type: String, default: 'flat' }, // 'flat' | 'outlined' | 'text'
  size: { type: String, default: 'default' }, // 'x-small' | 'small' | 'default' | 'large' | 'x-large'
  borderRadius: { type: Number, default: 20 }
})

// Emit click event
const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click')
}
</script>
