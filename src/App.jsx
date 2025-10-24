import React, { useState } from "react";
import ProductCard from "./components/ProductCard";
import Login from "./components/Login";

// Import ikon (opsional, tapi bagus untuk UI)
// Anda bisa install react-icons: npm install react-icons
import {
  FaPython,
  FaCode,
  FaBars,
  FaTimes,
  FaBook,
  FaPaintBrush,
} from "react-icons/fa";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If login page is active, show it
  if (showLogin) {
    return <Login onBack={() => setShowLogin(false)} />;
  }
  // Daftar produk/jasa
  const services = [
    {
      title: "Kelas Python Lengkap",
      description:
        "Belajar Python dari dasar hingga mahir. Cocok untuk data science dan machine learning.",
      price: "Rp 100.000",
      icon: <FaPython className="text-blue-400" size={32} />,
    },
    {
      title: "Kelas Dasar Pemrograman Pascal",
      description:
        "Pelajari dasar-dasar pemrograman dengan Pascal. Sempurna untuk pemula yang ingin memahami logika pemrograman.",
      price: "Rp 5.000 - Rp 10.000",
      icon: <FaBook className="text-purple-400" size={32} />,
    },
    {
      title: "Jasa Pembuatan Website",
      description:
        "Bangun website profesional untuk bisnis atau portofolio Anda dengan teknologi terbaru.",
      price: "Mulai dari Rp 500.000",
      icon: <FaCode className="text-green-400" size={32} />,
    },
    {
      title: "Jasa Design Grafis",
      description:
        "Desain logo, banner, poster, dan materi promosi profesional untuk meningkatkan brand Anda.",
      price: "Rp 5.000 - Rp 450.000",
      icon: <FaPaintBrush className="text-pink-400" size={32} />,
    },
  ];
  // Akhir daftar produk/jasa

  return (
    // Wrapper utama dengan gradasi warna yang diminta
    // min-h-screen: memastikan background menutupi seluruh layar
    // bg-gradient-to-br: gradasi dari (t)op-(l)eft ke (b)ottom-(r)ight
    // from-gray-900 via-black to-blue-950: gradasi dari abu-abu sangat gelap, ke hitam, ke biru sangat gelap
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-blue-950 text-white font-sans">
      {/* --- Navbar --- */}
      <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800/50 animate-on-load animate-fade-in-down">
        <div className="container mx-auto p-6 flex justify-between items-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500 cursor-pointer hover:scale-110 transition-all duration-300 glow-on-hover"
          >
            Nexfora
          </button>
          {/* Navigasi Desktop (Disembunyikan di mobile) */}
          <div className="hidden md:flex space-x-8 items-center">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="nav-link hover:text-blue-400 transition-all duration-300 hover:scale-110 font-medium"
            >
              Home
            </button>
            <a
              href="#services"
              className="nav-link hover:text-blue-400 transition-all duration-300 hover:scale-110 font-medium"
            >
              Kelas
            </a>
            <a
              href="#services"
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
          {/* Tombol Menu Mobile (Hanya tampil di mobile) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-2xl hover:text-blue-400 transition-all duration-300 hover:scale-125 hover:rotate-90 glow-on-hover"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* --- Mobile Menu --- */}
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
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-left py-3 px-4 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-300 hover:translate-x-2 font-medium"
            >
              Kelas
            </a>
            <a
              href="#services"
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

      {/* --- Hero Section --- */}
      <header className="container mx-auto text-center py-20 md:py-32 px-6">
        <h2 className="text-4xl md:text-6xl font-bold mb-4 animate-on-load animate-fade-in-up delay-200">
          Upgrade Skill, Wujudkan Proyek.
        </h2>
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto animate-on-load animate-fade-in-up delay-400">
          Nexfora adalah platform terpadu untuk memesan kelas coding berkualitas
          dan jasa pembuatan website profesional.
        </p>
        <a
          href="#services"
          className="inline-block bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/50 animate-on-load animate-scale-in delay-600 glow-on-hover"
        >
          Mulai Jelajahi
        </a>
      </header>

      {/* --- Daftar Produk/Jasa --- */}
      <main id="services" className="container mx-auto p-6 pb-20">
        <h3 className="text-3xl font-bold text-center mb-12 animate-on-load animate-fade-in-up delay-300">
          Layanan Kami
        </h3>

        {/* Grid responsif */}
        {/* 1 kolom di mobile, 2 kolom di tablet (md) & desktop (lg) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <div
              key={index}
              className={`animate-on-load animate-fade-in delay-${
                (index + 4) * 100
              }`}
            >
              <ProductCard
                title={service.title}
                description={service.description}
                price={service.price}
                icon={service.icon}
              />
            </div>
          ))}
        </div>
      </main>

      {/* --- Footer --- */}
      <footer className="border-t border-gray-800 text-center p-8 animate-on-load animate-fade-in delay-800">
        <p className="text-gray-400">
          &copy; 2025 Nexfora. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;
