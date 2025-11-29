import React from "react";
import { useNavigate } from "react-router-dom";
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
      price: <span className="text-blue-400 font-semibold">Mulai dari Rp 500.000</span>,
      icon: <FaCode className="text-green-400" size={32} />,
    },
    {
      title: "Jasa Design Grafis",
      description:
        "Desain logo, banner, poster, dan materi promosi profesional untuk meningkatkan brand Anda.",
      price: (
        <div className="space-y-3">
          <div className="bg-gray-900/40 border border-gray-700/50 rounded-xl overflow-hidden text-sm">
            <div className="hidden md:grid grid-cols-[1fr_auto] px-4 py-3 bg-gray-800/40 text-gray-400 uppercase text-xs tracking-wider">
              <div>Layanan</div>
              <div className="text-right">Harga</div>
            </div>

            <div className="grid divide-y divide-gray-800">
              <div className="px-4 py-3 flex items-center justify-between">
                <span className="text-gray-300">UI</span>
                <span className="text-blue-400 font-semibold">Rp 450.000</span>
              </div>

              <div className="px-4 py-3 flex items-center justify-between">
                <span className="text-gray-300">Twibbon</span>
                <span className="text-blue-400 font-semibold">Rp 25.000</span>
              </div>

              <div className="px-4 py-3 flex items-center justify-between">
                <span className="text-gray-300">Banner</span>
                <span className="text-blue-400 font-semibold">Rp 30.000</span>
              </div>

              <div className="px-4 py-3 flex items-center justify-between">
                <span className="text-gray-300">Flyer</span>
                <span className="text-blue-400 font-semibold">Rp 30.000</span>
              </div>

              <div className="px-4 py-3 flex items-center justify-between">
                <span className="text-gray-300">Poster</span>
                <span className="text-blue-400 font-semibold">Rp 30.000</span>
              </div>

              <div className="px-4 py-3 flex items-center justify-between">
                <span className="text-gray-300">ID Card</span>
                <span className="text-blue-400 font-semibold">Rp 25.000</span>
              </div>

              <div className="px-4 py-3 flex items-center justify-between">
                <span className="text-gray-300">Sertifikat</span>
                <span className="text-blue-400 font-semibold">Rp 35.000</span>
              </div>

              <div className="px-4 py-3 flex items-center justify-between">
                <span className="text-gray-300">PPT</span>
                <span className="text-blue-400 font-semibold">Rp 15.000</span>
              </div>
            </div>
          </div>

          <p className="mt-2 text-xs text-gray-400">
            Harga dapat dikonsultasikan — diskusi paket & revisi tersedia.
          </p>
        </div>
      ),
      icon: <FaPaintBrush className="text-pink-400" size={32} />,
    },
  ];

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleBookService = (item) => {
    const user = sessionStorage.getItem("nexfora_user");
    if (!user) {
      navigate("/login", {
        state: {
          from: "/pesan",
          booking: {
            type: "jasa",
            item,
          },
        },
      });
    } else {
      navigate("/pesan", {
        state: {
          type: "jasa",
          item,
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-blue-950 text-white font-sans">
      <Navbar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      <section id="jasa" className="container mx-auto p-6 pb-20 pt-20">
        <h3 className="text-5xl md:text-6xl font-bold text-center mb-6 animate-on-load animate-fade-in-up delay-200">
          Jasa Kami
        </h3>

        <p className="text-xl text-gray-300 max-w-3xl mx-auto text-center leading-relaxed mb-6 animate-on-load animate-fade-in-up delay-300">
          Wujudkan visi kreatif Anda dengan jasa profesional kami — desain menarik dan solusi digital yang siap memperkuat identitas bisnis Anda.
        </p>

        <div className="flex justify-center mb-8">
          <div className="bg-transparent border border-blue-500/30 px-8 py-4 rounded-lg inline-block">
            <p className="text-blue-300 font-semibold text-lg">📋 Layanan Profesional</p>
          </div>
        </div>

        <p className="text-center text-gray-400 mb-10 max-w-2xl mx-auto">
          Pilih layanan jasa yang sesuai dengan kebutuhan bisnis dan kreatifitas Anda!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {jasa.map((item, index) => (
            <div key={index} className={`animate-on-load animate-fade-in delay-${(index + 6) * 100}`}>
              <ProductCard
                title={item.title}
                description={item.description}
                price={item.price}
                icon={item.icon}
                whatsappNumber="6285831163191"
                onBook={() => handleBookService(item)}
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