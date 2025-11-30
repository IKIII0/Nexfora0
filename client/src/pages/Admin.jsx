import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiShoppingBag, FiCheckCircle, FiClock, FiXCircle, FiLogOut, FiRefreshCw, FiFilter } from "react-icons/fi";

const Admin = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all, pending, completed, cancelled
  const [refreshKey, setRefreshKey] = useState(0);

  // Check if user is admin
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.email !== 'admin@nexfora.com') {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [navigate, refreshKey]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token tidak ditemukan');
      }

      console.log('Fetching admin orders...');
      const response = await fetch('/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const contentType = response.headers.get('content-type');
      console.log('Content-Type:', contentType);
      
      if (!contentType || !contentType.includes('application/json')) {
        const errorText = await response.text();
        console.error('Non-JSON response:', errorText);
        throw new Error('Server mengembalikan response yang tidak valid');
      }

      const data = await response.json();
      console.log('Received data:', data);
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Fetch orders error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/orders/${orderId}/verify`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Verify error:', errorText);
        throw new Error('Gagal memverifikasi pesanan');
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        await response.json();
      }
      
      // Refresh orders
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      console.error('Verify order error:', err);
      setError(err.message);
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Cancel error:', errorText);
        throw new Error('Gagal membatalkan pesanan');
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        await response.json();
      }
      
      // Refresh orders
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      console.error('Cancel order error:', err);
      setError(err.message);
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'pending') return order.status === 'Dalam Proses';
    if (filter === 'completed') return order.status === 'Selesai';
    if (filter === 'cancelled') return order.status === 'Dibatalkan';
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Dalam Proses': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/50';
      case 'Selesai': return 'text-green-400 bg-green-400/20 border-green-400/50';
      case 'Dibatalkan': return 'text-red-400 bg-red-400/20 border-red-400/50';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Dalam Proses': return <FiClock className="w-4 h-4" />;
      case 'Selesai': return <FiCheckCircle className="w-4 h-4" />;
      case 'Dibatalkan': return <FiXCircle className="w-4 h-4" />;
      default: return <FiClock className="w-4 h-4" />;
    }
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'Dalam Proses').length,
    completed: orders.filter(o => o.status === 'Selesai').length,
    cancelled: orders.filter(o => o.status === 'Dibatalkan').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-950 text-white font-sans">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-4">Memuat data admin...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-950 text-white font-sans">
      {/* Simple Admin Header */}
      <div className="bg-gray-800/80 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-400 text-sm">Kelola dan verifikasi pesanan</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
            >
              <FiLogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900/60 border border-gray-700/60 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Pesanan</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FiShoppingBag className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-gray-900/60 border border-gray-700/60 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Menunggu Verifikasi</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
              </div>
              <FiClock className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          
          <div className="bg-gray-900/60 border border-gray-700/60 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Selesai</p>
                <p className="text-2xl font-bold text-green-400">{stats.completed}</p>
              </div>
              <FiCheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-gray-900/60 border border-gray-700/60 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Dibatalkan</p>
                <p className="text-2xl font-bold text-red-400">{stats.cancelled}</p>
              </div>
              <FiXCircle className="w-8 h-8 text-red-400" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Filter and Refresh */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FiFilter className="w-4 h-4 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="all">Semua Pesanan</option>
                <option value="pending">Menunggu Verifikasi</option>
                <option value="completed">Selesai</option>
                <option value="cancelled">Dibatalkan</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={() => setRefreshKey(prev => prev + 1)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
          >
            <FiRefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Orders Table */}
        <div className="bg-gray-900/60 border border-gray-700/60 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/60 border-b border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    ID Pesanan
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Pelanggan
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Paket
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
                      {filter === 'all' ? 'Belum ada pesanan' : `Tidak ada pesanan dengan status ${filter}`}
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id_pesanan} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        #{order.id_pesanan}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium">{order.nama_lengkap}</div>
                          <div className="text-sm text-gray-400">{order.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm">{order.nama_paket}</div>
                          <div className="text-xs text-gray-400 capitalize">{order.tipe_pemesanan}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-400">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status === 'Dalam Proses' ? 'Menunggu Verifikasi' : order.status === 'Selesai' ? 'Selesai' : 'Dibatalkan'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          {order.status === 'Dalam Proses' && (
                            <>
                              <button
                                onClick={() => handleVerifyOrder(order.id_pesanan)}
                                className="text-green-400 hover:text-green-300 transition-colors"
                                title="Verifikasi Pesanan"
                              >
                                <FiCheckCircle className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleCancelOrder(order.id_pesanan)}
                                className="text-red-400 hover:text-red-300 transition-colors"
                                title="Batalkan Pesanan"
                              >
                                <FiXCircle className="w-5 h-5" />
                              </button>
                            </>
                          )}
                          {order.status === 'Selesai' && (
                            <span className="text-green-400 text-xs">Terverifikasi</span>
                          )}
                          {order.status === 'Dibatalkan' && (
                            <span className="text-red-400 text-xs">Dibatalkan</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
