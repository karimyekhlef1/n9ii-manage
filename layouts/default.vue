<template>
  <v-app class="flex-container">
   
    <div class="d-flex flex-row" style="min-height: 100vh;">
      <!-- Sidebar -->
      <Sidebar v-if="isSidebarVisible()" :user="user" class="flex-shrink-0" />

      <!-- Main content area -->
      <main class="flex-grow-1">
        <NuxtPage />
      </main>
    </div>
  </v-app>
</template>

<script setup lang="ts">
import Sidebar from '~/components/layout/Sidebar.vue'
import { useSidebarVisibility } from '~/composables/useSidebarVisibility'

const { isSidebarVisible } = useSidebarVisibility()

const user = reactive({
  name: 'John Doe',
  email: 'john@example.com'
})
</script>

<style scoped>
.flex-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

main {
  overflow-y: auto; /* Allow scrolling for page content */
  background-color: #f5f5f5; /* Optional: subtle background for content */
}

/* Ensure sidebar and content sit side by side */
.d-flex.flex-row {
  flex: 1;
}

/* Optional: Smooth transition when sidebar toggles */
.sidebar {
  transition: width 0.3s ease;
}
</style>