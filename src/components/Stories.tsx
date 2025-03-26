import React, { useState, useCallback } from 'react';
import { stories } from '../data/stories';
import { languages } from '../data/languages';
import { LanguageSelector } from './LanguageSelector';
import { Volume2, BookOpen, X } from 'lucide-react';
import { translateText } from '../utils/translationUtils';
import { speakText } from '../utils/speechUtils';

export const Stories = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  const [selectedText, setSelectedText] = useState('');
  const [translation, setTranslation] = useState('');
  const [translating, setTranslating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

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

  const handleTextSelection = useCallback(async () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();

    if (selectedText && selectedText !== '' && selectedLanguage !== 'en') {
      setSelectedText(selectedText);
      setTranslating(true);
      try {
        const translatedText = await translateText(selectedText, selectedLanguage);
        setTranslation(translatedText);
      } catch (error) {
        console.error('Translation failed:', error);
        setTranslation('Translation failed');
      } finally {
        setTranslating(false);
      }
    } else {
      setSelectedText('');
      setTranslation('');
    }
  }, [selectedLanguage]);

  const getTranslatedStory = (story: typeof stories[0]) => {
    if (selectedLanguage === 'en') {
      return { title: story.title, content: story.content };
    }
    return story.translations?.[selectedLanguage] || { title: story.title, content: story.content };
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-white p-6 rounded-lg shadow-sm">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Immersive Stories</h2>
          <p className="text-gray-600 mt-2">Explore stories in different languages and enhance your learning journey</p>
        </div>
        <div className="w-64">
          <LanguageSelector value={selectedLanguage} onChange={setSelectedLanguage} />
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {stories.map((story) => {
          const translated = getTranslatedStory(story);
          return (
            <div
              key={story.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
              onClick={() => setSelectedStory(story.id)}
            >
              <div 
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${story.imageUrl})` }}
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{translated.title}</h3>
                <p className="text-gray-600 line-clamp-3">{translated.content}</p>
                <button className="mt-4 text-indigo-600 font-medium hover:text-indigo-800 flex items-center gap-2">
                  Read more <BookOpen className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Story Reader Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-8 max-h-[85vh] overflow-y-auto relative">
            {(() => {
              const story = stories.find(s => s.id === selectedStory);
              if (!story) return null;
              const translated = getTranslatedStory(story);
              return (
                <>
                  <button
                    onClick={() => setSelectedStory(null)}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="h-6 w-6 text-gray-500" />
                  </button>
                  <div className="mb-8">
                    <div 
                      className="w-full h-64 bg-cover bg-center rounded-lg mb-6"
                      style={{ backgroundImage: `url(${story.imageUrl})` }}
                    />
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">{translated.title}</h3>
                    <div className="flex items-center gap-4 mb-6">
                      <button
                        onClick={() => handleSpeak(translated.content)}
                        disabled={isSpeaking}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                      >
                        <Volume2 className="h-5 w-5" />
                        {isSpeaking ? 'Speaking...' : 'Listen'}
                      </button>
                      <span className="text-gray-500">
                        Selected language: {languages.find(l => l.code === selectedLanguage)?.name}
                      </span>
                    </div>
                    <div 
                      className="prose max-w-none"
                      onMouseUp={handleTextSelection}
                      onTouchEnd={handleTextSelection}
                    >
                      <p className="text-gray-800 leading-relaxed text-lg whitespace-pre-line">
                        {translated.content}
                      </p>
                    </div>
                  </div>
                  {selectedText && (
                    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 max-w-md w-full">
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
                        <p className="text-indigo-600">
                          {translating ? 'Translating...' : translation}
                        </p>
                        {!translating && translation && (
                          <button
                            onClick={() => handleSpeak(translation)}
                            disabled={isSpeaking}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                          >
                            <Volume2 className="h-5 w-5 text-indigo-600" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-500 italic">
                      Translation verified by Google Translator
                    </p>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};