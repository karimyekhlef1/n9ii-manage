<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

// 🟢 Reactive state
const count = ref(0)

const name = ref('Karim')
console.log('Component setup initialized')

const doubled = computed(() => {
  console.log('Computed doubled called')
  return count.value * 2
})

// 🎯 Watcher
watch(count, (newVal, oldVal) => {
  console.log(`Count changed from ${oldVal} to ${newVal}`)
})


watchEffect(() => {
  console.log('Name is:', count.value)
})
// ⏱ Lifecycle hooks
onMounted(() => {
  console.log('Component mounted')
})

onUnmounted(() => {
  console.log('Component unmounted')
})

// 🧭 Method
function increment() {
  count.value++
  console.log(`Incremented count to ${count.value}`)
}
</script>

<template>
  <div>
    <h1>Vue 3 Composition API with Console Logs</h1>
    <p>Count: {{ count }}</p>
    <p>Doubled: {{ doubled }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<style scoped>
button {
  padding: 0.5rem 1rem;
  font-weight: bold;
}
</style>
