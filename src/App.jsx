// App.jsx
import React, { useState } from "react";
import Typewriter from "typewriter-effect";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-blue-950 text-white font-sans">
      <Navbar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      {/* --- Hero Section --- */}
      <header className="container mx-auto text-center flex flex-col justify-center items-center py-20 md:py-32 px-6 min-h-[calc(100vh-140px)]"> 
        <h2 className="text-4xl md:text-6xl font-bold mb-4 animate-on-load animate-fade-in-up delay-200">
          <Typewriter
            options={{
              strings: ["Upgrade Skill, Wujudkan Proyek"],
              autoStart: true,
              loop: true,
            }}
          />
        </h2>
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto animate-on-load animate-fade-in-up delay-400">
          Nexfora adalah platform terpadu untuk memesan kelas coding berkualitas
          dan jasa pembuatan website profesional.
        </p>
        <a
          href="/jasa"  
          className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/50 animate-on-load animate-scale-in delay-600 relative overflow-hidden group"
        >
          <span className="relative z-10">Mulai Jelajahi</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        </a>
      </header>
      <Footer />
    </div>
  );
}

export default App;