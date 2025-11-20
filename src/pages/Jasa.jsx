// Jasa.jsx
import React from "react";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaCode, FaPaintBrush } from "react-icons/fa";

const Jasa = () => {
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

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-blue-950 text-white font-sans">
      <Navbar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <section id="jasa" className="container mx-auto p-6 pb-20 pt-20">
        <h3 className="text-3xl font-bold text-center mb-12 animate-on-load animate-fade-in-up delay-300">
          Jasa Kami
        </h3>

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
};

export default Jasa;