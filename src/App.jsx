import React, { useState } from "react";
import ProductCard from "./components/ProductCard";
import TeamCard from "./components/TeamCard";
import Login from "./components/Login";
import Register from "./components/Register";
import Typewriter from "typewriter-effect";

import { FaCode, FaBars, FaTimes, FaPaintBrush } from "react-icons/fa";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Daftar Jasa
  const jasa = [
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
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-blue-950 text-white font-sans">
      <Navbar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      {/* --- Hero Section --- */}
      <header className="container mx-auto text-center py-20 md:py-32 px-6">
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
          href="#about"
          className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/50 animate-on-load animate-scale-in delay-600 relative overflow-hidden group"
        >
          <span className="relative z-10">Mulai Jelajahi</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        </a>
      </header>

      {/* --- Section Jasa --- */}
      <section id="jasa" className="container mx-auto p-6 pb-20">
        <h3 className="text-3xl font-bold text-center mb-12 animate-on-load animate-fade-in-up delay-300">
          Jasa Kami
        </h3>

        {/* Grid responsif */}
        {/* 1 kolom di mobile, 2 kolom di tablet (md) & desktop (lg) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {jasa.map((item, index) => (
            <div
              key={index}
              className={`animate-on-load animate-fade-in delay-${
                (index + 6) * 100
              }`}
            >
              <ProductCard
                title={item.title}
                description={item.description}
                price={item.price}
                icon={item.icon}
                whatsappNumber="6285831163191"
              />
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default App;
