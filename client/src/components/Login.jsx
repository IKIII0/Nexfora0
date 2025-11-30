import React, { useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await authService.login(email, password);

      // Simpan token dan data user
      authService.setToken(response.token);
      authService.setUser({ email, role: response.role });

      // Redirect berdasarkan role atau halaman sebelumnya
      const redirectState = location.state;
      
      // Jika admin, redirect ke admin page
      if (email === 'admin@nexfora.com') {
        navigate('/admin');
        return;
      }
      
      if (redirectState?.from === "/pesan") {
        navigate("/pesan", {
          state: redirectState.booking
            ? {
                type: redirectState.booking.type,
                item: redirectState.booking.item,
              }
            : undefined,
        });
      } else {
        navigate("/");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-blue-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo/Brand + Back */}
        <div className="relative text-center mb-8 animate-on-load animate-fade-in-down">

          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500 mb-2 hover:opacity-80 transition-opacity">
            Nexfora
          </h1>
          <p className="text-gray-400">Masuk ke akun Anda</p>
        </div>

        {/* Login Card */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700 animate-on-load animate-scale-in delay-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-500"
                  placeholder="nama@email.com"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-500"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-600 bg-gray-900/50 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <span className="ml-2 text-gray-300">Ingat saya</span>
              </label>
              <a
                href="#"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Lupa password?
              </a>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-400 text-sm text-center bg-red-900/20 border border-red-800 rounded-lg p-3">
                {error}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none disabled:cursor-not-allowed"
            >
              {isLoading ? "Sedang Masuk..." : "Masuk"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-800/50 text-gray-400">
                Atau masuk dengan
              </span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-1 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-900/50 border border-gray-600 rounded-lg hover:bg-gray-700/50 transition-colors">
              <img src="google.svg" alt="" className="text-sm w-5" />
              <span className="text-sm">Google</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Belum punya akun?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Daftar sekarang
            </button>
          </p>
        </div>

      <div className="text-center mt-6 animate-on-load animate-fade-in delay-400">
  <button
   onClick={() => navigate("/")}
   className="left-0 top-1 text-gray-400 hover:text-gray-300 text-sm transition-all hover:translate-x-[-4px] duration-300">
   ← Kembali ke beranda
   </button>
        </div>
      </div>
    </div>
  );
}

export default Login;

