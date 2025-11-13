import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = ({ showLogin, setShowLogin, mobileMenuOpen, setMobileMenuOpen }) => {
  return (
    <>
      <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800/50 animate-on-load animate-fade-in-down">
        <div className="container mx-auto p-6 flex justify-between items-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500 cursor-pointer hover:scale-110 transition-all duration-300 glow-on-hover"
          >
            Nexfora
          </button>

          <div className="hidden md:flex space-x-8 items-center">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="nav-link hover:text-blue-400 transition-all duration-300 hover:scale-110 font-medium"
            >
              Home
            </button>
            <a
              href="#team"
              className="nav-link hover:text-blue-400 transition-all duration-300 hover:scale-110 font-medium"
            >
              Team
            </a>
            <a
              href="#kelas"
              className="nav-link hover:text-blue-400 transition-all duration-300 hover:scale-110 font-medium"
            >
              Kelas
            </a>
            <a
              href="#jasa"
              className="nav-link hover:text-blue-400 transition-all duration-300 hover:scale-110 font-medium"
            >
              Jasa
            </a>
            <button
              onClick={() => setShowLogin(true)}
              className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-6 py-2 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/50 font-semibold"
            >
              Login
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
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-3 px-4 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-300 hover:translate-x-2 font-medium"
            >
              Home
            </button>
            <a
              href="#team"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-left py-3 px-4 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-300 hover:translate-x-2 font-medium"
            >
              Team
            </a>
            <a
              href="#kelas"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-left py-3 px-4 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-300 hover:translate-x-2 font-medium"
            >
              Kelas
            </a>
            <a
              href="#jasa"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-left py-3 px-4 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-300 hover:translate-x-2 font-medium"
            >
              Jasa
            </a>
            <button
              onClick={() => {
                setShowLogin(true);
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-4 py-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50 font-semibold mt-4"
            >
              Login
            </button>
          </div>
        </div>
      )}
    </>
  );
};
export default Navbar;
