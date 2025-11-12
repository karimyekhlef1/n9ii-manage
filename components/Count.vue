<template>
        <div>
                hhh
        <h1 class="text-2xl font-bold">Hello World</h1>
        <p class="mt-2 text-gray-700">This is a simple Nuxt 3 application.</p>
        <v-btn @click="counter.increment" >Increment</v-btn>
        <p class="mt-2">Counter: {{ counter.count }}</p>    
      <v-btn @click="counter.decrement">Decrement</v-btn>
        
        </div>
 
        

</template>
<script setup lang="ts">    
import {useCounterStore} from '~/stores/counter'
const counter = useCounterStore() 

</script>