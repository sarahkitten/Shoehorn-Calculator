<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useCalculatorStore } from '../stores/calculator';
import { ref, computed, watch } from 'vue';

const router = useRouter();
const calculatorStore = useCalculatorStore();

// Error states
const ageError = ref<string | null>(null);
const outingsError = ref<string | null>(null);
const learnAgeError = ref<string | null>(null);
const shoehornYearsError = ref<string | null>(null);
const shoeDistributionError = ref<string | null>(null);

// Compute total shoe distribution percentage
const totalShoeDistribution = computed(() => {
  return Object.values(calculatorStore.shoeDistribution).reduce((sum, value) => sum + value, 0);
});

// Calculate the maximum value each slider can have based on current state
const getMaxAllowed = (shoeType: string) => {
  const currentValue = calculatorStore.shoeDistribution[shoeType] || 0;
  const totalWithoutCurrent = totalShoeDistribution.value - currentValue;
  const availableRemaining = 100 - totalWithoutCurrent;
  
  return availableRemaining;
};

// Handle slider changes with constraint enforcement
const handleSliderChange = (shoeType: string, newValue: number) => {
  const maxAllowed = getMaxAllowed(shoeType);
  
  // Constrain the new value - don't let it exceed what would make total > 100%
  const constrainedValue = Math.min(newValue, maxAllowed);
  
  // Update the store
  calculatorStore.shoeDistribution[shoeType] = constrainedValue;
  
  // Force the slider to the constrained position if it was dragged too far
  if (newValue > maxAllowed) {
    const slider = document.getElementById(`distribution-${shoeType}`) as HTMLInputElement;
    if (slider) {
      slider.value = constrainedValue.toString();
    }
  }
};

// Watch for changes in shoe type to update the default put on time
watch(() => calculatorStore.shoeType, (newShoeType) => {
  if (calculatorStore.mode === 'basic') {
    calculatorStore.putOnTime = calculatorStore.getShoeTime(newShoeType);
  }
});

// Initialize shoe distribution if empty
const initShoeDistribution = () => {
  if (Object.keys(calculatorStore.shoeDistribution).length === 0) {
    calculatorStore.shoeTypes.forEach(type => {
      calculatorStore.shoeDistribution[type] = 0;
    });
  }
};

const validateForm = (): boolean => {
  let isValid = true;
  
  // Validate age
  if (calculatorStore.age === null) {
    ageError.value = 'Please enter your age';
    isValid = false;
  } else {
    ageError.value = null;
  }
  
  // Validate weekly outings
  if (calculatorStore.weeklyOutings === null) {
    outingsError.value = 'Please enter how many times you leave the house weekly';
    isValid = false;
  } else {
    outingsError.value = null;
  }

  // Validate advanced mode fields
  if (calculatorStore.mode === 'advanced') {
    // Validate learn age
    if (calculatorStore.learnAge === null) {
      learnAgeError.value = 'Please enter the age when you learned to tie your shoes';
      isValid = false;
    } else if (calculatorStore.age !== null && calculatorStore.learnAge > calculatorStore.age) {
      learnAgeError.value = 'This cannot be greater than your current age';
      isValid = false;
    } else {
      learnAgeError.value = null;
    }

    // Validate shoehorn years if they own one
    if (calculatorStore.ownsShoehorn && calculatorStore.shoehornYears === null) {
      shoehornYearsError.value = 'Please enter how many years you have owned a shoehorn';
      isValid = false;
    } else if (calculatorStore.ownsShoehorn && calculatorStore.shoehornYears !== null && calculatorStore.age !== null && calculatorStore.shoehornYears > calculatorStore.age) {
      shoehornYearsError.value = 'This cannot be greater than your current age';
      isValid = false;
    } else {
      shoehornYearsError.value = null;
    }
    
    // Validate shoe distribution total is 100%
    if (totalShoeDistribution.value !== 100) {
      shoeDistributionError.value = 'Shoe distribution must total 100%';
      isValid = false;
    } else {
      shoeDistributionError.value = null;
    }
  }
  
  return isValid;
};

const handleSubmit = () => {
  console.log('Submit button clicked');
  console.log('Current mode:', calculatorStore.mode);
  
  if (validateForm()) {
    console.log('Validation successful, calculating results');
    if (calculatorStore.mode === 'advanced') {
      calculatorStore.calculateAdvancedResults();
    } else {
      calculatorStore.calculateBasicResults();
    }
    console.log('Calculation completed, redirecting to results');
    router.push('/results');
  } else {
    console.log('Validation failed');
  }
};

const handleAdvancedMode = () => {
  calculatorStore.toggleMode();
  
  // Initialize shoe distribution when switching to advanced mode
  if (calculatorStore.mode === 'advanced') {
    initShoeDistribution();
    // Set putOnTime to the default for the selected shoe type
    calculatorStore.putOnTime = calculatorStore.getShoeTime(calculatorStore.shoeType);
  }
};
</script>

<template>
  <main>
    <div class="calculator-container">
      <h1>
        Shoehorn Time Ca<span class="shoehorn-l"></span>culator
      </h1>
      <p class="intro">
        How much time have you spent putting on shoes throughout your life? 
        And how much time could you have saved with a shoehorn? Let's find out!
      </p>
      
      <form @submit.prevent="handleSubmit" class="calculator-form">
        <!-- Basic Info - Shown in both modes -->
        <div class="form-group">
          <label for="age">How old are you?</label>
          <input 
            type="number" 
            id="age" 
            v-model.number="calculatorStore.age"
            min="0"
            placeholder="Age in years"
          />
          <p v-if="ageError" class="error">{{ ageError }}</p>
        </div>
        
        <div v-if="calculatorStore.mode === 'basic'" class="form-group">
          <label for="shoeType">What kind of shoes do you most often wear?</label>
          <select id="shoeType" v-model="calculatorStore.shoeType">
            <option v-for="type in calculatorStore.shoeTypes" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="outings">In a typical week, how many times do you leave the house?</label>
          <input 
            type="number" 
            id="outings" 
            v-model.number="calculatorStore.weeklyOutings"
            min="0"
            placeholder="Times per week"
          />
          <p v-if="outingsError" class="error">{{ outingsError }}</p>
        </div>
        
        <!-- Advanced Mode Fields -->
        <template v-if="calculatorStore.mode === 'advanced'">
          <div class="form-section">
            <h2>Advanced Settings</h2>
          </div>
          
          <div class="form-group">
            <label for="putOnTime">How long does it take you to put your shoes on? ({{ calculatorStore.putOnTime }} seconds)</label>
            <input 
              type="range" 
              id="putOnTime" 
              v-model.number="calculatorStore.putOnTime"
              min="1" 
              max="250" 
              class="slider"
            />
            <div class="slider-labels">
              <span>1s</span>
              <span>250s</span>
            </div>
          </div>

          <div class="form-group">
            <label>How often have you worn each kind of shoe across your life? (Total: {{ totalShoeDistribution }}%)</label>
            <p v-if="shoeDistributionError" class="error">{{ shoeDistributionError }}</p>
            
            <div v-for="type in calculatorStore.shoeTypes" :key="type" class="shoe-distribution-item">
              <div class="shoe-distribution-label">
                <label :for="`distribution-${type}`">{{ type }}</label>
                <span>{{ calculatorStore.shoeDistribution[type] || 0 }}%</span>
              </div>
              <div class="constrained-slider-container">
                <input 
                  type="range" 
                  :id="`distribution-${type}`" 
                  :value="calculatorStore.shoeDistribution[type] || 0"
                  min="0" 
                  max="100"
                  @input="handleSliderChange(type, parseInt(($event.target as HTMLInputElement)?.value || '0'))"
                  class="slider constrained-slider"
                  :style="{ '--max-allowed': getMaxAllowed(type) }"
                />
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="learnAge">What age did you learn to put on/tie your shoes?</label>
            <input 
              type="number" 
              id="learnAge" 
              v-model.number="calculatorStore.learnAge"
              min="0"
              placeholder="Age in years"
            />
            <p v-if="learnAgeError" class="error">{{ learnAgeError }}</p>
          </div>

          <div class="form-group checkbox-group">
            <label>
              <input type="checkbox" v-model="calculatorStore.shoesOffAtHome" />
              Do you take your shoes off in the house?
            </label>
          </div>

          <div class="form-group checkbox-group">
            <label>
              <input type="checkbox" v-model="calculatorStore.ownsShoehorn" />
              Do you already own a shoe horn?
            </label>
          </div>

          <div v-if="calculatorStore.ownsShoehorn" class="form-group">
            <label for="shoehornYears">How many years have you had it?</label>
            <input 
              type="number" 
              id="shoehornYears" 
              v-model.number="calculatorStore.shoehornYears"
              min="0"
              placeholder="Years"
            />
            <p v-if="shoehornYearsError" class="error">{{ shoehornYearsError }}</p>
          </div>
        </template>
        
        <div class="buttons">
          <button type="submit" class="btn btn-primary">Calculate</button>
          <button type="button" @click="handleAdvancedMode" class="btn btn-secondary">
            {{ calculatorStore.mode === 'basic' ? 'Advanced Mode' : 'Basic Mode' }}
          </button>
        </div>
      </form>
    </div>
  </main>
</template>

<style scoped>
.calculator-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.shoehorn-l {
  display: inline-block;
  width: 0.3em;
  height: 1em;
  background-image: url('../assets/shoehorn-l.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  vertical-align: -2px;
  margin: 0 0.05em;
}

h2 {
  font-size: 1.8rem;
  margin: 1rem 0;
}

.intro {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.calculator-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  text-align: left;
  max-width: 500px;
  margin: 0 auto;
}

.form-section {
  margin-top: 1rem;
  text-align: center;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checkbox-group {
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-group input {
  margin-right: 0.5rem;
}

label {
  font-weight: bold;
}

input, select {
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  font-family: 'Georgia', 'Times New Roman', 'Times', serif;
}

.slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 10px;
  border-radius: 5px;
  background: #d3d3d3;
  outline: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #4CAF50;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #4CAF50;
  cursor: pointer;
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #666;
}

.shoe-distribution-item {
  margin-bottom: 0.5rem;
}

.shoe-distribution-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.error {
  color: red;
  font-size: 0.9rem;
  margin-top: 0.25rem;
}

.buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  font-family: 'Georgia', 'Times New Roman', 'Times', serif;
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

.constrained-slider-container {
  position: relative;
  width: 100%;
  --thumb-width: 20px;
  --track-padding: 23px;
}

.constrained-slider {
  position: relative;
}

.constrained-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #4CAF50;
  cursor: pointer;
  position: relative;
  z-index: 2;
}

.constrained-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #4CAF50;
  cursor: pointer;
  border: none;
  position: relative;
  z-index: 2;
}

.constrained-slider::after {
  content: '';
  position: absolute;
  top: 0;
  left: calc(var(--thumb-width) + (var(--max-allowed) * (100% - (var(--track-padding) + var(--thumb-width))) / 100));
  right: 0;
  height: 100%;
  background: rgba(255, 0, 0, 0.2);
  pointer-events: none;
  border-radius: 0 5px 5px 0;
}
</style>