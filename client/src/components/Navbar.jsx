import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react"; 

const Navbar = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  // State sementara untuk mensimulasikan status login
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("Budi Santoso"); 
  useEffect(() => {
  }, []);

  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
    if (isLoggedIn) {
      setUserName(""); 
    } else {
      setUserName("Budi Santoso"); 
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800/50 animate-on-load animate-fade-in-down">
        <div className="container mx-auto p-6 flex justify-between items-center">
          <Link
            to="/"
            className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500 cursor-pointer hover:scale-110 transition-all duration-300 glow-on-hover"
          >
            Nexfora
          </Link>

          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="nav-link hover:text-blue-400 transition-all duration-300 hover:scale-110 font-medium">
              Home
            </Link>
            <Link to="/about" className="nav-link hover:text-blue-400 transition-all duration-300 hover:scale-110 font-medium">
              About
            </Link>
            <Link to="/courses" className="nav-link hover:text-blue-400 transition-all duration-300 hover:scale-110 font-medium">
              Kelas
            </Link>
            <Link
              to="/about#team"
              className="nav-link hover:text-blue-400 transition-all duration-300 hover:scale-110 font-medium"
            >
              Team
            </Link>
            <Link
              to="/jasa"
              className="nav-link hover:text-blue-400 transition-all duration-300 hover:scale-110 font-medium"
            >
              Jasa
            </Link>

            {isLoggedIn ? (
              <Link
                to="/profile" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-6 py-2 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/50 font-semibold"
                onClick={() => setMobileMenuOpen(false)} 
              >
                {userName}
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-6 py-2 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/50 font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}

            {/* Tombol sementara untuk toggle login status */}
            <button
              onClick={toggleLogin}
              className="ml-4 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-full text-sm"
            >
              {isLoggedIn ? "Logout Demo" : "Login Demo"}
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-2xl hover:text-blue-400 transition-all duration-300 hover:scale-125 hover:rotate-90 glow-on-hover"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden sticky top-[73px] z-40 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 animate-on-load animate-fade-in-down">
          <div className="container mx-auto px-6 py-4 space-y-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-left py-3 px-4 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-300 hover:translate-x-2 font-medium"
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-left py-3 px-4 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-300 hover:translate-x-2 font-medium"
            >
              About
            </Link>
            <Link
              to="/courses"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-left py-3 px-4 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-300 hover:translate-x-2 font-medium"
            >
              Kelas
            </Link>
            <Link
              to="/about#team"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-left py-3 px-4 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-300 hover:translate-x-2 font-medium"
            >
              Team
            </Link>
            <Link
              to="/jasa"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-left py-3 px-4 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-300 hover:translate-x-2 font-medium"
            >
              Jasa
            </Link>
            {isLoggedIn ? (
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-4 py-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50 font-semibold mt-4"
              >
                {userName}
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-4 py-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50 font-semibold mt-4"
              >
                Login
              </Link>
            )}
            <button
              onClick={() => {
                toggleLogin();
                setMobileMenuOpen(false); 
              }}
              className="w-full text-left bg-gray-600 hover:bg-gray-500 text-white px-4 py-3 rounded-lg text-sm mt-2"
            >
              {isLoggedIn ? "Logout Demo" : "Login Demo"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
export default Navbar;