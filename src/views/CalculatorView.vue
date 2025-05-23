<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useCalculatorStore } from '../stores/calculator';
import { ref } from 'vue';

const router = useRouter();
const calculatorStore = useCalculatorStore();

const ageError = ref<string | null>(null);
const outingsError = ref<string | null>(null);

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
  
  return isValid;
};

const handleSubmit = () => {
  if (validateForm()) {
    calculatorStore.calculateBasicResults();
    router.push('/results');
  }
};

const handleAdvancedMode = () => {
  calculatorStore.toggleMode();
  // For now, just submit with basic mode since we haven't implemented advanced mode yet
  handleSubmit();
};
</script>

<template>
  <main>
    <div class="calculator-container">
      <h1>Shoehorn Time Calculator</h1>
      <p class="intro">
        How much time have you spent putting on shoes throughout your life? 
        And how much time could you have saved with a shoehorn? Let's find out!
      </p>
      
      <form @submit.prevent="handleSubmit" class="calculator-form">
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
        
        <div class="form-group">
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
        
        <div class="buttons">
          <button type="submit" class="btn btn-primary">Calculate</button>
          <button type="button" @click="handleAdvancedMode" class="btn btn-secondary">
            Advanced Mode
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

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: bold;
}

input, select {
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
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
</style>