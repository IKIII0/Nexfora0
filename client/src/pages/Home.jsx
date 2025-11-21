import React, { useState } from "react";
import Typewriter from "typewriter-effect";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

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
        <Link
          to="/jasa"
          className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/50 animate-on-load animate-scale-in delay-600 relative overflow-hidden group"
        >
          <span className="relative z-10">Mulai Jelajahi</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        </Link>
      </header>
      {/* --- Dropdown Section --- */}
      <div className="relative container mx-auto px-6 mb-10">
        <div className="flex justify-center items-center gap-5">
          <button
            onClick={() => toggleDropdown("kelas")}
            className="bg-gradient-to-r from-blue-500 to-purple-600 to-pink-500 border border-white/20 text-white-900 font-bold py-2 px-8 rounded-full text-lg transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-2xl hover:text-white hover:bg-purple-600 animate-on-load animate-fade-in delay-100 relative overflow-hidden group"
          >
            Kelas
          </button>
          <button
            onClick={() => toggleDropdown("website")}
            className="bg-gradient-to-r from-blue-500 to-purple-600 to-pink-500 border border-white/20 text-white-900 font-bold py-2 px-8 rounded-full text-lg transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-2xl hover:text-white hover:bg-purple-600 animate-on-load animate-fade-in delay-100 relative overflow-hidden group"
          >
            Website
          </button>
          <button
            onClick={() => toggleDropdown("desain")}
            className="bg-gradient-to-r from-blue-500 to-purple-600 to-pink-500 border border-white/20 text-white-900 font-bold py-2 px-8 rounded-full text-lg transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-2xl hover:text-white hover:bg-purple-600 animate-on-load animate-fade-in delay-100 relative overflow-hidden group"
          >
            Desain
          </button>
        </div>

        {/* Kelas Dropdown */}
        {activeDropdown === "kelas" && (
          <div className="relative top-full left-1/2 transform -translate-x-1/2 mt-4 bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 w-full max-w-4xl shadow-2xl z-50 animate-fade-in">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <img
                  src="/img/kelas-profil.png"
                  alt="Kelas Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Rifki Al Sauqy
                </h3>
                <p className="text-gray-300 mb-4">
                  Instruktur berpengalaman dengan sertifikat terpercaya dalam
                  bidang programming dan teknologi terkini.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <img
                      src="/img/sertifikat-kelas-1.png"
                      alt="Sertifikat 1"
                      className="w-full h-24 object-cover rounded mb-2"
                    />
                    <p className="text-sm text-gray-300">
                      Sertifikat Web Development
                    </p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <img
                      src="/img/sertifikat-kelas-2.png"
                      alt="Sertifikat 2"
                      className="w-full h-24 object-cover rounded mb-2"
                    />
                    <p className="text-sm text-gray-300">
                      Sertifikat Mobile Development
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Website Dropdown */}
        {activeDropdown === "website" && (
          <div className="relative top-full left-1/2 transform -translate-x-1/2 mt-4 bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 w-full max-w-4xl shadow-2xl z-50 animate-fade-in">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <img
                  src="/img/website-profil.png"
                  alt="Website Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-purple-500"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Farhan Prasetyo & Willy Bevan
                </h3>
                <p className="text-gray-300 mb-4">
                  Developer profesional dengan pengalaman 5+ tahun dalam
                  pembuatan website modern dan responsif.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <img
                      src="/img/website-1.png"
                      alt="Website Project 1"
                      className="w-full h-24 object-cover rounded mb-2"
                    />
                    <p className="text-sm text-gray-300">E-commerce Platform</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <img
                      src="/img/website-2.png"
                      alt="Website Project 2"
                      className="w-full h-24 object-cover rounded mb-2"
                    />
                    <p className="text-sm text-gray-300">Corporate Website</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Desain Dropdown */}
        {activeDropdown === "desain" && (
          <div className="relative top-full left-1/2 transform -translate-x-1/2 mt-4 bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 w-full max-w-4xl shadow-2xl z-50 animate-fade-in">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <img
                  src="/img/desain-profil.png"
                  alt="Design Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-green-500"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Yehezkiel Sitanggang
                </h3>
                <p className="text-gray-300 mb-4">
                  Desainer kreatif dengan spesialisasi dalam poster, branding,
                  dan desain visual yang menarik.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <img
                      src="/img/poster-1.png"
                      alt="Poster Design 1"
                      className="w-full h-24 object-cover rounded mb-2"
                    />
                    <p className="text-sm text-gray-300">Event Poster Design</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <img
                      src="/img/poster-2.png"
                      alt="Poster Design 2"
                      className="w-full h-24 object-cover rounded mb-2"
                    />
                    <p className="text-sm text-gray-300">
                      Brand Identity Design
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Home;
