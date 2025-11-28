import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiArrowLeft, FiCheckCircle } from "react-icons/fi";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  
  // Get order data from location state
  const orderData = location.state?.orderData || {
    tipe_pemesanan: "",
    nama_paket: "",
    total: 0,
    nama_lengkap: "",
    email: ""
  };

  // Format price to IDR
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (paymentMethod === 'bank_transfer') {
      setError("Mohon maaf, pembayaran via transfer bank belum tersedia saat ini. Silakan gunakan metode QRIS.");
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError("Anda harus login terlebih dahulu");
      setIsLoading(false);
      navigate('/login');
      return;
    }

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo, we'll just show success
      setSuccess("Pembayaran berhasil diproses!");
      
      // Redirect to profile after 2 seconds
      setTimeout(() => {
        navigate('/profile', {
          state: { 
            success: 'Pembayaran berhasil! Pesanan Anda sedang diproses.'
          } 
        });
      }, 2000);
      
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Terjadi kesalahan saat memproses pembayaran');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-950 text-white font-sans">
      <Navbar />

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-400 hover:text-blue-300 mb-8 transition-colors"
        >
          <FiArrowLeft className="mr-2" /> Kembali
        </button>

        <h1 className="text-3xl md:text-4xl font-bold mb-2">Pembayaran</h1>
        <p className="text-gray-400 mb-8">Lengkapi pembayaran untuk menyelesaikan pesanan Anda</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/60 border border-gray-700/60 rounded-2xl p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Ringkasan Pesanan</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-gray-800">
                  <span className="text-gray-400">Tipe</span>
                  <span className="font-medium">
                    {orderData.tipe_pemesanan === 'kelas' ? 'Kelas' : 'Jasa'}
                  </span>
                </div>
                
                <div className="flex justify-between py-3 border-b border-gray-800">
                  <span className="text-gray-400">Paket</span>
                  <span className="font-medium">{orderData.nama_paket}</span>
                </div>
                
                <div className="flex justify-between py-3 border-b border-gray-800">
                  <span className="text-gray-400">Nama</span>
                  <span className="font-medium">{orderData.nama_lengkap}</span>
                </div>
                
                <div className="flex justify-between py-3 border-b border-gray-800">
                  <span className="text-gray-400">Email</span>
                  <span className="font-medium">{orderData.email}</span>
                </div>
                
                {orderData.catatan && (
                  <div className="py-3 border-b border-gray-800">
                    <p className="text-gray-400 mb-1">Catatan</p>
                    <p className="text-gray-300">{orderData.catatan}</p>
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-4">
                  <span className="text-lg font-semibold">Total Pembayaran</span>
                  <span className="text-2xl font-bold text-blue-400">
                    {formatPrice(orderData.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-gray-900/60 border border-gray-700/60 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">Metode Pembayaran</h2>
              
              {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}
              
              {success ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                    <FiCheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Pembayaran Berhasil!</h3>
                  <p className="text-gray-400">Mengalihkan ke halaman profil...</p>
                </div>
              ) : (
                <form onSubmit={handlePayment}>
                  <div className="space-y-4 mb-6">
                    {/* Opsi Transfer Bank */}
                    <label className={`flex items-start p-4 border rounded-xl cursor-pointer transition-colors ${
                      paymentMethod === 'bank_transfer' ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 hover:border-gray-600'
                    }`}>
                      <input
                        type="radio"
                        className="form-radio h-5 w-5 text-blue-500 mt-1"
                        name="paymentMethod"
                        value="bank_transfer"
                        checked={paymentMethod === 'bank_transfer'}
                        onChange={() => setPaymentMethod('bank_transfer')}
                      />
                      <div className="ml-4 flex-1">
                        <div className="flex items-center">
                          <span className="font-medium">Transfer Bank</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">Transfer melalui ATM/Internet Banking/Mobile Banking</p>
                        
                        {paymentMethod === 'bank_transfer' && (
                          <div className="mt-3 p-3 bg-yellow-900/30 border border-yellow-700/50 rounded-lg text-yellow-300 text-sm">
                            <p>Fitur transfer bank akan segera tersedia. Silakan gunakan metode QRIS.</p>
                          </div>
                        )}
                      </div>
                    </label>
                    
                    {/* Opsi QRIS */}
                    <label className={`flex items-start p-4 border rounded-xl cursor-pointer transition-colors ${
                      paymentMethod === 'qris' ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 hover:border-gray-600'
                    }`}>
                      <input
                        type="radio"
                        className="form-radio h-5 w-5 text-blue-500 mt-1"
                        name="paymentMethod"
                        value="qris"
                        checked={paymentMethod === 'qris'}
                        onChange={() => setPaymentMethod('qris')}
                      />
                      <div className="ml-4 flex-1">
                        <div className="flex items-center">
                          <span className="font-medium">QRIS</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">Bayar menggunakan QRIS melalui aplikasi e-wallet</p>
                        
                        {paymentMethod === 'qris' && (
                          <div className="mt-4 p-4 bg-white rounded-lg max-w-xs">
                            <img 
                              src="/qris-placeholder.png" // Ganti dengan path ke gambar QRIS Anda
                              alt="QRIS Payment" 
                              className="w-full h-auto"
                            />
                            <p className="text-center text-gray-300 text-sm mt-3">Scan QRIS di atas menggunakan aplikasi e-wallet favorit Anda</p>
                            <p className="text-center text-gray-400 text-xs mt-2">(Contoh QRIS - ganti dengan kode QRIS yang sebenarnya)</p>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                      isLoading
                        ? 'bg-blue-700 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isLoading ? (
                      'Memproses...'
                    ) : (
                      `Bayar ${formatPrice(orderData.total)}`
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
          
          {/* Order Total */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/60 border border-gray-700/60 rounded-2xl p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Rincian Harga</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span>{formatPrice(orderData.total)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Diskon</span>
                  <span>Rp 0</span>
                </div>
                
                <div className="border-t border-gray-700 my-2"></div>
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-blue-400">{formatPrice(orderData.total)}</span>
                </div>
              </div>
              
              <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-4 text-sm text-blue-200">
                <p>Pesanan Anda akan segera diproses setelah pembayaran berhasil diverifikasi.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Payment;