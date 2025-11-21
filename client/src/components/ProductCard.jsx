import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../services/authService";

const ProductCard = ({
  title,
  description,
  price,
  icon,
  whatsappNumber = "6281234567890",
}) => {
  // Fungsi untuk membuka WhatsApp dengan pesan otomatis
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      `Halo Nexfora, saya tertarik dengan layanan *${title}* (${price}). Bisa berikan informasi lebih lanjut?`
    );
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  const navigate = useNavigate();
  const location = useLocation();

  const handleBookClick = () => {
    if (!authService.isAuthenticated()) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    } else {
      navigate("/pesan")
    }
  };

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
        <div className="space-y-3">
          <button
            onClick={handleWhatsAppClick}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50"
          >
            Pesan via WhatsApp
          </button>
          {(
            <button
              onClick={handleBookClick}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50"
            >
              Pesan di Nexfora
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
