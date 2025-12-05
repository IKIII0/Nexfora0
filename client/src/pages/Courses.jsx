import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaPython, FaBook } from "react-icons/fa";
import { API_CONFIG } from "../utils/apiConfig";

function Courses() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const [kelas, setKelas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchKelas = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_CONFIG.baseURL}/api/products?tipe=kelas`);
        if (!res.ok) {
          const er = await res.json().catch(() => ({}));
          throw new Error(er.message || "Gagal mengambil data kelas");
        }
        const data = await res.json();
        const items = Array.isArray(data) ? data : (data.data || data.products || []);
        setKelas(items);
      } catch (err) {
        console.error("Fetch kelas error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchKelas();
  }, []);

  const handleBookClass = (item) => {
    const user = sessionStorage.getItem("nexfora_user");
    if (!user) {
      navigate("/login", {
        state: {
          from: "/pesan",
          booking: {
            type: "kelas",
            item,
          },
        },
      });
    } else {
      navigate("/pesan", {
        state: {
          type: "kelas",
          item,
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-950 text-white font-sans">
      <Navbar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      
      {/* Header */}
      <header className="container mx-auto text-center py-20 px-6">
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Kelas Coding
          </h1>
        </div>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Tingkatkan skill coding Anda dengan kelas berkualitas tinggi yang dirancang khusus untuk mengembangkan kemampuan programming dari dasar hingga mahir.
        </p>
      </header>

      {/* Section Kelas */}
      <section className="container mx-auto p-6 pb-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-gray-800/50 border border-gray-700/50 rounded-2xl px-6 py-3 mb-6">
            <FaBook className="text-blue-400" size={24} />
            <h2 className="text-3xl font-bold text-white">
              Program Pembelajaran
            </h2>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Pilih program kelas yang sesuai dengan level dan kebutuhan Anda
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {loading ? (
            <p className="col-span-2 text-center text-gray-400">Memuat kelas...</p>
          ) : error ? (
            <p className="col-span-2 text-center text-red-400">{error}</p>
          ) : kelas.length === 0 ? (
            <p className="col-span-2 text-center text-gray-400">Belum ada kelas</p>
          ) : (
            kelas.map((item, index) => (
              <div key={item.id || index} className="animate-on-load animate-fade-in delay-300">
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
                  icon={<FaPython className="text-blue-400" size={32} />}
                  whatsappNumber="6282273875270"
                  onBook={() => handleBookClass(item)}
                />
              </div>
            ))
          )}
        </div>

        {/* Info Section */}
        <div className="mt-16 bg-gray-800/30 border text-center border-gray-700/50 rounded-2xl p-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white">
            Kelas Coding Premium
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h4 className="font-semibold text-white mb-2">Materi Terkini</h4>
              <p className="text-gray-400 text-sm">Kurikulum yang selalu update mengikuti perkembangan industri</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👨‍💻</span>
              </div>
              <h4 className="font-semibold text-white mb-2">Instruktur Berpengalaman</h4>
              <p className="text-gray-400 text-sm">Dipandu oleh praktisi yang berpengalaman di bidangnya</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h4 className="font-semibold text-white mb-2">Sertifikat</h4>
              <p className="text-gray-400 text-sm">Dapatkan sertifikat setelah menyelesaikan kelas</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Courses;
