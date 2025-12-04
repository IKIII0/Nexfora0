# 🔌 Frontend Integration Guide

Panduan lengkap untuk mengintegrasikan frontend dengan backend API NEXFORA.

---

## 📁 Struktur File

```
client/src/
├── config/
│   └── api.js                 # API endpoints configuration
├── services/
│   ├── api.js                 # Axios instance dengan interceptors
│   ├── authService.js         # Auth API calls
│   ├── productService.js      # Product API calls
│   ├── categoryService.js     # Category API calls
│   ├── orderService.js        # Order API calls
│   ├── reviewService.js       # Review API calls
│   ├── dashboardService.js    # Dashboard API calls
│   └── adminService.js        # Admin API calls
```

---

## 🚀 Setup

### 1. Environment Variables

Buat file `.env` di folder `client/`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Untuk production:
```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

---

## 📝 Cara Penggunaan

### 1. **Authentication**

#### Login
```javascript
import { login } from '../services/authService';

const handleLogin = async (email, password) => {
  try {
    const response = await login(email, password);
    
    // Simpan token dan role
    localStorage.setItem('token', response.token);
    localStorage.setItem('role', response.role);
    
    // Redirect berdasarkan role
    if (response.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/dashboard');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert(error.message || 'Login gagal');
  }
};
```

#### Register
```javascript
import { register } from '../services/authService';

const handleRegister = async (userData) => {
  try {
    const response = await register(userData);
    alert('Registrasi berhasil! Silakan login.');
    navigate('/login');
  } catch (error) {
    console.error('Register error:', error);
    alert(error.message || 'Registrasi gagal');
  }
};
```

#### Logout
```javascript
const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  navigate('/login');
};
```

---

### 2. **Products**

#### Get All Products
```javascript
import { getAllProducts } from '../services/productService';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts({
          tipe: 'kelas',
          level: 'beginner',
          search: 'react'
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
```

#### Get Product by ID
```javascript
import { getProductById } from '../services/productService';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <h1>{product.nama_produk}</h1>
      <p>{product.deskripsi}</p>
      <p>Harga: Rp {product.harga.toLocaleString()}</p>
      <p>Rating: {product.rating} ⭐</p>
    </div>
  );
};
```

---

### 3. **Categories**

#### Get All Categories
```javascript
import { getAllCategories } from '../services/categoryService';

const CategoryFilter = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories('kelas');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <select>
      <option value="">Semua Kategori</option>
      {categories.map(cat => (
        <option key={cat.id} value={cat.id}>
          {cat.nama_kategori}
        </option>
      ))}
    </select>
  );
};
```

---

### 4. **Orders (Checkout)**

#### Process Checkout
```javascript
import { processCheckout } from '../services/orderService';

const CheckoutPage = () => {
  const [cart, setCart] = useState([
    { product_id: 1, quantity: 1 },
    { product_id: 2, quantity: 2 }
  ]);

  const handleCheckout = async (formData) => {
    try {
      const checkoutData = {
        product_ids: cart.map(item => item.product_id),
        quantities: cart.map(item => item.quantity),
        nama_lengkap: formData.nama_lengkap,
        email: formData.email,
        phone: formData.phone,
        payment_method: formData.payment_method,
        catatan: formData.catatan
      };

      const response = await processCheckout(checkoutData);
      
      alert(`Checkout berhasil! Kode pesanan: ${response.data.kode_pesanan}`);
      navigate(`/orders/${response.data.id_pesanan}`);
    } catch (error) {
      console.error('Checkout error:', error);
      alert(error.message || 'Checkout gagal');
    }
  };

  return (
    <form onSubmit={handleCheckout}>
      {/* Form fields */}
    </form>
  );
};
```

#### Get User Orders
```javascript
import { getUserOrders } from '../services/orderService';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getUserOrders();
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h2>Pesanan Saya</h2>
      {orders.map(order => (
        <div key={order.id_pesanan}>
          <p>Kode: {order.kode_pesanan}</p>
          <p>Total: Rp {order.total.toLocaleString()}</p>
          <p>Status: {order.status}</p>
        </div>
      ))}
    </div>
  );
};
```

#### Upload Payment Proof
```javascript
import { uploadPaymentProof } from '../services/orderService';

const UploadPayment = ({ orderId }) => {
  const handleUpload = async (imageUrl) => {
    try {
      const response = await uploadPaymentProof(orderId, imageUrl);
      alert('Bukti pembayaran berhasil diupload!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload gagal');
    }
  };

  return (
    <div>
      {/* Upload form */}
    </div>
  );
};
```

---

### 5. **Reviews**

#### Get Product Reviews
```javascript
import { getProductReviews } from '../services/reviewService';

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getProductReviews(productId);
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [productId]);

  return (
    <div>
      <h3>Reviews</h3>
      {reviews.map(review => (
        <div key={review.id}>
          <p>{review.user_name}</p>
          <p>Rating: {review.rating} ⭐</p>
          <p>{review.comment}</p>
          {review.is_verified && <span>✓ Verified Purchase</span>}
        </div>
      ))}
    </div>
  );
};
```

#### Create Review
```javascript
import { createReview } from '../services/reviewService';

const ReviewForm = ({ productId, orderId }) => {
  const handleSubmit = async (formData) => {
    try {
      const reviewData = {
        product_id: productId,
        order_id: orderId,
        rating: formData.rating,
        comment: formData.comment
      };

      const response = await createReview(reviewData);
      alert('Review berhasil dibuat!');
    } catch (error) {
      console.error('Review error:', error);
      alert(error.message || 'Gagal membuat review');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
};
```

---

### 6. **Dashboard**

#### User Dashboard
```javascript
import { getUserDashboard } from '../services/dashboardService';

const UserDashboard = () => {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await getUserDashboard();
        setDashboard(response.data);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
      }
    };

    fetchDashboard();
  }, []);

  if (!dashboard) return <div>Loading...</div>;

  return (
    <div>
      <h2>Dashboard</h2>
      <div>
        <p>Total Pesanan: {dashboard.stats.total_orders}</p>
        <p>Pesanan Selesai: {dashboard.stats.completed_orders}</p>
        <p>Total Pengeluaran: Rp {dashboard.stats.total_spent.toLocaleString()}</p>
      </div>
      
      <h3>Pesanan Terbaru</h3>
      {dashboard.recent_orders.map(order => (
        <div key={order.id_pesanan}>
          <p>{order.kode_pesanan} - {order.status}</p>
        </div>
      ))}
    </div>
  );
};
```

---

### 7. **Admin**

#### Admin Dashboard
```javascript
import { getAdminDashboard } from '../services/adminService';

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await getAdminDashboard();
        setDashboard(response.data);
      } catch (error) {
        console.error('Error fetching admin dashboard:', error);
      }
    };

    fetchDashboard();
  }, []);

  if (!dashboard) return <div>Loading...</div>;

  return (
    <div>
      <h2>Admin Dashboard</h2>
      
      <div>
        <h3>Revenue</h3>
        <p>Total: Rp {dashboard.revenue.total.toLocaleString()}</p>
        <p>Bulan Ini: Rp {dashboard.revenue.monthly.toLocaleString()}</p>
      </div>
      
      <div>
        <h3>Orders</h3>
        <p>Total: {dashboard.orders.total_orders}</p>
        <p>Selesai: {dashboard.orders.completed_orders}</p>
        <p>Pending: {dashboard.orders.pending_orders}</p>
      </div>
      
      <div>
        <h3>Top Products</h3>
        {dashboard.top_products.map(product => (
          <div key={product.id}>
            <p>{product.nama_produk} - {product.total_sold} terjual</p>
          </div>
        ))}
      </div>
    </div>
  );
};
```

#### Verify Order
```javascript
import { verifyOrder } from '../services/adminService';

const OrderManagement = () => {
  const handleVerify = async (orderId) => {
    try {
      const response = await verifyOrder(orderId);
      alert('Pesanan berhasil diverifikasi!');
      // Refresh orders list
    } catch (error) {
      console.error('Verify error:', error);
      alert('Gagal memverifikasi pesanan');
    }
  };

  return (
    <button onClick={() => handleVerify(orderId)}>
      Verifikasi Pesanan
    </button>
  );
};
```

---

## 🔒 Protected Routes

### Contoh Protected Route Component

```javascript
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
```

### Penggunaan di Routes

```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<ProductList />} />
        
        {/* Protected user routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/orders" 
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          } 
        />
        
        {/* Protected admin routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 🎨 Error Handling

### Global Error Handler

```javascript
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return data.message || 'Bad request';
      case 401:
        localStorage.removeItem('token');
        window.location.href = '/login';
        return 'Session expired. Please login again.';
      case 403:
        return 'Access denied';
      case 404:
        return 'Resource not found';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return data.message || 'An error occurred';
    }
  } else if (error.request) {
    // Request made but no response
    return 'Network error. Please check your connection.';
  } else {
    // Something else happened
    return error.message || 'An error occurred';
  }
};
```

---

## 📱 Loading States

### Example Loading Component

```javascript
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

// Usage
const ProductList = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await getAllProducts();
        setProducts(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <LoadingSpinner />;

  return <div>{/* Product list */}</div>;
};
```

---

## 🔄 Data Refresh

### Auto Refresh dengan Interval

```javascript
useEffect(() => {
  const fetchOrders = async () => {
    const response = await getUserOrders();
    setOrders(response.data);
  };

  // Initial fetch
  fetchOrders();

  // Refresh every 30 seconds
  const interval = setInterval(fetchOrders, 30000);

  return () => clearInterval(interval);
}, []);
```

---

## 📝 Notes

1. **Token Management**: Token disimpan di localStorage dan otomatis ditambahkan ke setiap request
2. **Error Handling**: Semua error dari API akan di-catch dan bisa ditampilkan ke user
3. **Loading States**: Selalu gunakan loading state untuk UX yang lebih baik
4. **Protected Routes**: Gunakan ProtectedRoute component untuk route yang memerlukan autentikasi
5. **Admin Routes**: Tambahkan check `adminOnly` untuk route khusus admin

---

**Last Updated:** December 4, 2024
