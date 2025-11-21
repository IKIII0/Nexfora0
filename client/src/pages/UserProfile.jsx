import React from "react";
import Navbar from "../components/Navbar"; 
import Footer from "../components/Footer"; 

function UserProfile() {
  const user = {
    fullName: "Willy wonka",
    email: "willll@example.com",
    joinedDate: "10 Januari 2023",
    coursesEnrolled: 3,
    projectsCompleted: 2,
    profilePicture: "",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-950 text-white font-sans">
      <Navbar />
      <div className="container mx-auto px-6 py-12 md:py-20">
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="p-8 md:p-12 border-b border-gray-700 text-center">
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-blue-500 shadow-lg"
            />
            <h1 className="text-4xl font-bold mb-2 text-blue-400">{user.fullName}</h1>
            <p className="text-xl text-gray-300">{user.email}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12">
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-purple-400">Tentang Saya</h2>
              <p className="text-gray-300 leading-relaxed">
                {user.bio}
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-purple-400">Detail Akun</h2>
              <ul className="space-y-3 text-gray-300">
                <li>
                  <span className="font-medium text-blue-300">Bergabung Sejak:</span> {user.joinedDate}
                </li>
                <li>
                  <span className="font-medium text-blue-300">Kelas Diikuti:</span> {user.coursesEnrolled}
                </li>
                <li>
                  <span className="font-medium text-blue-300">Proyek Selesai:</span> {user.projectsCompleted}
                </li>
              </ul>
              <div className="mt-8 flex justify-center md:justify-start">
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 hover:scale-105 shadow-md">
                  Edit Profil
                </button>
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