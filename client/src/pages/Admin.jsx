import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiShoppingBag, FiCheckCircle, FiClock, FiXCircle, FiLogOut, FiRefreshCw, FiFilter, FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import { API_CONFIG, createApiCall } from "../utils/apiConfig";

const Admin = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all, pending, completed, cancelled
  const [refreshKey, setRefreshKey] = useState(0);
  
  // State untuk form tambah kategori
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    nama_kategori: "",
    deskripsi: "",
    tipe: "kelas", // kelas or jasa
    is_active: true
  });

  // State untuk layanan/produk
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [editProductModalOpen, setEditProductModalOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    id: null,
    nama_produk: "",
    deskripsi: "",
    harga: "",
    durasi: "",
    level: "beginner",
    max_peserta: "",
    stok: "",
    is_active: true
  });

  // Check if user is admin
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.email !== 'admin@nexfora.com') {
      navigate('/login');
      return;
    }
    fetchOrders();
    fetchProducts();
    fetchCategories();
  }, [navigate, refreshKey]);

  // Refresh products automatically when category filter changes
  useEffect(() => {
    fetchProducts();
  }, [selectedCategoryId]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      console.log('=== Frontend Debug ===');
      console.log('Token exists:', !!token);
      console.log('Token length:', token?.length || 0);
      console.log('Token:', token?.slice(0, 50) + '...');
      console.log('User:', user);
      
      if (!token) {
        throw new Error('Token tidak ditemukan');
      }

      console.log('Fetching admin orders...');
      const data = await createApiCall(API_CONFIG.endpoints.adminOrders);
      console.log('Received data:', data);
      // Backend mengirimkan bentuk { status, code, message, data }
      setOrders(Array.isArray(data) ? data : (data.data || data.orders || []));
    } catch (err) {
      console.error('Fetch orders error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle aktif/nonaktif layanan
  const handleToggleActive = async (product) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token tidak ditemukan');

      const res = await fetch(`${API_CONFIG.baseURL}/api/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is_active: !product.is_active })
      });
      if (!res.ok) {
        const er = await res.json().catch(() => ({}));
        throw new Error(er.message || 'Gagal mengubah status layanan');
      }
      await fetchProducts();
    } catch (e) {
      console.error('Toggle active error:', e);
      setError(e.message);
    }
  };

  // Hapus layanan
  const handleDeleteProduct = async (product) => {
    try {
      if (!window.confirm(`Hapus layanan "${product.nama_produk}"?`)) return;
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token tidak ditemukan');
      const res = await fetch(`${API_CONFIG.baseURL}/api/products/${product.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        const er = await res.json().catch(() => ({}));
        throw new Error(er.message || 'Gagal menghapus layanan');
      }
      await fetchProducts();
    } catch (e) {
      console.error('Delete product error:', e);
      setError(e.message);
    }
  };

  const handleVerifyOrder = async (orderId) => {
    try {
      await createApiCall(API_CONFIG.endpoints.verifyOrder(orderId), {
        method: 'PUT'
      });
      
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
      await createApiCall(API_CONFIG.endpoints.cancelOrder(orderId), {
        method: 'PUT'
      });
      
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

  // Fetch daftar layanan/produk
  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token tidak ditemukan');
      const params = new URLSearchParams();
      if (selectedCategoryId) {
        params.append('category_id', selectedCategoryId);
      }
      // Admin harus bisa melihat layanan yang nonaktif juga
      params.append('include_inactive', 'true');
      const url = `${API_CONFIG.baseURL}/api/products?${params.toString()}`;
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const er = await res.json().catch(() => ({}));
        throw new Error(er.message || 'Gagal mengambil data layanan');
      }
      const data = await res.json();
      // Backend mengirimkan bentuk { status, code, message, data }
      const items = Array.isArray(data) ? data : (data.data || data.products || []);
      setProducts(items);
    } catch (e) {
      console.error('Fetch products error:', e);
      setError(e.message);
    } finally {
      setProductsLoading(false);
    }
  };

  // Fetch categories for services list
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token tidak ditemukan');

      const res = await fetch(API_CONFIG.endpoints.getCategories, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const er = await res.json().catch(() => ({}));
        throw new Error(er.message || 'Gagal mengambil kategori');
      }
      const data = await res.json();
      const items = Array.isArray(data) ? data : (data.data || data.categories || []);
      setCategories(items.filter(c => c.is_active !== false));
    } catch (e) {
      console.error('Fetch categories error:', e);
      // Jangan override error utama jika sudah ada
      if (!error) setError(e.message);
    }
  };

  const handleOpenEditProduct = (product) => {
    setProductForm({
      id: product.id,
      nama_produk: product.nama_produk || "",
      deskripsi: product.deskripsi || "",
      harga: String(product.harga ?? ""),
      durasi: product.durasi || "",
      level: product.level || "beginner",
      max_peserta: String(product.max_peserta ?? ""),
      stok: String(product.stok ?? ""),
      is_active: Boolean(product.is_active)
    });
    setEditProductModalOpen(true);
  };

  const handleEditProductChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token tidak ditemukan');
      if (!productForm.id) throw new Error('Produk tidak valid');

      const payload = {
        nama_produk: productForm.nama_produk,
        deskripsi: productForm.deskripsi,
        harga: parseFloat(productForm.harga || 0),
        durasi: productForm.durasi,
        level: productForm.level || null,
        max_peserta: productForm.max_peserta ? parseInt(productForm.max_peserta) : null,
        stok: productForm.stok ? parseInt(productForm.stok) : 0,
        is_active: !!productForm.is_active
      };

      const res = await fetch(`${API_CONFIG.baseURL}/api/products/${productForm.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const er = await res.json().catch(() => ({}));
        throw new Error(er.message || 'Gagal memperbarui layanan');
      }

      setEditProductModalOpen(false);
      setProductForm({
        id: null, nama_produk: "", deskripsi: "", harga: "", durasi: "",
        level: "beginner", max_peserta: "", stok: "", is_active: true
      });
      await fetchProducts();
      alert('Layanan berhasil diperbarui');
    } catch (e) {
      console.error('Update product error:', e);
      setError(e.message);
    }
  };

  // Handler untuk input form kategori
  const handleCategoryInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCategoryForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handler untuk submit form kategori
  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token tidak ditemukan');
      }

      const response = await fetch(`${API_CONFIG.baseURL}/api/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(categoryForm)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Gagal menambahkan kategori');
      }

      // Reset form dan tutup modal
      setCategoryForm({
        nama_kategori: "",
        deskripsi: "",
        tipe: "kelas",
        is_active: true
      });
      setIsCategoryModalOpen(false);
      
      // Refresh daftar
      setRefreshKey(prev => prev + 1);
      
      alert('Kategori berhasil ditambahkan!');
    } catch (err) {
      console.error('Add category error:', err);
      setError(err.message);
    }
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

  const isPendingStatus = (status) => {
    return status === 'Dalam Proses' || status === 'Menunggu Pembayaran';
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'pending') return isPendingStatus(order.status);
    if (filter === 'completed') return order.status === 'Selesai';
    if (filter === 'cancelled') return order.status === 'Dibatalkan';
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Menunggu Pembayaran':
      case 'Dalam Proses':
        return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/50';
      case 'Selesai':
        return 'text-green-400 bg-green-400/20 border-green-400/50';
      case 'Dibatalkan':
        return 'text-red-400 bg-red-400/20 border-red-400/50';
      default:
        return 'text-gray-400 bg-gray-400/20 border-gray-400/50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Menunggu Pembayaran':
      case 'Dalam Proses':
        return <FiClock className="w-4 h-4" />;
      case 'Selesai':
        return <FiCheckCircle className="w-4 h-4" />;
      case 'Dibatalkan':
        return <FiXCircle className="w-4 h-4" />;
      default:
        return <FiClock className="w-4 h-4" />;
    }
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => isPendingStatus(o.status)).length,
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
            <div className="flex gap-4">
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                Tambah Kategori
              </button>
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

      {/* Modal Edit Layanan */}
      {editProductModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Edit Layanan/Kelas</h3>
                <button 
                  onClick={() => setEditProductModalOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUpdateProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nama</label>
                  <input
                    type="text"
                    name="nama_produk"
                    value={productForm.nama_produk}
                    onChange={handleEditProductChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Deskripsi</label>
                  <textarea
                    name="deskripsi"
                    value={productForm.deskripsi}
                    onChange={handleEditProductChange}
                    rows={3}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Harga (IDR)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-400">Rp</span>
                      </div>
                      <input
                        type="number"
                        name="harga"
                        value={productForm.harga}
                        onChange={handleEditProductChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Durasi</label>
                    <input
                      type="text"
                      name="durasi"
                      value={productForm.durasi}
                      onChange={handleEditProductChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Contoh: 3 bulan / 10 sesi"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Level</label>
                    <select
                      name="level"
                      value={productForm.level}
                      onChange={handleEditProductChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="beginner">Pemula</option>
                      <option value="intermediate">Menengah</option>
                      <option value="advanced">Lanjutan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Stok</label>
                    <input
                      type="number"
                      name="stok"
                      value={productForm.stok}
                      onChange={handleEditProductChange}
                      min="0"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Maks. Peserta</label>
                    <input
                      type="number"
                      name="max_peserta"
                      value={productForm.max_peserta}
                      onChange={handleEditProductChange}
                      min="1"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_active"
                      name="is_active"
                      checked={productForm.is_active}
                      onChange={handleEditProductChange}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="is_active" className="ml-2 text-sm font-medium">
                      Aktif
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-700 mt-6">
                  <button
                    type="button"
                    onClick={() => setEditProductModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </div>
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
                          {order.status === 'Menunggu Pembayaran'
                            ? 'Menunggu Pembayaran'
                            : order.status === 'Dalam Proses'
                            ? 'Menunggu Verifikasi'
                            : order.status === 'Selesai'
                            ? 'Selesai'
                            : 'Dibatalkan'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          {isPendingStatus(order.status) && (
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

      {/* Daftar Layanan/Kelas */}
      <div className="mt-8 bg-gray-800/40 border border-gray-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FiShoppingBag className="w-5 h-5" /> Daftar Layanan/Kelas
          </h2>
          <div className="flex items-center gap-3">
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nama_kategori} ({cat.tipe})
                </option>
              ))}
            </select>
            <button
              onClick={() => setRefreshKey(prev => prev + 1)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg text-sm"
            >
              <FiRefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr className="text-left text-gray-300 text-sm">
                <th className="px-4 py-2">Nama</th>
                <th className="px-4 py-2">Harga</th>
                <th className="px-4 py-2">Durasi</th>
                <th className="px-4 py-2">Level</th>
                <th className="px-4 py-2">Stok</th>
                <th className="px-4 py-2">Aktif</th>
                <th className="px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {productsLoading ? (
                <tr><td colSpan={7} className="px-4 py-6 text-center text-gray-400">Memuat layanan...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-6 text-center text-gray-400">Belum ada layanan</td></tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="text-sm">
                    <td className="px-4 py-3 font-medium">{p.nama_produk}</td>
                    <td className="px-4 py-3">{formatPrice(Number(p.harga || 0))}</td>
                    <td className="px-4 py-3">{p.durasi || '-'}</td>
                    <td className="px-4 py-3">{p.level || '-'}</td>
                    <td className="px-4 py-3">{p.stok ?? 0}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${p.is_active ? 'bg-green-600/20 text-green-400' : 'bg-gray-600/20 text-gray-300'}`}>
                        {p.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditProduct(p)}
                          className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 px-3 py-1.5 rounded"
                        >
                          <FiEdit className="w-4 h-4" /> Edit
                        </button>
                        <button
                          onClick={() => handleToggleActive(p)}
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded ${p.is_active ? 'bg-gray-600 hover:bg-gray-700' : 'bg-green-600 hover:bg-green-700'}`}
                        >
                          {p.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p)}
                          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded"
                        >
                          <FiTrash2 className="w-4 h-4" /> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Kategori */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Tambah Kategori Baru</h3>
                <button 
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nama Kategori</label>
                  <input
                    type="text"
                    name="nama_kategori"
                    value={categoryForm.nama_kategori}
                    onChange={handleCategoryInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Contoh: Web Development"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Tipe</label>
                  <select
                    name="tipe"
                    value={categoryForm.tipe}
                    onChange={handleCategoryInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="kelas">Kelas</option>
                    <option value="jasa">Jasa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Deskripsi</label>
                  <textarea
                    name="deskripsi"
                    value={categoryForm.deskripsi}
                    onChange={handleCategoryInputChange}
                    rows={3}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Jelaskan kategori ini"
                    required
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={categoryForm.is_active}
                    onChange={handleCategoryInputChange}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="is_active" className="ml-2 text-sm font-medium">
                    Aktif
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-700 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Simpan Kategori
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
