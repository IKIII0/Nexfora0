import { FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // State untuk menyimpan data user
  const [user, setUser] = useState(null);

  // Cek status login saat komponen dimuat
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
    }
  }, []);

  const handleLogout = () => {
    // Hapus data user dari localStorage
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <>
      <nav className="sticky top-0 z-99 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800/50 animate-on-load animate-fade-in-down">
        <div className="container mx-auto p-6 flex justify-between items-center">
          <Link
            to="/"
            className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500 cursor-pointer hover:scale-110 transition-all duration-300 glow-on-hover"
          >
            Nexfora
          </Link>

          <div className="hidden md:flex space-x-8 items-center">
            <Link
              to="/"
              className="nav-link hover:text-blue-400 transition-all duration-300 hover:scale-110 font-medium"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="nav-link hover:text-blue-400 transition-all duration-300 hover:scale-110 font-medium"
            >
              About
            </Link>
            <Link
              to="/courses"
              className="nav-link hover:text-blue-400 transition-all duration-300 hover:scale-110 font-medium"
            >
              Kelas
            </Link>
            <Link
              to="/jasa"
              className="nav-link hover:text-blue-400 transition-all duration-300 hover:scale-110 font-medium"
            >
              Jasa
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:scale-110 transition-all duration-300"
                  title={user.nama_lengkap || user.email?.split('@')[0] || 'Profile'}
                >
                  {user.nama_lengkap 
                    ? user.nama_lengkap.charAt(0).toUpperCase() 
                    : user.email 
                      ? user.email.charAt(0).toUpperCase() 
                      : 'U'
                  }
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-lg transition-all duration-300"
                  title="Keluar"
                >
                  <FaSignOutAlt />
                  <span className="hidden md:inline">Keluar</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-6 py-2 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/50 font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Masuk
              </Link>
            )}
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
              to="/jasa"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-left py-3 px-4 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-300 hover:translate-x-2 font-medium"
            >
              Jasa
            </Link>

            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 w-full text-left py-3 px-4 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-300 hover:translate-x-2 font-medium"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white">
                    {user.nama_lengkap 
                      ? user.nama_lengkap.charAt(0).toUpperCase() 
                      : user.email 
                        ? user.email.charAt(0).toUpperCase() 
                        : 'U'
                    }
                  </div>
                  <span>Profil Saya</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full text-left py-3 px-4 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-300 hover:translate-x-2 font-medium"
                >
                  <FaSignOutAlt />
                  <span>Keluar</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-4 py-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50 font-semibold mt-4 text-center"
              >
                Masuk
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
};
export default Navbar;
