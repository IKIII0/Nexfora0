// src/components/ProductCard.jsx

import React from "react";

// Card ini dibuat transparan-gelap agar gradasi background tetap terlihat
// backdrop-blur: memberikan efek 'glassmorphism' (kaca buram)
// border-gray-700: memberikan sedikit outline agar kartu terlihat jelas
// hover:bg-gray-800/60: sedikit lebih terang saat di-hover

const ProductCard = ({ title, description, price, icon }) => {
  return (
    <div
      className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 shadow-lg backdrop-blur-sm 
                    hover:bg-gray-800/60 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20 
                    hover:-translate-y-2 transition-all duration-500 ease-out flex flex-col"
    >
      <div className="flex items-center mb-4">
        {icon}
        <h4 className="text-2xl font-semibold ml-3">{title}</h4>
      </div>
      <p className="text-gray-300 mb-4 grow">{description}</p>
      <div>
        <p className="text-lg font-medium text-blue-300 mb-4">{price}</p>
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50">
          Pesan Sekarang
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
