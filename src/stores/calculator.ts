import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Define shoe time constants based on the project plan
export const SHOE_TIMES: Record<string, number> = {
  'Big Rubber Clown Shoes': 200,
  'Boots': 80,
  'Hi Top Sneakers': 60,
  'Dress shoes': 50,
  'Sneakers': 45,
  'Low Top Sneakers': 40,
  'High Heels': 15,
  'Velcro Shoes': 15,
  'Slip ons/Flats': 10,
  'Flip flops/Sandals': 5,
  'No Shoes': 0
}

// Define shoehorn time savings
const SHOEHORN_TIMES: Record<string, number> = {
  'Big Rubber Clown Shoes': 20,
  'Boots': 20,
  'Hi Top Sneakers': 15,
  'Dress shoes': 15,
  'Sneakers': 15,
  'Low Top Sneakers': 15,
  'High Heels': 15,
  'Velcro Shoes': 15,
  'Slip ons/Flats': 10,
  'Flip flops/Sandals': 5,
  'No Shoes': 0
}

export const useCalculatorStore = defineStore('calculator', () => {
  // State
  const mode = ref<'basic' | 'advanced'>('basic')
  
  // Basic inputs
  const age = ref<number | null>(null)
  const shoeType = ref<string>('Sneakers')
  const weeklyOutings = ref<number | null>(null)
  
  // Advanced inputs (initialized with defaults)
  const putOnTime = ref<number>(45)
  const shoeDistribution = ref<Record<string, number>>({})
  const learnAge = ref<number | null>(5)
  const shoesOffAtHome = ref<boolean>(true)
  const ownsShoehorn = ref<boolean>(false)
  const shoehornYears = ref<number | null>(null)
  
  // Results
  const timeSpent = ref<number>(0)
  const timeSaved = ref<number>(0)
  const weirdnessMessages = ref<string[]>([])
  const shoeMessage = ref<string>('')
  const recommendation = ref<string>('')

  // Toggle between basic and advanced mode
  function toggleMode() {
    mode.value = mode.value === 'basic' ? 'advanced' : 'basic'
  }

  // Reset calculator
  function resetCalculator() {
    age.value = null
    shoeType.value = 'Sneakers'
    weeklyOutings.value = null
    weirdnessMessages.value = []
    shoeMessage.value = ''
    recommendation.value = ''
  }

  // Calculate results for basic mode
  function calculateBasicResults() {
    console.log('Starting calculation with inputs:', {
      age: age.value,
      shoeType: shoeType.value,
      weeklyOutings: weeklyOutings.value
    });

    if (age.value === null || weeklyOutings.value === null) {
      console.log('Calculation aborted: Missing required inputs');
      return;
    }

    // Clear previous results
    weirdnessMessages.value = []
    
    // Check for "weirdness" in inputs
    detectWeirdness()
    console.log('Weirdness detected:', weirdnessMessages.value);
    
    // Set shoe-specific message
    setShoeMessage()
    console.log('Shoe message set:', shoeMessage.value);
    
    // Basic calculation:
    // Age × weeks per year × weekly outings × 2 (on/off) × shoe time
    const yearsWearingShoes = Math.max(0, age.value - 6) // Assume starts wearing shoes at age 6
    const weeksPerYear = 52
    const shoePutOnTimeSeconds = SHOE_TIMES[shoeType.value]
    
    console.log('Intermediate calculation values:', {
      yearsWearingShoes,
      weeksPerYear,
      weeklyOutings: weeklyOutings.value,
      shoePutOnTimeSeconds
    });

    // Always calculate some time spent for display purposes, even for very young ages
    // If age is below 6, we'll still show some results rather than nothing
    const effectiveYears = Math.max(1, yearsWearingShoes);
    
    // Calculate time spent putting on shoes in seconds
    timeSpent.value = effectiveYears * weeksPerYear * weeklyOutings.value * 2 * shoePutOnTimeSeconds
    
    // Calculate time saved with shoehorn
    const shoehornTimeSeconds = SHOEHORN_TIMES[shoeType.value]
    timeSaved.value = timeSpent.value - (effectiveYears * weeksPerYear * weeklyOutings.value * 2 * shoehornTimeSeconds)

    console.log('Calculation results:', {
      shoePutOnTimeSeconds,
      yearsWearingShoes,
      effectiveYears,
      shoehornTimeSeconds,
      timeSpent: timeSpent.value,
      timeSaved: timeSaved.value,
      formattedTimeSpent: formatTime(timeSpent.value),
      formattedTimeSaved: formatTime(timeSaved.value)
    });

    // Set recommendation message
    setRecommendation()
    console.log('Recommendation set:', recommendation.value);
  }

  // Detect weird inputs and set appropriate messages
  function detectWeirdness() {
    if (age.value !== null) {
      if (age.value >= 0 && age.value <= 6) {
        weirdnessMessages.value.push(`Are you really ${age.value} years old? Can you put on shoes without help? Do you have the financial independence to even purchase a shoe horn? Oh well, no judgement.`)
      } else if (age.value < 0) {
        weirdnessMessages.value.push(`Come on, do you take us for chumps? You aren't ${age.value} years old. You'd have to be a multidimensional super baby to pull that off. Which you aren't. ...Unless?`)
      } else if (age.value >= 80 && age.value < 150) {
        weirdnessMessages.value.push(`Wow! Congratulations on living for so long! With so many years under your belt, you must have put on a lot of shoes.`)
      } else if (age.value >= 150) {
        weirdnessMessages.value.push(`${age.value} years old? Wow, we didn't realize an eternal time deity like yourself had any interest in shoe horns.`)
      }
    }

    if (weeklyOutings.value !== null) {
      if (weeklyOutings.value === 0) {
        weirdnessMessages.value.push(`You leave the house... zero times per week? Are you being held hostage somewhere? Quick, blink twice and buy 14 shoe horns if you need help.`)
      } else if (weeklyOutings.value < 0) {
        weirdnessMessages.value.push(`You leave the house ${weeklyOutings.value} times? That must mean that you're only going INTO houses... within other houses. Houseception.`)
      } else if (weeklyOutings.value >= 35) {
        weirdnessMessages.value.push(`Wow, you leave the house ${weeklyOutings.value} times? You get out a lot. Perhaps an unhealthy amount? Some people need to get out and touch grass, but you need to touch carpet, friend.`)
      }
    }
  }

  // Set shoe-specific message
  function setShoeMessage() {
    switch(shoeType.value) {
      case 'Big Rubber Clown Shoes':
        shoeMessage.value = "Big Rubber Clown Shoes™ are great for balancing on balls, impressing dates, and defending your feet from electrical attacks, but this comes at the cost of them being quite difficult to put on without a shoe horn."
        break
      case 'Boots':
        shoeMessage.value = "Since you wear boots, you are likely a very practical person. Whether they're cowboy boots, hiking boots, or super tall combat boots, we're sure you'll make the most out of the time you save."
        break
      case 'Hi Top Sneakers':
        shoeMessage.value = "While fashionable, Hi Top Sneakers are notorious for being difficult to lace, and even more difficult to cram on. Give your middle and forefinger a break and try a shoehorn."
        break
      case 'Dress shoes':
        shoeMessage.value = "Dress shoes, eh? Are you, perhaps, a very important person with places to be and meetings to attend? Then you should waste no time lacing up your shoes!"
        break
      case 'Sneakers':
        shoeMessage.value = "Old reliable sneakers. Good choice. Did you know that using a shoe horn will actually help preserve your shoe's sole, allowing them to be even more old and reliable?"
        break
      case 'Low Top Sneakers':
        shoeMessage.value = "As someone with Lo Top sneakers, you must at least somewhat value the convenience of an easy to cram on shoe. Why not go all the way with a shoe horn?"
        break
      case 'High Heels':
        shoeMessage.value = "High heels! Very sophisticated. While it's true shoe horns don't help much with these, high quality ones could make excellent gifts for all of the fancy galas and balls you probably attend."
        break
      case 'Velcro Shoes':
        shoeMessage.value = "Velcro shoes make a powerful statement about prioritizing convenience and function over normalcy. We salute you. The velcro will eventually wear out though, and when that day comes, a shoehorn could do you well."
        break
      case 'Slip ons/Flats':
        shoeMessage.value = "It's as we say, flats are the future! But until everyone else converts to your extremely convenient shoe, we'll continue to tide the population over with our shoe horns."
        break
      case 'Flip flops/Sandals':
        shoeMessage.value = "Flip flops and sandals are an excellent choice. That is, until winter comes and you get toe frostbite. During these unfortunate times, it's best to preserve that feeling of freedom with a warmer shoe and a shoe horn."
        break
      case 'No Shoes':
        shoeMessage.value = "You... don't... wear shoes? Is it because you're scared that you won't be able to get them on and look like a buffoon in front of all your cool friends? Yet another reason for you to buy a shoe horn."
        break
    }
  }

  // Set recommendation message based on time saved
  function setRecommendation() {
    if (timeSaved.value <= 0) {
      recommendation.value = "Seems like this part of your life is already optimized. Go you! You may not need it, but as a reward for someone who values shoe efficiency as much as we do, take this 20% off coupon!"
    } else {
      const timeSavedFormatted = formatTime(timeSaved.value)
      recommendation.value = `With a shoehorn, you would have saved ${timeSavedFormatted}. That's enough time to ${generateRandomActivity(timeSaved.value)}!`
    }
  }

  // Helper to format time in a human-readable way
  function formatTime(seconds: number): string {
    if (seconds < 60) {
      return `${Math.floor(seconds)} seconds`
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60)
      return `${minutes} minute${minutes > 1 ? 's' : ''}`
    } else if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600)
      return `${hours} hour${hours > 1 ? 's' : ''}`
    } else if (seconds < 604800) {
      const days = Math.floor(seconds / 86400)
      return `${days} day${days > 1 ? 's' : ''}`
    } else if (seconds < 31536000) {
      const weeks = Math.floor(seconds / 604800)
      return `${weeks} week${weeks > 1 ? 's' : ''}`
    } else {
      const years = Math.floor(seconds / 31536000)
      return `${years} year${years > 1 ? 's' : ''}`
    }
  }

  // Generate a random activity for the time saved message
  function generateRandomActivity(seconds: number): string {
    const activities = [
      "learn the basics of a new language",
      "bake a perfect loaf of bread",
      "watch a movie",
      "read a good book",
      "take a power nap",
      "go for a run",
      "call an old friend",
      "learn a new recipe"
    ]
    
    // Select a random activity
    const randomIndex = Math.floor(Math.random() * activities.length)
    return activities[randomIndex]
  }

  // List of available shoe types
  const shoeTypes = computed(() => Object.keys(SHOE_TIMES))

  return {
    // State
    mode,
    
    // Basic inputs
    age,
    shoeType,
    weeklyOutings,
    shoeTypes,
    
    // Advanced inputs
    putOnTime,
    shoeDistribution,
    learnAge,
    shoesOffAtHome,
    ownsShoehorn,
    shoehornYears,
    
    // Results
    timeSpent,
    timeSaved,
    weirdnessMessages,
    shoeMessage,
    recommendation,
    
    // Actions
    toggleMode,
    resetCalculator,
    calculateBasicResults,
    
    // Helpers
    formatTime
  }
})