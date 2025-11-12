<script setup>
import { ref, reactive, computed, watch, watchEffect, onMounted, onUpdated, onUnmounted } from "vue";

// State variables
const count = ref(0);
const message = ref("Hello Vue 3");

// Reactive object
const user = reactive({ name: "Karim", age: 25 });

// Computed property
const doubleCount = computed(() => count.value * 2);

// Watchers
watch(count, (newValue, oldValue) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`);
});

watchEffect(() => {
  console.log(`WatchEffect: Count is now ${count.value}`);
});

// Lifecycle hooks
onMounted(() => {
  console.log("Component Mounted: Ready!");
});

onUpdated(() => {
  console.log("Component Updated: Something changed!");
});

onUnmounted(() => {
  console.log("Component Unmounted: Cleanup done!");
});
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <h1 class="text-2xl font-bold mb-4">{{ message }}</h1>
    <p>Count: {{ count }}</p>
    <p>Double Count: {{ doubleCount }}</p>
    <button @click="count++" class="btn">Increase</button>
  </div>
</template>

<style scoped>
.btn {
  background-color: #4f46e5;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 5px;
  font-size: 1.2rem;
  border: none;
  cursor: pointer;
  transition: 0.2s;
}
.btn:hover {
  background-color: #4338ca;
}
</style>
