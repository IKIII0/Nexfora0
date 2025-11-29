import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { apiPost } from "../utils/apiHelpers";

const Pesan = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedType = location.state?.type || "";
  const selectedItem = location.state?.item || null;

  const [tipe, setTipe] = useState(selectedType);
  const [paket, setPaket] = useState(selectedItem?.title || "");
  const [harga, setHarga] = useState(selectedItem?.price || 0);
  const [nama, setNama] = useState("");
  const [paketOptions, setPaketOptions] = useState([]);
  const [email, setEmail] = useState("");
  const [catatan, setCatatan] = useState("");

  // Pricing configuration
  const pricing = {
    kelas: {
      Python: 100000,
      "Dasar Pemrograman": 10000,
    },
    jasa: {
      "Jasa Website": 500000,
      Desain: 20000,
    },
  };

  useEffect(() => {
    if (tipe === "kelas") {
      setPaketOptions([
        { value: "Python", label: "Python" },
        { value: "Dasar Pemrograman", label: "Dasar Pemrograman" },
      ]);
      setPaket("Python");
    } else if (tipe === "jasa") {
      setPaketOptions([
        { value: "Jasa Website", label: "Jasa Website" },
        { value: "Desain", label: "Desain" },
      ]);
      setPaket("Jasa Website");
    } else {
      setPaketOptions([]);
      setPaket("");
    }
  }, [tipe]);

  // Update harga when paket changes
  useEffect(() => {
    if (tipe && paket) {
      setHarga(pricing[tipe]?.[paket] || 0);
    }
  }, [tipe, paket, pricing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Get token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Anda harus login terlebih dahulu");
      setIsLoading(false);
      navigate("/login");
      return;
    }

    try {
      const orderData = {
        tipe_pemesanan: tipe,
        nama_paket: paket,
        total: harga,
        catatan,
        nama_lengkap: nama,
        email,
      };

      console.log("Sending order data:", orderData);
      console.log("Token:", token ? "Present" : "Missing");

      const response = await apiPost("/orders", orderData, token);
      const orderId = response.data._id; // Pastikan backend mengembalikan ID order

      // Navigate to payment page with order data
      navigate("/payment", {
        state: {
          orderData: {
            _id: orderId,
            tipe_pemesanan: tipe,
            nama_paket: paket,
            total: harga,
            catatan,
            nama_lengkap: nama,
            email,
          },
        },
      });
    } catch (err) {
      console.error("Order creation error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-blue-950 text-white font-sans">
      <Navbar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <section className="container mx-auto px-6 pt-20 pb-24 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
          Form Pemesanan
        </h1>
        <p className="text-gray-300 mb-10 text-center">
          Lengkapi data berikut untuk memesan kelas atau jasa di Nexfora.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-900/60 border border-gray-700/60 rounded-2xl p-8 shadow-xl space-y-6"
        >
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Tipe Pemesanan
            </label>
            <select
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={tipe}
              onChange={(e) => setTipe(e.target.value)}
              required
              disabled={isLoading}
            >
              <option value="" disabled>
                Pilih tipe
              </option>
              <option value="kelas">Kelas</option>
              <option value="jasa">Jasa</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Nama Paket
            </label>
            <select
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={paket}
              onChange={(e) => setPaket(e.target.value)}
              required
              disabled={!tipe || isLoading}
            >
              <option value="" disabled>
                {tipe ? "Pilih paket" : "Pilih tipe terlebih dahulu"}
              </option>
              {paketOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {harga > 0 && (
            <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4">
              <p className="text-blue-300 font-medium">
                Total Harga:{" "}
                <span className="text-xl font-bold text-blue-400">
                  Rp {harga.toLocaleString("id-ID")}
                </span>
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300">
                Nama Lengkap
              </label>
              <input
                type="text"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                type="email"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Catatan Tambahan
            </label>
            <textarea
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Tuliskan kebutuhan atau preferensi khusus Anda di sini"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? "Memproses..." : "Konfirmasi Pemesanan"}
          </button>
        </form>
      </section>

      <Footer />
    </div>
  );
};

export default Pesan;
