import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { apiGet, apiPut } from "../utils/apiHelpers";

function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchOrderDetail(orderId, token);
  }, [orderId, navigate]);

  const fetchOrderDetail = async (orderId, token) => {
    try {
      const data = await apiGet(`/orders/${orderId}`, token);
      setOrder(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      await apiPut(`/orders/${orderId}/cancel`, {}, token);
      
      // Refresh order detail
      fetchOrderDetail(orderId, token);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-950 flex items-center justify-center">
        <div className="text-white text-xl">Memuat detail pesanan...</div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-950 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-6 py-4 rounded-lg mb-4">
            {error}
          </div>
          <button 
            onClick={() => navigate('/profile')}
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Kembali ke Profil
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Pesanan tidak ditemukan</div>
          <button 
            onClick={() => navigate('/profile')}
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Kembali ke Profil
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Selesai':
        return 'bg-green-100 text-green-800';
      case 'Dalam Proses':
        return 'bg-yellow-100 text-yellow-800';
      case 'Dibatalkan':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipeLabel = (tipe) => {
    return tipe === 'kelas' ? 'Kelas Online' : 'Jasa';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-950 text-white font-sans">
      <Navbar />
      
      <section className="container mx-auto px-6 pt-20 pb-24 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/profile')}
            className="text-blue-400 hover:text-blue-300 mb-4 inline-flex items-center"
          >
            ← Kembali ke Profil
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-blue-400">Detail Pesanan</h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Order Details Card */}
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          {/* Order Header */}
          <div className="p-6 md:p-8 border-b border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-blue-400 mb-2">
                  #{order.id_pesanan}
                </h2>
                <p className="text-gray-300">
                  Tanggal: {new Date(order.tanggal).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <span className={`px-4 py-2 inline-flex text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </div>
          </div>

          {/* Order Content */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Details */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-purple-400">Detail Produk</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-400 text-sm">Tipe Pesanan:</span>
                    <p className="text-white font-medium">{getTipeLabel(order.tipe_pemesanan)}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Nama Paket:</span>
                    <p className="text-white font-medium">{order.nama_paket}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Total Harga:</span>
                    <p className="text-2xl font-bold text-blue-400">
                      Rp {order.total.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-purple-400">Data Pelanggan</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-400 text-sm">Nama Lengkap:</span>
                    <p className="text-white font-medium">{order.nama_lengkap}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Email:</span>
                    <p className="text-white font-medium">{order.email}</p>
                  </div>
                  {order.catatan && (
                    <div>
                      <span className="text-gray-400 text-sm">Catatan:</span>
                      <p className="text-white font-medium">{order.catatan}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
                <div>
                  <span>Dibuat pada:</span>
                  <p className="text-white">
                    {new Date(order.created_at).toLocaleString('id-ID')}
                  </p>
                </div>
                {order.updated_at && (
                  <div>
                    <span>Diperbarui pada:</span>
                    <p className="text-white">
                      {new Date(order.updated_at).toLocaleString('id-ID')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              {order.status === 'Dalam Proses' && (
                <button
                  onClick={handleCancelOrder}
                  className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Batalkan Pesanan
                </button>
              )}
              <button
                onClick={() => navigate('/pesan')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Buat Pesanan Baru
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default OrderDetail;
