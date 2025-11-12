<template>
  <div
    v-if="loading || error"
    class="n9ii-default-page"
  >
    <div v-if="loading" class="n9ii-loading-container">
      <img
        :src="n9ii"
        alt="n9ii loading"
        class="n9ii-loading-image"
      />
      <div class="loading-bar">
        <div class="loading-bar-progress"></div>
      </div>
    </div>
    <v-alert
      v-else-if="error"
      type="error"
      class="error-alert"
      variant="tonal"
      icon="mdi-alert-circle"
      border="start"
      elevation="2"
    >
      {{ error }}
      <v-btn
      outline 
        text="refresh"
        color="primary"
        @click="onRefresh()" />
    </v-alert>
  </div>
  
  <div v-else class="n9ii-page-content">
    <div class="n9ii-content-wrapper">
      <slot> 
        
      </slot>
    </div>
  </div>
</template>

<script setup>
const router = useRouter();
import { ref, onMounted } from 'vue';
import n9ii from '~/assets/n9ii.png';

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: "",
  },
  onRefresh: Function,
});
</script>

<style scoped>
.n9ii-default-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
}

.n9ii-loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

.n9ii-loading-image {
  width: 220px;
  height: auto;
  filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.1));
  animation: float 3s ease-in-out infinite;
}

.loading-bar {
  width: 240px;
  height: 6px;
  background-color: rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.loading-bar-progress {
  height: 100%;
  background: linear-gradient(90deg, #0486f8, #04c4f8);
  border-radius: 8px;
  position: absolute;
  width: 30%;
  animation: loading-progress 1.5s infinite ease-in-out;
}

.error-alert {
  width: 100%;
  max-width: 500px;
  border-radius: 12px;
  font-weight: 500;
}

.n9ii-page-content {
  width: 100%;
  min-height: 100vh;
  background-color: #fafafa;
  transition: all 0.3s ease;
}

.n9ii-content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  animation: fade-in 0.5s ease-in-out;
}

@keyframes loading-progress {
  0% {
    left: -30%;
    width: 30%;
  }
  50% {
    width: 40%;
  }
  100% {
    left: 100%;
    width: 30%;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(2deg);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion) {
  .n9ii-loading-image,
  .loading-bar-progress {
    animation: none;
  }
}

@media (max-width: 768px) {
  .n9ii-default-page {
    padding: 1rem;
  }
  
  .n9ii-loading-image {
    width: 160px;
  }
  
  .loading-bar {
    width: 180px;
  }
  
  .n9ii-content-wrapper {
    padding: 1rem;
  }
}
</style>