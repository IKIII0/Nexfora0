import React, { useState } from "react";
import Typewriter from "typewriter-effect";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// 1. IMPORT LIGHTBOX DAN CSS-NYA
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // 2. STATE UNTUK LIGHTBOX
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [currentSlides, setCurrentSlides] = useState([]);

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  // 3. DEFINISI DATA GAMBAR
  const kelasSlides = [
    { src: "/img/sertifikat-kelas-1.png" },
    { src: "/img/sertifikat-kelas-2.png" },
  ];

  const websiteSlides = [
    { src: "/img/website-1.png" },
    { src: "/img/website-2.png" },
  ];

  const desainSlides = [
    { src: "/img/poster-1.png" },
    { src: "/img/poster-2.png" },
  ];


  const testimonials = [
    { name: "Yasmin", text: "Hasil Desain nya bagus banget sesuai dengan ekspektasi aku." },
    { name: "Annisa", text: "Pelayanan sangat cepat dan ramah,  revisi nya juga cepat" },
    { name: "Aldyra", text: "Kelas codingnya mudah dipahami untuk pemula. Recommended!" },
    { name: "Pocut", text: "Website nya bagus banget. yang buat juga ganteng." },
  ];

  // 4. FUNGSI UNTUK MEMBUKA LIGHTBOX
  const handleOpenLightbox = (index, slides) => {
    setLightboxIndex(index);
    setCurrentSlides(slides);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-blue-950 text-white font-sans overflow-x-hidden">
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
          to="/about"
          className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/50 animate-on-load animate-scale-in delay-600 relative overflow-hidden group"
        >
          <span className="relative z-10">Mulai Jelajahi</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        </Link>
      </header>

      {/* --- Dropdown Section --- */}
      <div className="relative container mx-auto mt-15 px-6 mb-10 text-center">
        <h1 className="mb-5 text-white font-bold text-xl">Pengalaman Kami</h1>
        <div className="flex flex-wrap justify-center items-center gap-5">
          {["kelas", "website", "desain"].map((item) => (
            <button
              key={item}
              onClick={() => toggleDropdown(item)}
              className="capitalize bg-gradient-to-r from-blue-500 to-purple-600 to-pink-500 border border-white/20 text-white font-bold py-2 px-8 rounded-full text-lg transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-2xl hover:bg-purple-600 animate-on-load animate-fade-in delay-100 relative overflow-hidden group"
            >
              {item}
            </button>
          ))}
        </div>

        {/* ======================= KELAS DROPDOWN ======================= */}
        {activeDropdown === "kelas" && (
          <div className="relative mt-8 bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 w-full max-w-4xl mx-auto shadow-2xl z-50 animate-fade-in">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-5">
                <img src="/img/kelas-profil.png" alt="Kelas Profile" className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-blue-500 flex-shrink-0" />
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-white mb-2">Rifki Al Sauqy</h3>
                  <p className="text-gray-300">Instruktur berpengalaman dengan sertifikat terpercaya.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700/50 rounded-lg p-4 transition hover:bg-gray-700">
                  <div className="w-full h-48 mb-2 overflow-hidden rounded cursor-pointer group">
                    <img
                      src={kelasSlides[0].src}
                      alt="Sertifikat 1"
                      onClick={() => handleOpenLightbox(0, kelasSlides)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <p className="text-sm text-gray-300 font-semibold">Sertifikat Web Development</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4 transition hover:bg-gray-700">
                  <div className="w-full h-48 mb-2 overflow-hidden rounded cursor-pointer group">
                    <img
                      src={kelasSlides[1].src}
                      alt="Sertifikat 2"
                      onClick={() => handleOpenLightbox(1, kelasSlides)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <p className="text-sm text-gray-300 font-semibold">Sertifikat Mobile Development</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= WEBSITE DROPDOWN ======================= */}
        {activeDropdown === "website" && (
          <div className="relative mt-8 bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 w-full max-w-4xl mx-auto shadow-2xl z-50 animate-fade-in">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-5">
                <img src="/img/website-profil.png" alt="Website Profile" className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-purple-500 flex-shrink-0" />
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-white mb-2">Farhan Prasetyo & Willy Bevan</h3>
                  <p className="text-gray-300">Developer profesional dengan beragam pengalaman.</p>
                </div>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-3">Featured Project: Travelio</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="w-full h-56 overflow-hidden rounded-lg border border-gray-600 cursor-pointer group">
                    <img
                      src={websiteSlides[0].src}
                      alt="Website Project 1"
                      onClick={() => handleOpenLightbox(0, websiteSlides)}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="w-full h-56 overflow-hidden rounded-lg border border-gray-600 cursor-pointer group">
                    <img
                      src={websiteSlides[1].src}
                      alt="Website Project 2"
                      onClick={() => handleOpenLightbox(1, websiteSlides)}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= DESAIN DROPDOWN ======================= */}
        {activeDropdown === "desain" && (
          <div className="relative mt-8 bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 w-full max-w-4xl mx-auto shadow-2xl z-50 animate-fade-in">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-5">
                <img src="/img/desain-profil.png" alt="Design Profile" className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-green-500 flex-shrink-0" />
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-white mb-2">Yehezkiel Sitanggang</h3>
                  <p className="text-gray-300">Desainer kreatif spesialis poster dan branding.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700/50 rounded-lg p-4 transition hover:bg-gray-700">
                  <div className="w-full aspect-[3/4] mb-2 overflow-hidden rounded bg-gray-800 cursor-pointer group">
                    <img
                      src={desainSlides[0].src}
                      alt="Poster Design 1"
                      onClick={() => handleOpenLightbox(0, desainSlides)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <p className="text-sm text-gray-300 font-semibold text-center">Event Poster</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4 transition hover:bg-gray-700">
                  <div className="w-full aspect-[3/4] mb-2 overflow-hidden rounded bg-gray-800 cursor-pointer group">
                    <img
                      src={desainSlides[1].src}
                      alt="Poster Design 2"
                      onClick={() => handleOpenLightbox(1, desainSlides)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <p className="text-sm text-gray-300 font-semibold text-center">Banner Design</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ======================= TESTIMONI (INFINITE SCROLL + PAUSE) ======================= */}
      <div className="w-full py-10 overflow-hidden mb-10">
        <div className="text-center mb-8 px-4">
          <h1 className="text-white font-sans text-2xl font-bold">Testimoni</h1>
        </div>

        {/* 1. Tambahkan 'group' di sini. 
           Fungsinya: mendeteksi hover pada seluruh area slider.
        */}
        <div className="flex group [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)] py-2">
          
          {/* GROUP 1: Original */}
          {/* Tambahkan: group-hover:[animation-play-state:paused] */}
          <div className="flex animate-loop-scroll gap-6 pr-6 group-hover:[animation-play-state:paused]">
            {testimonials.map((item, index) => (
              <div 
                key={`ori-${index}`} 
                className="w-72 md:w-80 shrink-0 bg-gray-900/40 border border-gray-800 rounded-2xl p-6 text-left flex flex-col gap-1 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
              >
                <h1 className="font-medium text-lg text-white">{item.name}</h1>
                <p className="text-white/70 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>

          {/* GROUP 2: Duplicate */}
          {/* Tambahkan: group-hover:[animation-play-state:paused] */}
          <div className="flex animate-loop-scroll gap-6 pr-6 group-hover:[animation-play-state:paused]" aria-hidden="true">
            {testimonials.map((item, index) => (
              <div 
                key={`dup-${index}`} 
                className="w-72 md:w-80 shrink-0 bg-gray-900/40 border border-gray-800 rounded-2xl p-6 text-left flex flex-col gap-1 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
              >
                <h1 className="font-medium text-lg text-white">{item.name}</h1>
                <p className="text-white/70 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
      {/* =================================================================================== */}

      <Footer />

      {/* 5. KOMPONEN LIGHTBOX */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={currentSlides}
      />
    </div>
  );
}

export default Home;