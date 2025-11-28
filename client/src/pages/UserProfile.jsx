import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar"; 
import Footer from "../components/Footer";
import { apiGet, apiPut } from "../utils/apiHelpers";

function UserProfile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for success message from navigation state
    if (location.state?.success) {
      setSuccess(location.state.success);
      // Clear the state to prevent showing it again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    // Check if user is logged in
    const userData = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      // Redirect to login if not logged in
      navigate('/login');
      return;
    }

    // Format the user data
    const formattedUser = {
      fullName: userData.nama_lengkap || userData.email?.split('@')[0] || 'Pengguna',
      email: userData.email || 'email@example.com',
      joinedDate: userData.joinedDate || new Date().toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      profilePicture: userData.profilePicture || ''
    };

    setUser(formattedUser);
    
    // Fetch user orders
    fetchOrders(token);
  }, [navigate]);

  const fetchOrders = async (token) => {
    try {
      const data = await apiGet('/orders', token);
      setOrders(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      await apiPut(`/orders/${orderId}/cancel`, {}, token);
      
      // Refresh orders
      fetchOrders(token);
      setSuccess('Pesanan berhasil dibatalkan');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      // Clear error message after 3 seconds
      setTimeout(() => setError(''), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-950 flex items-center justify-center">
        <div className="text-white text-xl">Memuat profil...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-950 text-white font-sans">
      <Navbar />
      <div className="container mx-auto px-6 py-12 md:py-20">
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="p-8 md:p-12 border-b border-gray-700 text-center">
            <div className="relative">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-blue-500 shadow-lg object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-blue-500 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-4xl font-bold text-white">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </div>
            <h1 className="text-4xl font-bold mb-2 text-blue-400">{user.fullName}</h1>
            <p className="text-xl text-gray-300">{user.email}</p>
          </div>
          <div className="p-8 md:p-12">
            {/* Success Message */}
            {success && (
              <div className="mb-6 bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-purple-400">Detail Akun</h2>
              <ul className="space-y-3 text-gray-300">
                <li>
                  <span className="font-medium text-blue-300">Bergabung Sejak:</span> {user.joinedDate}
                </li>
              </ul>
              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4 text-purple-400">Riwayat Pesanan</h2>
                {orders.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <p>Belum ada pesanan</p>
                    <button 
                      onClick={() => navigate('/pesan')}
                      className="mt-4 text-blue-400 hover:text-blue-300 underline"
                    >
                      Buat Pesanan Sekarang
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                      <thead className="bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID Pesanan</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tanggal</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tipe</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Paket</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Total</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {orders.map((order) => (
                          <tr key={order.id_pesanan} className="hover:bg-gray-700/50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">#{order.id_pesanan}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {new Date(order.tanggal).toLocaleDateString('id-ID')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 capitalize">{order.tipe_pemesanan}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.nama_paket}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                order.status === 'Selesai' ? 'bg-green-100 text-green-800' :
                                order.status === 'Dalam Proses' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              Rp {order.total.toLocaleString('id-ID')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button 
                                onClick={() => navigate(`/order/${order.id_pesanan}`)}
                                className="text-blue-400 hover:text-blue-300 mr-4"
                              >
                                Lihat Detail
                              </button>
                              {order.status === 'Dalam Proses' && (
                                <button 
                                  onClick={() => handleCancelOrder(order.id_pesanan)}
                                  className="text-red-400 hover:text-red-300"
                                >
                                  Batalkan
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div className="mt-6 flex justify-center md:justify-start">
                  <button 
                    onClick={() => navigate('/edit-profile')}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 hover:scale-105 shadow-md"
                  >
                    Edit Profil
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default UserProfile;