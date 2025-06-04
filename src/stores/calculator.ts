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

  // Helper function to get default shoe time
  function getShoeTime(type: string): number {
    return SHOE_TIMES[type] || SHOE_TIMES['Sneakers']
  }

  // Calculate results for advanced mode
  function calculateAdvancedResults() {
    console.log('Starting advanced calculation with inputs:', {
      age: age.value,
      weeklyOutings: weeklyOutings.value,
      putOnTime: putOnTime.value,
      shoeDistribution: shoeDistribution.value,
      learnAge: learnAge.value,
      shoesOffAtHome: shoesOffAtHome.value,
      ownsShoehorn: ownsShoehorn.value,
      shoehornYears: shoehornYears.value
    });

    if (age.value === null || weeklyOutings.value === null || learnAge.value === null) {
      console.log('Advanced calculation aborted: Missing required inputs');
      return;
    }

    // Clear previous results
    weirdnessMessages.value = []
    
    // Check for "weirdness" in inputs
    detectWeirdness()
    console.log('Weirdness detected:', weirdnessMessages.value);
    
    // Advanced specific weirdness
    
    // Put on time checks
    if (putOnTime.value >= 1 && putOnTime.value <= 3 && shoeType.value !== 'No Shoes') {
      weirdnessMessages.value.push(`Holy moly, you are fast at putting your shoes on! You ARE telling the truth, right? We don't want anyone besmirching the integrity of our shoehorn time calculator.`);
    }
    
    if (putOnTime.value >= 247 && putOnTime.value <= 250) {
      weirdnessMessages.value.push(`${putOnTime.value} seconds to put your shoes on? Do you often find yourself running late for things? You could use a shoehorn more than most.`);
    }
    
    // Learn age checks
    if (learnAge.value !== null) {
      if (learnAge.value < 0) {
        weirdnessMessages.value.push(`Come on, do you take us for chumps? You didn't learn to tie your shoes at ${learnAge.value} years old. You'd have to be a multidimensional super baby to pull that off. Which you aren't. ...Unless?`);
      } else if (learnAge.value <= 2) {
        weirdnessMessages.value.push(`You learned to tie your shoes at ${learnAge.value}? Very impressive. Most people haven't even learned to go to the bathroom correctly at that age, let alone tie knots. Prodigies like you benefit the most from saving even a little bit of time.`);
      } else if (learnAge.value >= 10) {
        weirdnessMessages.value.push(`You took longer to learn to tie your shoes than most! Not a big deal though. We'll all be using shoehorns in the age of the future.`);
      }
    }
    
    // Shoes off at home check
    if (!shoesOffAtHome.value) {
      weirdnessMessages.value.push(`You leave your shoes on in the house? Some people are going to be very upset with you for that one. But it does save you a bit of time here. Priorities, priorities.`);
    }
    
    // Shoehorn ownership checks
    if (ownsShoehorn.value) {
      weirdnessMessages.value.push(`Glad to hear you already own a shoehorn! Many can learn from your example. You are a blinding beacon of efficiency and optimization.`);
      
      if (shoehornYears.value !== null && age.value !== null) {
        if (shoehornYears.value < 0) {
          weirdnessMessages.value.push(`Come on, do you take us for chumps? You haven't owned a shoehorn for negative ${Math.abs(shoehornYears.value)} years. You'd have to own a multidimensional, time-bending, super shoehorn to pull that off. In which case, we're really jealous.`);
        } else if (shoehornYears.value > age.value) {
          weirdnessMessages.value.push(`You've owned a shoehorn for ${shoehornYears.value} years? That's longer than you've been alive. Either there's a sacred shoehorn heirloom that's being passed down in your family, or you're lying to us.`);
        }
      }
    }

    // Calculate years wearing shoes (from learn age to current age)
    const yearsWearingShoes = Math.max(0, age.value - learnAge.value);
    
    // Factor in taking shoes off inside the house
    const shoeUsageMultiplier = shoesOffAtHome.value ? 1 : 1.5;  // If shoes stay on, fewer on/off cycles
    
    // Calculate time spent for each shoe type based on distribution
    let totalTimeSpent = 0;
    let totalTimeSavedWithShoehorn = 0;
    
    Object.entries(shoeDistribution.value).forEach(([type, percentage]) => {
      if (percentage > 0) {
        // Calculate time for this shoe type
        const shoePutOnTimeSeconds = putOnTime.value; // Use custom time instead of defaults
        const shoehornTimeSeconds = Math.max(1, shoePutOnTimeSeconds - SHOEHORN_TIMES[type]);
        
        const percentFactor = percentage / 100;
        // Calculate time for this shoe type based on weekly outings
        if (weeklyOutings.value === null) {
            console.log('Warning: weeklyOutings is null in calculation');
            return;
        }
        
        const timeForThisType = yearsWearingShoes * 52 * weeklyOutings.value * 2 * 
            shoePutOnTimeSeconds * percentFactor * shoeUsageMultiplier;
        
        totalTimeSpent += timeForThisType;
        
        // Calculate time saved with shoehorn for this type
        const timeSavedForThisType = yearsWearingShoes * 52 * weeklyOutings.value * 2 * 
                                    (shoePutOnTimeSeconds - shoehornTimeSeconds) * 
                                    percentFactor * shoeUsageMultiplier;
        
        totalTimeSavedWithShoehorn += timeSavedForThisType;
      }
    });
    
    // Account for already owning a shoehorn
    if (ownsShoehorn.value && shoehornYears.value !== null) {
      const shoehornOwnershipYears = Math.min(shoehornYears.value, yearsWearingShoes);
      const percentYearsWithShoehorn = shoehornOwnershipYears / yearsWearingShoes;
      
      // Reduce time saved by the proportion of life already using a shoehorn
      totalTimeSavedWithShoehorn *= (1 - percentYearsWithShoehorn);
    }
    
    // Set values
    timeSpent.value = totalTimeSpent;
    timeSaved.value = totalTimeSavedWithShoehorn;

    console.log('Advanced calculation results:', {
      yearsWearingShoes,
      shoeUsageMultiplier,
      timeSpent: timeSpent.value,
      timeSaved: timeSaved.value,
      formattedTimeSpent: formatTime(timeSpent.value),
      formattedTimeSaved: formatTime(timeSaved.value)
    });

    // Generate shoe message based on distribution
    generateAdvancedShoeMessage();
    
    // Set recommendation
    setRecommendation();
    console.log('Recommendation set:', recommendation.value);
  }

  // Generate shoe message for advanced mode based on shoe distribution
  function generateAdvancedShoeMessage() {
    // Find the shoe type with highest percentage
    let highestPercentage = 0;
    let dominantShoeType = 'Sneakers';
    
    Object.entries(shoeDistribution.value).forEach(([type, percentage]) => {
      if (percentage > highestPercentage) {
        highestPercentage = percentage;
        dominantShoeType = type;
      }
    });

    // If there's a dominant shoe type (>50%), use its message
    if (highestPercentage > 50) {
      shoeType.value = dominantShoeType;  // Set for message generation
      setShoeMessage();
    } else {
      // Generic message for mixed shoe usage
      shoeMessage.value = "You seem to have quite a varied shoe collection! A shoehorn can be particularly useful for those days when you're wearing your harder-to-put-on footwear.";
    }
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
        weirdnessMessages.value.push(`Are you really ${age.value} years old? Can you put on shoes without help? Do you have the financial independence to even purchase a shoehorn? Oh well, no judgement.`)
      } else if (age.value < 0) {
        weirdnessMessages.value.push(`Come on, do you take us for chumps? You aren't ${age.value} years old. You'd have to be a multidimensional super baby to pull that off. Which you aren't. ...Unless?`)
      } else if (age.value >= 80 && age.value < 150) {
        weirdnessMessages.value.push(`Wow! Congratulations on living for so long! With so many years under your belt, you must have put on a lot of shoes.`)
      } else if (age.value >= 150) {
        weirdnessMessages.value.push(`${age.value} years old? Wow, we didn't realize an eternal time deity like yourself had any interest in shoehorns.`)
      }
    }

    if (weeklyOutings.value !== null) {
      if (weeklyOutings.value === 0) {
        weirdnessMessages.value.push(`You leave the house... zero times per week? Are you being held hostage somewhere? Quick, blink twice and buy 14 shoehorns if you need help.`)
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
        shoeMessage.value = "Big Rubber Clown Shoes™ are great for balancing on balls, impressing dates, and defending your feet from electrical attacks, but this comes at the cost of them being quite difficult to put on without a shoehorn."
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
        shoeMessage.value = "Old reliable sneakers. Good choice. Did you know that using a shoehorn will actually help preserve your shoe's sole, allowing them to be even more old and reliable?"
        break
      case 'Low Top Sneakers':
        shoeMessage.value = "As someone with Lo Top sneakers, you must at least somewhat value the convenience of an easy to cram on shoe. Why not go all the way with a shoehorn?"
        break
      case 'High Heels':
        shoeMessage.value = "High heels! Very sophisticated. While it's true shoehorns don't help much with these, high quality ones could make excellent gifts for all of the fancy galas and balls you probably attend."
        break
      case 'Velcro Shoes':
        shoeMessage.value = "Velcro shoes make a powerful statement about prioritizing convenience and function over normalcy. We salute you. The velcro will eventually wear out though, and when that day comes, a shoehorn could do you well."
        break
      case 'Slip ons/Flats':
        shoeMessage.value = "It's as we say, flats are the future! But until everyone else converts to your extremely convenient shoe, we'll continue to tide the population over with our shoehorns."
        break
      case 'Flip flops/Sandals':
        shoeMessage.value = "Flip flops and sandals are an excellent choice. That is, until winter comes and you get toe frostbite. During these unfortunate times, it's best to preserve that feeling of freedom with a warmer shoe and a shoehorn."
        break
      case 'No Shoes':
        shoeMessage.value = "You... don't... wear shoes? Is it because you're scared that you won't be able to get them on and look like a buffoon in front of all your cool friends? Yet another reason for you to buy a shoehorn."
        break
    }
  }

  // Set recommendation message based on time saved
  function setRecommendation() {
    // Check for NaN results first
    if (isNaN(timeSaved.value) || isNaN(timeSpent.value)) {
      recommendation.value = "With a shoehorn you would have saved… well… this is embarrassing but we're having trouble calculating the specific time. You didn't do anything funny with the numbers, did you?"
      return
    }
    
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
    // Define activities based on time ranges
    const timeRanges = [
      { maxSeconds: 1800, activities: [ // < 30 minutes
        "grab a snack",
        "take a power nap",
        "do a festive jig"
      ]},
      { maxSeconds: 3600, activities: [ // < 1 hour
        "do a quick workout",
        "run an errand that's been stressing you out",
        "play a board game"
      ]},
      { maxSeconds: 21600, activities: [ // < 6 hours
        "go bowling",
        "watch a movie",
        "shoot a video"
      ]},
      { maxSeconds: 43200, activities: [ // < 12 hours
        "draw a really cool picture",
        "have a spa day",
        "dig up a dinosaur bone"
      ]},
      { maxSeconds: 86400, activities: [ // < 24 hours
        "learn a new skill",
        "go to the beach",
        "knock out your to-do list"
      ]},
      { maxSeconds: 259200, activities: [ // < 3 days
        "read a good book (or a bad one)",
        "develop a website about shoehorns",
        "go on a fishing trip"
      ]},
      { maxSeconds: 604800, activities: [ // < 1 week
        "go bigfoot-hunting",
        "clean your house",
        "start a garden"
      ]},
      { maxSeconds: 1209600, activities: [ // < 2 weeks
        "go on a cruise",
        "beat a video game",
        "climb mount everest"
      ]},
      { maxSeconds: 2592000, activities: [ // < 1 month
        "build a shed in your backyard",
        "carry out a military operation",
        "tame a wild beast"
      ]},
      { maxSeconds: 7776000, activities: [ // < 3 months
        "write a thesis",
        "put on a play",
        "teach a man to fish and feed him for a lifetime"
      ]},
      { maxSeconds: 15552000, activities: [ // < 6 months
        "train for a marathon",
        "build a robot",
        "finely age some cheese"
      ]},
      { maxSeconds: 31536000, activities: [ // < 1 year
        "start your own shoe company",
        "record an album",
        "have a baby"
      ]},
      { maxSeconds: 63072000, activities: [ // < 2 years
        "write a best-selling novel",
        "travel the world",
        "go to culinary school"
      ]},
      { maxSeconds: 94608000, activities: [ // < 3 years
        "excavate a secret underground lair",
        "go bowling 1000 times",
        "learn a new language"
      ]},
      { maxSeconds: Infinity, activities: [ // > 3 years
        "conquer the seven seas",
        "rebuild the world in your image",
        "construct a doomsday device",
        "reevaluate your life choices"
      ]}
    ];

    // Find the appropriate time range
    const range = timeRanges.find(r => seconds < r.maxSeconds);
    if (!range) {
      return "do something amazing"; // Fallback option
    }
    
    // Select a random activity from the range
    const randomIndex = Math.floor(Math.random() * range.activities.length);
    return range.activities[randomIndex];
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
    calculateAdvancedResults,
    getShoeTime,
    
    // Helpers
    formatTime,
    generateRandomActivity
  }
})