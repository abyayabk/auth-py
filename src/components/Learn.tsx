import React, { useState, useCallback } from 'react';
import { LanguageSelector } from './LanguageSelector';
import { commonPhrases } from '../data/phrases';
import { Volume2, BookOpen, MessageSquare, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { speakText } from '../utils/speechUtils';
import { translateText } from '../utils/translationUtils';

export const Learn = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [customText, setCustomText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [instantTranslation, setInstantTranslation] = useState('');
  const navigate = useNavigate();

  const handleSpeak = async (text: string) => {
    if (isSpeaking) return;
    
    try {
      setIsSpeaking(true);
      await speakText(text, selectedLanguage);
    } catch (error) {
      console.error('Speech failed:', error);
    } finally {
      setIsSpeaking(false);
    }
  };

  const handleTranslate = async () => {
    if (!customText.trim() || isTranslating) return;

    try {
      setIsTranslating(true);
      const result = await translateText(customText, selectedLanguage);
      setTranslatedText(result);
    } catch (error) {
      console.error('Translation failed:', error);
      setTranslatedText('Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleTextSelection = useCallback(async () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();

    if (text && text !== '' && selectedLanguage !== 'en') {
      setSelectedText(text);
      try {
        const translated = await translateText(text, selectedLanguage);
        setInstantTranslation(translated);
      } catch (error) {
        console.error('Translation failed:', error);
        setInstantTranslation('Translation failed');
      }
    } else {
      setSelectedText('');
      setInstantTranslation('');
    }
  }, [selectedLanguage]);

  const categories = Array.from(
    new Set(commonPhrases.map(phrase => phrase.category))
  );

  return (
    <div className="space-y-12">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Learning Center</h2>
            <p className="text-gray-600 mt-2">Master new languages through interactive learning</p>
          </div>
          <div className="w-64">
            <LanguageSelector value={selectedLanguage} onChange={(lang) => {
              setSelectedLanguage(lang);
              setTranslatedText('');
            }} />
          </div>
        </div>

        {/* Custom Text Translation */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-indigo-600" />
            Translate Your Text
          </h3>
          <div className="space-y-4">
            <textarea
              value={customText}
              onChange={(e) => {
                setCustomText(e.target.value);
                setTranslatedText('');
              }}
              className="w-full h-32 rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter text to translate..."
            />
            <div className="flex items-center gap-4">
              <button
                onClick={handleTranslate}
                disabled={isTranslating || !customText.trim()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTranslating ? 'Translating...' : 'Translate'}
              </button>
              {translatedText && (
                <button
                  onClick={() => handleSpeak(translatedText)}
                  disabled={isSpeaking}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Volume2 className="h-5 w-5" />
                  {isSpeaking ? 'Speaking...' : 'Listen'}
                </button>
              )}
            </div>
            {translatedText && (
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-700">{translatedText}</p>
              </div>
            )}
          </div>
        </div>

        {/* Common Phrases */}
        <div 
          onMouseUp={handleTextSelection}
          onTouchEnd={handleTextSelection}
        >
          {categories.map(category => (
            <div key={category} className="space-y-4 mb-8">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-600" />
                {category}
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {commonPhrases
                  .filter(phrase => phrase.category === category)
                  .map(phrase => (
                    <div
                      key={phrase.id}
                      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <p className="font-medium text-gray-900">{phrase.text}</p>
                          <p className="text-indigo-600 font-medium">
                            {selectedLanguage === 'en'
                              ? phrase.text
                              : phrase.translations[selectedLanguage]}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            handleSpeak(
                              selectedLanguage === 'en'
                                ? phrase.text
                                : phrase.translations[selectedLanguage]
                            )
                          }
                          disabled={isSpeaking}
                          className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                        >
                          <Volume2 className="h-5 w-5 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Test Knowledge Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/quiz')}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-colors flex items-center gap-3 mx-auto"
          >
            <Brain className="h-6 w-6" />
            Test Your Knowledge
          </button>
        </div>
      </div>

      {/* Instant Translation Popup */}
      {selectedText && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 max-w-md w-full z-50">
          <div className="flex items-center justify-between mb-2">
            <p className="font-medium text-gray-700">{selectedText}</p>
            <button
              onClick={() => handleSpeak(selectedText)}
              disabled={isSpeaking}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <Volume2 className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-indigo-600">{instantTranslation || 'Translating...'}</p>
            {instantTranslation && (
              <button
                onClick={() => handleSpeak(instantTranslation)}
                disabled={isSpeaking}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                <Volume2 className="h-5 w-5 text-indigo-600" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};