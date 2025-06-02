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

  <main class="main-content">
    <div class="content-container">
      <div class="mobile-border-left"></div>
      <div class="background-left">
        <div class="border-left"></div>
      </div>
      <div class="router-content">
        <RouterView />
      </div>
      <div class="background-right">
        <div class="border-right"></div>
      </div>
      <div class="mobile-border-right"></div>
    </div>
  </main>
  
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
  font-family: 'Georgia', 'Times New Roman', 'Times', serif;
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
  overflow-y: auto;
  min-height: 0;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.content-container {
  display: flex;
  min-height: 100%;
  position: relative;
}

.background-left,
.background-right {
  display: none;
}

.border-left,
.border-right {
  display: none;
}

.mobile-border-left,
.mobile-border-right {
  display: block;
  width: 20px;
  flex-shrink: 0;
  background-image: url('./assets/shoehorn-border.png');
  background-repeat: repeat-y;
  background-position: center;
  background-size: contain;
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 1;
}

.mobile-border-left {
  left: 0;
}

.mobile-border-right {
  right: 0;
}

.router-content {
  flex: 1;
  padding: 2rem 0;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  position: relative;
}

.router-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('./assets/shoehorn-bg-center.png');
  background-repeat: repeat;
  background-position: center;
  background-size: 250px 430px;
  opacity: 0.2;
  pointer-events: none;
  z-index: -1;
}

/* Desktop view with background images */
@media (min-width: 1200px) {
  .content-container {
    justify-content: center;
  }
  
  /* Hide mobile borders on desktop */
  .mobile-border-left,
  .mobile-border-right {
    display: none;
  }
  
  .background-left,
  .background-right {
    display: block;
    width: 250px;
    flex-shrink: 0;
    background-repeat: repeat-y;
    background-position: center;
    background-size: contain;
    position: relative;
  }
  
  .border-left,
  .border-right {
    display: block;
    width: 20px;
    position: absolute;
    top: 0;
    bottom: 0;
    background-repeat: repeat-y;
    background-position: center;
    background-size: contain;
    z-index: 1;
  }
  
  .background-left {
    background-image: url('./assets/shoehorn-bg-left.png');
    order: 1;
  }
  
  .border-left {
    background-image: url('./assets/shoehorn-border.png');
    right: -10px;
  }
  
  .router-content {
    order: 2;
    padding: 2rem 2rem;
  }
  
  .border-right {
    background-image: url('./assets/shoehorn-border.png');
    left: -10px;
  }
  
  .background-right {
    background-image: url('./assets/shoehorn-bg-right.png');
    order: 3;
  }
}

footer {
  background-color: #333;
  color: white;
  padding: 1rem 0;
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
