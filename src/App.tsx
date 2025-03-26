import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SplashScreen } from './components/SplashScreen';
import { Navbar } from './components/Navbar';
import { LoginForm, RegisterForm } from './components/AuthForms';
import { Stories } from './components/Stories';
import { Learn } from './components/Learn';
import { Quiz } from './components/Quiz';
import { useAuthStore } from './store/authStore';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route
          path="/*"
          element={
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <Routes>
                  <Route path="/home" element={<Home />} />
                  <Route path="/login" element={<LoginForm />} />
                  <Route path="/register" element={<RegisterForm />} />
                  <Route path="/stories" element={<Stories />} />
                  <Route path="/learn" element={<Learn />} />
                  <Route path="/quiz" element={<Quiz />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/resources" element={<Resources />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
              </main>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

const Home = () => (
  <div className="prose max-w-none">
    <h1>Welcome to LinguaLearn</h1>
    <p>Start your language learning journey today!</p>
  </div>
);

const About = () => (
  <div className="prose max-w-none">
    <h2>About LinguaLearn</h2>
    <p>Your comprehensive platform for language learning and cultural exchange.</p>
  </div>
);

const Resources = () => (
  <div className="prose max-w-none">
    <h2>Learning Resources</h2>
    <p>Access our curated collection of language learning materials.</p>
  </div>
);

const Dashboard = () => {
  const { user } = useAuthStore();
  
  if (!user) {
    return <div>Please log in to access the dashboard.</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Welcome, {user.name}!</h2>
      {/* Dashboard content would go here */}
    </div>
  );
};

export default App;