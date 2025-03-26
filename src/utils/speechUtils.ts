import { languages } from '../data/languages';

// Keep track of the current utterance
let currentUtterance: SpeechSynthesisUtterance | null = null;

export const speakText = (text: string, languageCode: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!text?.trim()) {
      reject(new Error('No text provided'));
      return;
    }

    // Cancel any ongoing speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    currentUtterance = utterance;

    // Set language and properties
    utterance.lang = languageCode;
    utterance.rate = 0.9; // Slightly slower for better clarity
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Handle speech completion
    utterance.onend = () => {
      if (currentUtterance === utterance) {
        currentUtterance = null;
        resolve();
      }
    };

    // Handle errors
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      if (currentUtterance === utterance) {
        currentUtterance = null;
        reject(new Error(event.error));
      }
    };

    // Handle speech boundaries for debugging
    utterance.onboundary = (event) => {
      console.debug('Speech boundary:', event.charIndex, event.charLength);
    };

    // Find appropriate voice
    const findVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        // Try to find a voice that matches the exact language code
        let voice = voices.find(v => v.lang.toLowerCase() === languageCode.toLowerCase());
        
        // If no exact match, try to find a voice that starts with the language code
        if (!voice) {
          voice = voices.find(v => v.lang.toLowerCase().startsWith(languageCode.toLowerCase()));
        }
        
        // If still no match, try to find any voice for the language
        if (!voice) {
          voice = voices.find(v => v.lang.toLowerCase().includes(languageCode.split('-')[0].toLowerCase()));
        }

        if (voice) {
          utterance.voice = voice;
        }
      }
    };

    // Initial voice loading
    findVoice();

    // Handle voice loading if voices aren't available immediately
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener('voiceschanged', findVoice, { once: true });
    }

    try {
      // Ensure synthesis isn't paused
      window.speechSynthesis.resume();

      // Start speaking
      window.speechSynthesis.speak(utterance);

      // Set up periodic check to prevent synthesis from stopping prematurely
      const intervalId = setInterval(() => {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        } else {
          clearInterval(intervalId);
        }
      }, 5000);

      // Clear interval when speech ends
      utterance.onend = () => {
        clearInterval(intervalId);
        if (currentUtterance === utterance) {
          currentUtterance = null;
          resolve();
        }
      };

      // Clear interval on error
      utterance.onerror = (event) => {
        clearInterval(intervalId);
        console.error('Speech synthesis error:', event);
        if (currentUtterance === utterance) {
          currentUtterance = null;
          reject(new Error(event.error));
        }
      };
    } catch (error) {
      console.error('Speech synthesis failed:', error);
      currentUtterance = null;
      reject(error);
    }
  });
};

// Helper function to stop any ongoing speech
export const stopSpeaking = (): void => {
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }
  currentUtterance = null;
};

// Helper function to check if speech synthesis is currently active
export const isSpeaking = (): boolean => {
  return window.speechSynthesis.speaking;
};  