<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useCalculatorStore, SHOE_TIMES } from '../stores/calculator';
import { onMounted, computed } from 'vue';

const router = useRouter();
const calculatorStore = useCalculatorStore();

console.log('ResultsView loaded with data:', {
  shoeType: calculatorStore.shoeType,
  timeSpent: calculatorStore.timeSpent,
  timeSaved: calculatorStore.timeSaved,
  formattedTimeSpent: calculatorStore.formatTime(calculatorStore.timeSpent),
  weirdnessMessages: calculatorStore.weirdnessMessages
});

// Compute the time per pair using the shoe time constants
const timePerPair = computed(() => {
  console.log('Computing timePerPair, shoeType:', calculatorStore.shoeType);
  // Check if shoe type exists in SHOE_TIMES
  if (!(calculatorStore.shoeType in SHOE_TIMES)) {
    console.error('Invalid shoe type:', calculatorStore.shoeType);
    return calculatorStore.formatTime(0);
  }
  // Simply use the shoe time constant directly
  return calculatorStore.formatTime(SHOE_TIMES[calculatorStore.shoeType] || 0);
});

onMounted(() => {
  console.log('ResultsView onMounted check:', {
    timeSpent: calculatorStore.timeSpent, 
    timeSaved: calculatorStore.timeSaved,
    weirdnessMessages: calculatorStore.weirdnessMessages
  });
  
  // If there are no results AND no weirdness messages, redirect back to the calculator
  // This handles cases where the user somehow navigated to results without calculating
  if (calculatorStore.timeSpent === 0 && calculatorStore.timeSaved === 0 && calculatorStore.weirdnessMessages.length === 0) {
    console.log('No results or weirdness messages found, redirecting back to calculator');
    router.push('/');
  } else {
    console.log('Results or weirdness messages available, displaying page');
  }
});

const handleTryAgain = () => {
  console.log('Try again button clicked, resetting calculator');
  calculatorStore.resetCalculator();
  router.push('/');
};

const handleAdvancedMode = () => {
  console.log('Advanced mode button clicked, toggling mode');
  calculatorStore.toggleMode();
  router.push('/');
};
</script>

<template>
  <main>
    <div class="results-container">
      <h1>Your Shoe Time Results</h1>
      
      <!-- Display any weirdness messages -->
      <div v-if="calculatorStore.weirdnessMessages.length > 0" class="weirdness-messages">
        <p v-for="(message, index) in calculatorStore.weirdnessMessages" :key="index" class="weirdness-message">
          {{ message }}
        </p>
      </div>
      
      <!-- Show shoe-specific message -->
      <div class="shoe-message">
        <p>{{ calculatorStore.shoeMessage }}</p>
      </div>
      
      <div class="divider">
        <span>Anyway...</span>
      </div>
      
      <!-- Show calculation results -->
      <div class="time-results">
        <p>
          Assuming it takes you {{ timePerPair }} to put on your {{ calculatorStore.shoeType }}, 
          you've spent <span class="highlight">{{ calculatorStore.formatTime(calculatorStore.timeSpent) }}</span> across your life, just putting on shoes.
        </p>
        
        <p>
          {{ calculatorStore.recommendation }}
        </p>
      </div>
      
      <!-- Coupon section -->
      <div class="coupon">
        <h2>🎉 CONGRATULATIONS! 🎉</h2>
        <div class="coupon-code">
          <p>Take 20% off your next Abbeyhorn shoehorn purchase with code:</p>
          <span>SHOEHORN20</span>
        </div>
      </div>
      
      <!-- Action buttons -->
      <div class="buttons">
        <button v-if="calculatorStore.mode === 'basic'" @click="handleAdvancedMode" class="btn btn-primary">
          Try Advanced Mode
        </button>
        <button @click="handleTryAgain" class="btn btn-secondary">
          {{ calculatorStore.mode === 'advanced' ? 'Try Again' : 'Calculate Again' }}
        </button>
        <button class="btn btn-share">Share Results</button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.results-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
}

.weirdness-messages {
  background-color: #fffacd;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  text-align: left;
}

.weirdness-message {
  margin: 0.5rem 0;
  font-style: italic;
}

.shoe-message {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f0f8ff;
  border-radius: 8px;
}

.divider {
  display: flex;
  align-items: center;
  margin: 2rem 0;
}

.divider::before, 
.divider::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid #ccc;
}

.divider span {
  padding: 0 1rem;
  font-style: italic;
  color: #666;
}

.time-results {
  font-size: 1.3rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.highlight {
  font-weight: bold;
  color: #4CAF50;
}

.coupon {
  background-color: #ffdab9;
  padding: 1rem;
  border-radius: 8px;
  margin: 2rem 0;
}

.coupon h2 {
  margin-bottom: 1rem;
}

.coupon-code {
  background-color: white;
  padding: 1rem;
  border-radius: 4px;
}

.coupon-code span {
  display: block;
  font-size: 1.8rem;
  font-weight: bold;
  color: #4CAF50;
  margin-top: 0.5rem;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
}

.btn-primary:hover {
  background-color: #45a049;
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #333;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

.btn-share {
  background-color: #3b5998;
  color: white;
}

.btn-share:hover {
  background-color: #344e86;
}
</style>