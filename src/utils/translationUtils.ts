import { languages } from '../data/languages';

const TRANSLATION_APIS = [
  'https://api.mymemory.translated.net/get',
  'https://libretranslate.de/translate'
];

const languageMap: Record<string, string> = {
  'zh': 'zh-CN',  // Chinese (Simplified)
  'ja': 'ja-JP',  // Japanese
  'ko': 'ko-KR',  // Korean
  'ar': 'ar-SA',  // Arabic
  'hi': 'hi-IN',  // Hindi
  'es': 'es-ES',  // Spanish
  'fr': 'fr-FR',  // French
  'de': 'de-DE',  // German
  'it': 'it-IT',  // Italian
  'pt': 'pt-PT',  // Portuguese
  'ru': 'ru-RU',  // Russian
  'en': 'en-US'   // English
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const translateText = async (text: string, targetLang: string): Promise<string> => {
  if (!text?.trim()) {
    throw new Error('No text provided for translation');
  }

  // Don't translate if target language is English
  if (targetLang === 'en') {
    return text;
  }

  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Add delay between retries
      if (attempt > 0) {
        await delay(1000 * attempt);
      }

      // Get the correct language code
      const langCode = languageMap[targetLang] || targetLang;
      
      // Select API endpoint
      const apiUrl = TRANSLATION_APIS[attempt % TRANSLATION_APIS.length];
      
      let response;
      
      if (apiUrl.includes('mymemory')) {
        // MyMemory API
        const url = new URL(apiUrl);
        url.searchParams.append('q', text);
        url.searchParams.append('langpair', `en|${langCode}`);
        url.searchParams.append('de', 'a@b.c'); // Demo email
        
        response = await fetch(url.toString());
        const data = await response.json();
        
        if (data.responseStatus === 200) {
          return data.responseData.translatedText;
        }
        throw new Error(data.responseDetails || 'Translation failed');
        
      } else {
        // LibreTranslate API
        response = await fetch(apiUrl, {
          method: 'POST',
          body: JSON.stringify({
            q: text,
            source: 'en',
            target: targetLang,
            format: 'text'
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        if (data.translatedText) {
          return data.translatedText;
        }
        throw new Error('Translation failed');
      }
    } catch (error) {
      lastError = error as Error;
      console.warn(`Translation attempt ${attempt + 1} failed:`, error);
      continue;
    }
  }

  throw lastError || new Error('All translation attempts failed');
};