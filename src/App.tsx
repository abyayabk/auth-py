import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { SplashScreen } from './components/SplashScreen';
import { Navbar } from './components/Navbar';
import { Stories } from './components/Stories';
import { Learn } from './components/Learn';
import { Quiz } from './components/Quiz';
import ProtectedRoutes from './components/ProtectedRoutes';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';
import { Home } from './components/Home/Home';
import { Globe2 } from 'lucide-react';
import { Form } from './components/Form/Form';
import { Sidebar } from './components/Sidebar/Sidebar';
import { UserList } from './components/UserList/UserList';
import { NavProfile } from './components/NavProfile/NavProfile';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { user } = useAuth();
  return (
      <Router>
        <Routes>
          <Route path="/loading-screen" element={<SplashScreen />} />
          <Route
            path="/*"
            element={
              <div className="min-h-screen bg-gray-50">
                <HomeNav />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/login" element={<Form method="login" />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                    path="/dashboard/*"
                    element={
                      <div className="min-h-screen bg-gray-50">
                        <Navbar />
                        <Sidebar />
                        <div className="ml-72 mt-8 mr-8 mb-8">
                          <ProtectedRoutes>
                            <Routes>
                              <Route path="stories" element={<Stories />} />
                              <Route path="learn" element={<Learn />} />
                              <Route path="quiz" element={<Quiz />} />
                              <Route path="resources" element={<Resources />} />
                              {user?.role?.role === 'admin' && (
                                <Route path="users" element={<UserList />} />
                              )}
                            </Routes>
                          </ProtectedRoutes>
                        </div>
                      </div>
                    }
                  />
                </Routes>
              </div>
            }
          />
        </Routes>
      </Router>
  );
}

const HomeNav = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  if (location.pathname.includes('/dashboard')) {
    return null;
  }

  return (
    <header>
      <div className="container">
        <nav>
          <div className="nav-links">
            <Link to="/" className="flex items-center">
              <Globe2 className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">LinguaLearn</span>
            </Link>
            <Link to="/loading-screen" className="flex items-center">
              Learn
            </Link>
            <Link to="/about" className="flex items-center">
              About Us
            </Link>
          </div>
          {isAuthenticated ? (
            <NavProfile />
          ) : (
            <div className="nav-right">
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

const Register = () => {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
  return <Form method="register" />;
}

const About = () => (
  <div className="prose max-w-none mt-28 ml-32">
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

export default App;