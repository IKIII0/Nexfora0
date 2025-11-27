import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Pesan = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const selectedType = location.state?.type || "";
  const selectedItem = location.state?.item || null;

  const [tipe, setTipe] = useState(selectedType);
  const [paket, setPaket] = useState(selectedItem?.title || "");
  // const [harga, setHarga] = useState(selectedItem?.price || "");
  const [nama, setNama] = useState("");
  const [paketOptions, setPaketOptions] = useState([]);
  const [email, setEmail] = useState("");
  const [catatan, setCatatan] = useState("");

  useEffect(() => {
    if (tipe === 'kelas') {
      setPaketOptions([
        { value: 'Python', label: 'Python' },
        { value: 'Dasar Pemrograman', label: 'Dasar Pemrograman' }
      ]);
      setPaket('Python');
    } else if (tipe === 'jasa') {
      setPaketOptions([
        { value: 'Jasa Website', label: 'Jasa Website' },
        { value: 'Desain', label: 'Desain' }
      ]);
      setPaket('Jasa Website');
    } else {
      setPaketOptions([]);
      setPaket('');
    }
  }, [tipe]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // alert(
    //   `Pemesanan berhasil!\n\nTipe: ${tipe}\nPaket: ${paket}\nHarga: ${harga}\nNama: ${nama}\nEmail: ${email}\nCatatan: ${catatan}`
    // );
    navigate("/");
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
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Tipe Pemesanan
            </label>
            <select
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={tipe}
              onChange={(e) => setTipe(e.target.value)}
              required
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
              disabled={!tipe}
            >
              <option value="" disabled>
                {tipe ? 'Pilih paket' : 'Pilih tipe terlebih dahulu'}
              </option>
              {paketOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

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
            />
          </div>

          <button
            type="submit"
            className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/40"
          >
            Konfirmasi Pemesanan
          </button>
        </form>
      </section>

      <Footer />
    </div>
  );
};

export default Pesan;

