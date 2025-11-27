import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar"; 
import Footer from "../components/Footer";

function UserProfile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      // Redirect to login if not logged in
      navigate('/login');
      return;
    }

    // Format the user data with default values if needed
    const formattedUser = {
      fullName: userData.nama_lengkap || userData.email?.split('@')[0] || 'Pengguna',
      email: userData.email || 'email@example.com',
      joinedDate: userData.joinedDate || new Date().toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      orders: userData.orders || [
        { id: 1, date: '2023-11-20', status: 'Selesai', total: 'Rp 250.000' },
        { id: 2, date: '2023-11-15', status: 'Dalam Proses', total: 'Rp 180.000' },
        { id: 3, date: '2023-11-10', status: 'Dibatalkan', total: 'Rp 320.000' },
      ],
      profilePicture: userData.profilePicture || ''
    };

    setUser(formattedUser);
    setIsLoading(false);
  }, [navigate]);

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
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-purple-400">Detail Akun</h2>
              <ul className="space-y-3 text-gray-300">
                <li>
                  <span className="font-medium text-blue-300">Bergabung Sejak:</span> {user.joinedDate}
                </li>
              </ul>
              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4 text-purple-400">Riwayat Pesanan</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID Pesanan</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tanggal</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {user.orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-700/50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">#{order.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.status === 'Selesai' ? 'bg-green-100 text-green-800' :
                              order.status === 'Dalam Proses' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.total}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              onClick={() => navigate(`/order/${order.id}`)}
                              className="text-blue-400 hover:text-blue-300 mr-4"
                            >
                              Lihat Detail
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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