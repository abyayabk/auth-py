import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, ArrowRight, BookOpen, Trophy } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { LanguageSelector } from './LanguageSelector';
import { languages } from '../data/languages';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface LanguageOptions {
  [key: string]: string[];
}

interface QuestionTemplate {
  template: (lang: string) => string;
  options: LanguageOptions;
}

const generateQuestions = (language: string): Question[] => {
  const languageName = languages.find(l => l.code === language)?.name || 'English';
  
  const questionTemplates: QuestionTemplate[] = [
    {
      template: (lang: string) => `How do you say 'Hello' in ${lang}?`,
      options: {
        es: ['¡Hola!', 'Adiós', 'Gracias', 'Por favor'],
        fr: ['Bonjour', 'Au revoir', 'Merci', 'S\'il vous plaît'],
        de: ['Hallo', 'Auf Wiedersehen', 'Danke', 'Bitte'],
        it: ['Ciao', 'Arrivederci', 'Grazie', 'Per favore'],
        ja: ['こんにちは', 'さようなら', 'ありがとう', 'お願いします'],
        zh: ['你好', '再见', '谢谢', '请'],
        en: ['Hello', 'Goodbye', 'Thank you', 'Please'] // Added English fallback
      }
    },
    {
      template: (lang: string) => `What does 'Thank you' mean in ${lang}?`,
      options: {
        es: ['Gracias', 'Por favor', '¡Hola!', 'Adiós'],
        fr: ['Merci', 'S\'il vous plaît', 'Bonjour', 'Au revoir'],
        de: ['Danke', 'Bitte', 'Hallo', 'Auf Wiedersehen'],
        it: ['Grazie', 'Per favore', 'Ciao', 'Arrivederci'],
        ja: ['ありがとう', 'お願いします', 'こんにちは', 'さようなら'],
        zh: ['谢谢', '请', '你好', '再见'],
        en: ['Thank you', 'Please', 'Hello', 'Goodbye']
      }
    },
    {
      template: (lang: string) => `Which phrase means 'Good morning' in ${lang}?`,
      options: {
        es: ['Buenos días', 'Buenas noches', 'Buenas tardes', 'Hasta luego'],
        fr: ['Bonjour', 'Bonsoir', 'Bonne nuit', 'Au revoir'],
        de: ['Guten Morgen', 'Gute Nacht', 'Guten Abend', 'Auf Wiedersehen'],
        it: ['Buongiorno', 'Buonanotte', 'Buonasera', 'Arrivederci'],
        ja: ['おはようございます', 'こんばんは', 'さようなら', 'おやすみなさい'],
        zh: ['早上好', '晚上好', '再见', '晚安'],
        en: ['Good morning', 'Good night', 'Good evening', 'Goodbye']
      }
    },
    {
      template: (lang: string) => `How would you say 'Please' in ${lang}?`,
      options: {
        es: ['Por favor', 'Gracias', '¡Hola!', 'Adiós'],
        fr: ['S\'il vous plaît', 'Merci', 'Bonjour', 'Au revoir'],
        de: ['Bitte', 'Danke', 'Hallo', 'Auf Wiedersehen'],
        it: ['Per favore', 'Grazie', 'Ciao', 'Arrivederci'],
        ja: ['お願いします', 'ありがとう', 'こんにちは', 'さようなら'],
        zh: ['请', '谢谢', '你好', '再见'],
        en: ['Please', 'Thank you', 'Hello', 'Goodbye']
      }
    },
    {
      template: (lang: string) => `Which word means 'Yes' in ${lang}?`,
      options: {
        es: ['Sí', 'No', 'Tal vez', 'Quizás'],
        fr: ['Oui', 'Non', 'Peut-être', 'Jamais'],
        de: ['Ja', 'Nein', 'Vielleicht', 'Niemals'],
        it: ['Sì', 'No', 'Forse', 'Mai'],
        ja: ['はい', 'いいえ', 'たぶん', 'けっして'],
        zh: ['是', '不是', '也许', '永远不'],
        en: ['Yes', 'No', 'Maybe', 'Never']
      }
    }
  ];

  // Shuffle the templates array
  const shuffledTemplates = [...questionTemplates]
    .sort(() => Math.random() - 0.5)
    .slice(0, 5); // Take only 5 questions

  return shuffledTemplates.map((template, index) => {
    // Get options for the selected language, fallback to English if not available
    const options = template.options[language] || template.options.en;
    // Shuffle the options
    const shuffledOptions = [...options].sort(() => Math.random() - 0.5);
    const correctAnswer = options[0]; // Store the original correct answer
    
    return {
      id: index + 1,
      question: template.template(languageName),
      options: shuffledOptions,
      correctAnswer: correctAnswer
    };
  });
};

const motivationalQuotes = [
  "Every new language opens a new door to the world!",
  "Learning is a journey, not a destination.",
  "Small steps lead to big achievements!",
  "Your dedication to learning is inspiring!",
  "Keep going! You're making amazing progress!"
];

export const Quiz = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('es');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showQuote, setShowQuote] = useState(false);
  const [pointsAdded, setPointsAdded] = useState(false);
  const navigate = useNavigate();
  const { points, addPoints } = useAuthStore();

  // Initialize questions on mount and when language changes
  useEffect(() => {
    const refreshQuestions = () => {
      setQuestions(generateQuestions(selectedLanguage));
      setCurrentQuestion(0);
      setScore(0);
      setShowResults(false);
      setPointsAdded(false);
    };

    refreshQuestions();
  }, [selectedLanguage]);

  // Handle points addition when showing results
  useEffect(() => {
    if (showResults && !pointsAdded && score >= 3) {
      const earnedPoints = score * 100;
      addPoints(earnedPoints);
      setPointsAdded(true);
    }
  }, [showResults, score, pointsAdded, addPoints]);

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
  };

  const handleAnswer = (answer: string) => {
    if (answer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setQuestions(generateQuestions(selectedLanguage));
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
    setPointsAdded(false);
  };

  if (showResults) {
    const passed = score >= 3;
    const earnedPoints = score * 100;

    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full text-center">
          <div className="mb-8">
            <Brain className={`h-16 w-16 mx-auto ${passed ? 'text-green-500' : 'text-yellow-500'}`} />
            <h2 className="text-3xl font-bold mt-4 mb-2">
              {passed ? 'Congratulations!' : 'Keep Learning!'}
            </h2>
            <p className="text-gray-600">
              You scored {score} out of {questions.length} questions correctly
            </p>
          </div>

          {passed ? (
            <div className="mb-8 p-6 bg-green-50 rounded-lg">
              <p className="text-green-800 font-medium">
                You've earned {earnedPoints} points! 🎉
              </p>
              <p className="text-sm text-green-600 mt-2">
                Total points: {points}
              </p>
              <button
                onClick={() => setShowQuote(true)}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 mx-auto"
              >
                <Trophy className="h-5 w-5" />
                View Achievement
              </button>
            </div>
          ) : (
            <div className="mb-8 p-6 bg-yellow-50 rounded-lg">
              <p className="text-yellow-800">
                Don't worry! Practice makes perfect. Keep learning and try again!
              </p>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            {!passed && (
              <button
                onClick={() => navigate('/learn')}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <BookOpen className="h-5 w-5" />
                Practice More
              </button>
            )}
            <button
              onClick={resetQuiz}
              className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2"
            >
              <ArrowRight className="h-5 w-5" />
              Try Again
            </button>
          </div>
        </div>

        {showQuote && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
              <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <p className="text-xl font-medium mb-6">
                {motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]}
              </p>
              <p className="text-sm text-gray-600 mb-6">
                You've unlocked premium content and special features!
              </p>
              <button
                onClick={() => setShowQuote(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Continue Learning
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl w-full">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Language Quiz</h2>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <div className="w-48">
                <LanguageSelector value={selectedLanguage} onChange={handleLanguageChange} />
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-medium mb-6">{questions[currentQuestion]?.question}</h3>
          <div className="space-y-4">
            {questions[currentQuestion]?.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="w-full p-4 text-left rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};