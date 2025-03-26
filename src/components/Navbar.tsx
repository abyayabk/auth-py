import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Menu, X, Globe2, Trophy } from 'lucide-react';

export const Navbar = () => {
  const { isAuthenticated, logout, points } = useAuthStore();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <Globe2 className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">LinguaLearn</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/stories" className="nav-link">Stories</Link>
              <Link to="/learn" className="nav-link">Learn</Link>
              <Link to="/resources" className="nav-link">Resources</Link>
              <Link to="/about" className="nav-link">About</Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {isAuthenticated && (
              <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 rounded-lg">
                <Trophy className="h-5 w-5 text-indigo-600" />
                <span className="font-medium text-indigo-600">{points} points</span>
              </div>
            )}
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            ) : (
              <div className="space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link to="/" className="mobile-nav-link">Home</Link>
            <Link to="/stories" className="mobile-nav-link">Stories</Link>
            <Link to="/learn" className="mobile-nav-link">Learn</Link>
            <Link to="/resources" className="mobile-nav-link">Resources</Link>
            <Link to="/about" className="mobile-nav-link">About</Link>
            {!isAuthenticated && (
              <>
                <Link to="/login" className="mobile-nav-link">Login</Link>
                <Link to="/register" className="mobile-nav-link">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};