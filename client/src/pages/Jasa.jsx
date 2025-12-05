import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaCode, FaPaintBrush } from "react-icons/fa";
import { API_CONFIG } from "../utils/apiConfig";

const Jasa = () => {
  const [jasa, setJasa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJasa = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_CONFIG.baseURL}/api/products?tipe=jasa`);
        if (!res.ok) {
          const er = await res.json().catch(() => ({}));
          throw new Error(er.message || "Gagal mengambil data jasa");
        }
        const data = await res.json();
        const items = Array.isArray(data) ? data : (data.data || data.products || []);
        setJasa(items);
      } catch (err) {
        console.error("Fetch jasa error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJasa();
  }, []);

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
          {loading ? (
            <p className="col-span-2 text-center text-gray-400">Memuat layanan...</p>
          ) : error ? (
            <p className="col-span-2 text-center text-red-400">{error}</p>
          ) : jasa.length === 0 ? (
            <p className="col-span-2 text-center text-gray-400">Belum ada layanan jasa</p>
          ) : (
            jasa.map((item, index) => (
              <div key={item.id || index} className={`animate-on-load animate-fade-in delay-${(index + 6) * 100}`}>
                <ProductCard
                  title={item.nama_produk || item.title}
                  description={item.deskripsi || item.description}
                  price={
                    item.harga != null
                      ? new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(Number(item.harga))
                      : item.price
                  }
                  icon={<FaCode className="text-green-400" size={32} />}
                  whatsappNumber="6285831163191"
                  onBook={() => handleBookService(item)}
                />
              </div>
            ))
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Jasa;