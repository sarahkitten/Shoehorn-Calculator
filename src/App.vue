<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="header-content">
      <div class="logo-container">
        <img src="./assets/abbeyhorn-logo.png" alt="Abbeyhorn Logo" class="abbeyhorn-logo" />
      </div>
      <div class="tagline">Save time. Use a shoehorn.</div>
    </div>
  </header>

  <RouterView />
  
  <footer>
    <div class="footer-content">
      <p>© {{ new Date().getFullYear() }} Abbeyhorn. This is a conceptual project.</p>
      <p class="small">All time calculations are for entertainment purposes only and are not scientifically validated.</p>
    </div>
  </footer>
</template>

<style>
@import './assets/main.css';

:root {
  --color-primary: #4CAF50;
  --color-secondary: #f0f0f0;
  --color-text: #333;
  --color-background: #f9f9f9;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Arial', sans-serif;
  color: var(--color-text);
  background-color: var(--color-background);
  line-height: 1.6;
  height: 100vh;
  overflow: hidden;
}

#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

header {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-container {
  display: flex;
  align-items: center;
}

.abbeyhorn-logo {
  width: 60px;
  height: auto;
}

.tagline {
  color: var(--color-text);
  font-style: italic;
}

main {
  flex: 1;
  padding: 2rem 0;
  overflow-y: auto;
  min-height: 0;
}

footer {
  background-color: #333;
  color: white;
  padding: 1rem 0;
  margin-top: 2rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
}

.small {
  font-size: 0.8rem;
  margin-top: 0.5rem;
  opacity: 0.7;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
