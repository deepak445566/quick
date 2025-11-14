import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  
  const openMenuHandler = () => setIsMenuOpen(true);
  const closeMenuHandler = () => setIsMenuOpen(false);
  
  const handleLogout = () => {
    logout();
    closeMenuHandler();
    window.location.href = '/';
  };

  const handleLogin = () => {
    window.location.href = '/login';
  };

  return (
    <>
      <nav className="fixed top-0 z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur text-white text-sm min-h-[13vh]">
        {/* Logo */}
        <a href="/" className="flex items-center gap-1">
          <h1 className="orbi text-lg">StellarServe Indexing Tool</h1>
        </a>

        {/* Desktop Nav Links - Conditional based on login */}
        <div className="hidden md:flex items-center gap-6 transition duration-500 orbi">
          {/* Always show Home */}
          <a href="/" className="hover:text-purple-500 transition">
            Home
          </a>

          {/* Show these only when user is logged in */}
          {user ? (
            <>
              <a href="/submit" className="hover:text-purple-500 transition">
                Submit Link
              </a>
              <a href="/history" className="hover:text-purple-500 transition">
                History
              </a>
            </>
          ) : (
            <>
              {/* Show these when user is not logged in */}
              <a href="/about" className="hover:text-purple-500 transition">
                About
              </a>
              <a href="/features" className="hover:text-purple-500 transition">
                Features
              </a>
              <a href="/contact" className="hover:text-purple-500 transition">
                Contact
              </a>
            </>
          )}
        </div>

        {/* Desktop Auth Buttons - Conditional */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            // ✅ Logged in - Show user info and logout
            <div className="flex items-center gap-4">
              <span className="text-sm">Welcome, {user.fullname || user.userId}</span>
              <button 
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 transition-all rounded-xl text-sm" 
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            // ✅ Not logged in - Show login button
            <button 
              className="px-6 py-2.5 bg-[#2563EB] hover:bg-[#1d4ed8] active:scale-95 transition-all rounded-xl text-sm" 
              onClick={handleLogin}
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={openMenuHandler}
          className="md:hidden active:scale-90 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-menu"
          >
            <path d="M4 5h16" />
            <path d="M4 12h16" />
            <path d="M4 19h16" />
          </svg>
        </button>
      </nav>

      {/* Mobile Navigation Overlay - Conditional */}
      <div
        className={`fixed inset-0 z-[100] bg-[#05091A] text-white backdrop-blur flex flex-col items-center justify-center text-lg gap-6 md:hidden transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Always show Home */}
        <a href="/" onClick={closeMenuHandler} className="hover:text-purple-500 transition">
          Home
        </a>

        {/* Conditional links based on login */}
        {user ? (
          // ✅ Mobile menu when logged in
          <>
            <a href="/submit" onClick={closeMenuHandler} className="hover:text-purple-500 transition">
              Submit Link
            </a>
            <a href="/history" onClick={closeMenuHandler} className="hover:text-purple-500 transition">
              History
            </a>
            
            {/* User info and logout */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-300">Welcome, {user.fullname || user.userId}</p>
              <button 
                className="px-8 py-3 bg-red-600 hover:bg-red-700 transition-all rounded-xl mt-4" 
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          // ✅ Mobile menu when not logged in
          <>
            <a href="/about" onClick={closeMenuHandler} className="hover:text-purple-500 transition">
              About
            </a>
            <a href="/features" onClick={closeMenuHandler} className="hover:text-purple-500 transition">
              Features
            </a>
            <a href="/contact" onClick={closeMenuHandler} className="hover:text-purple-500 transition">
              Contact
            </a>

            {/* Mobile Login Button */}
            <button 
              className="px-8 py-3 bg-[#2563EB] hover:bg-[#1d4ed8] transition-all rounded-xl mt-4" 
              onClick={() => { handleLogin(); closeMenuHandler(); }}
            >
              Login
            </button>
          </>
        )}

        {/* Close Button */}
        <button
          onClick={closeMenuHandler}
          className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-purple-600 hover:bg-purple-700 transition text-white rounded-md flex mt-8"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-x"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
    </>
  );
}

export default Navbar;