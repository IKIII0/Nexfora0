import React, { useState } from "react";
import ProductCard from "./components/ProductCard";
import TeamCard from "./components/TeamCard";
import Login from "./components/Login";
import Typewriter from "typewriter-effect";

import {
  FaPython,
  FaCode,
  FaBars,
  FaTimes,
  FaBook,
  FaPaintBrush,
} from "react-icons/fa";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If login page is active, show it
  if (showLogin) {
    return <Login onBack={() => setShowLogin(false)} />;
  }
  // Daftar Kelas
  const kelas = [
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
  ];

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

  // Daftar Team Nexfora
  const teamMembers = [
    {
      name: "Rifki Al Sauqy",
      role: "CEO & Founder",
      photo: "/img/Rifki.jpg",
      description: "Seorang Pengajar dari Nexfora",
    },
    {
      name: "Yehezkiel Gustav Setiawan S",
      role: "CEO & Founder",
      photo: "/img/Kiel.jpg",
      description: "Seorang UI/UX Designer dari Nexfora",
    },
    {
      name: "M. Diaz William Bevan",
      role: "CEO & Founder",
      photo: "/img/Willy.jpg",
      description:
        "Seorang jasa pembuatan website dari Nexfora berbasis wordpress",
    },
    {
      name: "M. Farhan Prasetyo",
      role: "CEO & Founder",
      photo: "/img/Farhan.jpg",
      description:
        "Seorang jasa pembuatan website dari Nexfora berbasis wordpress",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-blue-950 text-white font-sans">
      <Navbar
        showLogin={showLogin}
        setShowLogin={setShowLogin}
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
          href="#kelas"
          className="inline-block bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/50 animate-on-load animate-scale-in delay-600 glow-on-hover"
        >
          Mulai Jelajahi
        </a>
      </header>

      {/* --- Section Kelas --- */}
      <section id="kelas" className="container mx-auto p-6 pb-12">
        <h3 className="text-3xl font-bold text-center mb-12 animate-on-load animate-fade-in-up delay-300">
          Kelas Kami
        </h3>

        {/* Grid responsif */}
        {/* 1 kolom di mobile, 2 kolom di tablet (md) & desktop (lg) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {kelas.map((item, index) => (
            <div
              key={index}
              className={`animate-on-load animate-fade-in delay-${
                (index + 4) * 100
              }`}
            >
              <ProductCard
                title={item.title}
                description={item.description}
                price={item.price}
                icon={item.icon}
                whatsappNumber="6282273875270"
              />
            </div>
          ))}
        </div>
      </section>

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

      {/* --- Section Team --- */}
      <section id="team" className="container mx-auto p-6 pb-20">
        <h3 className="text-3xl font-bold text-center mb-4 animate-on-load animate-fade-in-up delay-200">
          Core Team of Nexfora
        </h3>
        <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto animate-on-load animate-fade-in-up delay-300">
          Kenalan dengan orang-orang hebat di balik kesuksesan Nexfora
        </p>

        {/* Grid responsif - 4 kolom di desktop, 2 di tablet, 1 di mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className={`animate-on-load animate-fade-in delay-${
                (index + 4) * 100
              }`}
            >
              <TeamCard
                name={member.name}
                role={member.role}
                photo={member.photo}
                description={member.description}
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
