<script setup lang="ts">
// Props for customizing the logo
defineProps({
  color: {
    type: String,
    default: '#4CAF50'  // Default to our primary green
  },
  size: {
    type: Number,
    default: 32
  }
})
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Simple shoehorn shape -->
    <path 
      :fill="color"
      d="M30,10 C25,10 20,15 20,25 L20,75 C20,80 25,85 35,85 L70,85 C75,85 80,80 80,75 L80,65 C80,60 75,55 70,55 L40,55 C35,55 30,50 30,45 L30,10 Z" 
    />
    <!-- Handle/grip detail -->
    <circle cx="30" cy="20" r="8" :fill="color" stroke="white" stroke-width="2" />
  </svg>
</template>"