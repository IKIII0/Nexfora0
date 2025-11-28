import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import Courses from "./pages/Courses.jsx";
import Jasa from "./pages/Jasa.jsx";
import Pesan from "./pages/Pesan.jsx";
import UserProfile from "./pages/UserProfile";
import OrderDetail from "./pages/OrderDetail";
import Login from "./components/Login";
import Register from "./components/Register";
import ApiTest from "./debug/ApiTest";
import "./index.css";

// Komponen untuk memproteksi route
const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/jasa" element={<Jasa />} />
      <Route path="/pesan" element={<Pesan />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/debug" element={<ApiTest />} />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/order/:orderId" 
        element={
          <ProtectedRoute>
            <OrderDetail />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;