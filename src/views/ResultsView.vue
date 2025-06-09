<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useCalculatorStore, SHOE_TIMES } from '../stores/calculator';
import { onMounted, onUnmounted, computed, ref, watch, nextTick } from 'vue';

const router = useRouter();
const calculatorStore = useCalculatorStore();

// State for share functionality
const showShareModal = ref(false);
const shareMessage = ref('');

// Compute the time per pair considering both basic and advanced modes
const timePerPair = computed(() => {
  if (calculatorStore.mode === 'advanced') {
    // In advanced mode, use the custom time value from slider
    return calculatorStore.formatTime(calculatorStore.putOnTime);
  } else {
    // In basic mode, use the shoe time constant
    console.log('Computing timePerPair, shoeType:', calculatorStore.shoeType);
    // Check if shoe type exists in SHOE_TIMES
    if (!(calculatorStore.shoeType in SHOE_TIMES)) {
      console.error('Invalid shoe type:', calculatorStore.shoeType);
      return calculatorStore.formatTime(0);
    }
    // Simply use the shoe time constant directly
    return calculatorStore.formatTime(SHOE_TIMES[calculatorStore.shoeType] || 0);
  }
});

// Compute the shoe type display text for results
const shoeTypeDisplay = computed(() => {
  if (calculatorStore.mode === 'advanced') {
    return 'shoes';
  }
  return calculatorStore.shoeType;
});

onMounted(() => {
  console.log('ResultsView onMounted check:', {
    timeSpent: calculatorStore.timeSpent, 
    timeSaved: calculatorStore.timeSaved,
    weirdnessMessages: calculatorStore.weirdnessMessages
  });
  
  // Scroll to top of page when component mounts
  nextTick(() => {
    // Scroll the main content container to top (body has overflow: hidden)
    const mainElement = document.querySelector('main') as HTMLElement;
    if (mainElement) {
      mainElement.scrollTop = 0;
    }
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

// Generate share text
const generateShareText = () => {
  const timeSpent = calculatorStore.formatTime(calculatorStore.timeSpent);
  const timeSaved = calculatorStore.formatTime(calculatorStore.timeSaved);
  
  let shareText = `👞 Turns out I've spent ${timeSpent} of my life just putting on shoes. `;
  
  if (calculatorStore.timeSaved > 0) {
    shareText += `With a shoehorn I would have saved ${timeSaved}. That's enough time to ${calculatorStore.generateRandomActivity(calculatorStore.timeSaved)}!\n\n`;
  } else {
    shareText += `\n\n`;
  }
  
  shareText += `Calculate yours: https://sarahkitten.github.io/Shoehorn-Calculator\n#ShoehornCalculator #OneStepAhead`;
  
  return shareText;
};

// Handle share button click
const handleShare = async () => {
  const shareText = generateShareText();
  const shareData = {
    title: 'My Shoehorn Time Calculator Results',
    text: shareText,
    url: 'https://sarahkitten.github.io/Shoehorn-Calculator'
  };

  // Only use Web Share API on mobile devices (not desktop)
  // This prevents the macOS share popup that users might dismiss
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile && navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
      return;
    } catch (err: any) {
      // If user cancelled/dismissed the share modal, don't show fallback
      if (err.name === 'AbortError' || err.name === 'NotAllowedError') {
        console.log('User cancelled native share');
        return;
      }
      // Only show custom modal for actual failures
      console.log('Web Share API failed, falling back to modal:', err);
    }
  }

  // Show custom share modal (for desktop or when Web Share API fails)
  showShareModal.value = true;
};

// Copy to clipboard
const copyToClipboard = async () => {
  const shareText = generateShareText();
  
  try {
    await navigator.clipboard.writeText(shareText);
    shareMessage.value = 'Results copied to clipboard! Now you can share on social media.';
    setTimeout(() => {
      shareMessage.value = '';
    }, 4000);
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    shareMessage.value = 'Failed to copy. Please try again.';
    setTimeout(() => shareMessage.value = '', 3000);
  }
};

// Social media sharing functions
const shareOnTwitter = () => {
  const shareText = generateShareText();
  console.log('Share text:', shareText);
  const text = encodeURIComponent(shareText);
  const url = `https://twitter.com/intent/tweet?text=${text}`;
  console.log('Twitter URL:', url);
  window.open(url, '_blank', 'width=600,height=400');
};

const shareOnFacebook = () => {
  // Facebook sharing - note that Facebook no longer supports pre-filled text due to policy changes
  // We'll share the URL and let users add their own text
  const url = encodeURIComponent('https://sarahkitten.github.io/Shoehorn-Calculator');
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  console.log('Facebook URL:', fbUrl);
  window.open(fbUrl, '_blank', 'width=600,height=400');
};

const shareOnLinkedIn = () => {
  // LinkedIn sharing - LinkedIn has deprecated many sharing parameters
  // We'll use the basic sharing URL format
  const url = encodeURIComponent('https://sarahkitten.github.io/Shoehorn-Calculator');
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
  console.log('LinkedIn URL:', linkedInUrl);
  window.open(linkedInUrl, '_blank', 'width=600,height=400');
};

// Close modal
const closeShareModal = () => {
  showShareModal.value = false;
  shareMessage.value = '';
};

// Handle escape key to close modal
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && showShareModal.value) {
    closeShareModal();
  }
};

// Watch for modal state changes to add/remove event listeners
watch(showShareModal, (newValue) => {
  if (newValue) {
    document.addEventListener('keydown', handleKeydown);
  } else {
    document.removeEventListener('keydown', handleKeydown);
  }
});

// Cleanup event listener on component unmount
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <main>
    <div class="results-container">
      <h1>
        <span class="title-part">Your Shoe Time</span>
        <span class="results-word">Resu<span class="shoehorn-l"></span>ts</span>
      </h1>
      
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
          Assuming it takes you {{ timePerPair }} to put on your {{ shoeTypeDisplay }}, 
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
        <button @click="handleShare" class="btn btn-share">
          Share Results
        </button>
      </div>
    </div>
    
    <!-- Share modal -->
    <div v-if="showShareModal" class="share-modal" @click="closeShareModal">
      <div class="share-modal-content" @click.stop>
        <span @click="closeShareModal" class="close-modal">&times;</span>
        <h2>Share Your Results</h2>
        <p class="share-description">Share your shoe time results with friends or on social media!</p>
        
        <!-- Copy link button - make it prominent -->
        <button @click="copyToClipboard" class="btn btn-copy-link primary-share">
          📋 Copy Results to Clipboard
        </button>
        
        <!-- Share message display -->
        <div v-if="shareMessage" class="share-message">
          {{ shareMessage }}
        </div>
        
        <!-- Social media buttons -->
        <div class="social-share-buttons">
          <button @click="shareOnFacebook" class="social-share-btn facebook">
            Share on Facebook
          </button>
          <button @click="shareOnLinkedIn" class="social-share-btn linkedin">
            Share on LinkedIn
          </button>
          <button @click="shareOnTwitter" class="social-share-btn twitter">
            Share on X
          </button>
        </div>
        
        <p class="share-note">
          <em>Paste from clipboard to share your results!</em>
        </p>
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

.title-part {
  margin-right: 0.3em;
}

.results-word {
  white-space: nowrap;
}

/* Responsive design for smaller screens */
@media (max-width: 480px) {
  h1 {
    font-size: 2rem;
  }
  
  .title-part {
    display: block;
    margin-bottom: 0.2rem;
    margin-right: 0;
  }
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
  background-color: #f3e8ff;
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

.btn-share {
  background-color: #3b5998;
  color: white;
}

.btn-share:hover {
  background-color: #344e86;
}

.share-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.share-modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  text-align: center;
  position: relative;
}

.close-modal {
  position: absolute;
  top: 0.5rem;
  right: 0.75rem;
  cursor: pointer;
  font-size: 2rem;
  font-weight: bold;
  color: #666;
  line-height: 1;
  z-index: 1001;
}

.close-modal:hover {
  color: #333;
}

.social-share-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1.5rem 0;
}

.social-share-btn {
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  color: white;
  transition: background-color 0.3s;
}

.twitter {
  background-color: #1da1f2;
}

.twitter:hover {
  background-color: #1991db;
}

.facebook {
  background-color: #3b5998;
}

.facebook:hover {
  background-color: #344e86;
}

.linkedin {
  background-color: #0077b5;
}

.linkedin:hover {
  background-color: #006494;
}

.btn-copy-link {
  background-color: #4CAF50;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s;
}

.btn-copy-link:hover {
  background-color: #45a049;
}

.primary-share {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  padding: 1rem 1.5rem;
}

.share-description {
  margin-bottom: 2rem;
}

.share-message {
  margin: 1rem 0;
  font-style: italic;
  color: #333;
}

.share-note {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.4;
}

/* Responsive adjustments for share modal */
@media (max-width: 768px) {
  .share-modal-content {
    margin: 1rem;
    padding: 1.5rem;
  }

  .social-share-buttons {
    gap: 0.75rem;
  }

  .social-share-btn {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
}
</style>