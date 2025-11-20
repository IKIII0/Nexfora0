import React from "react";
import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaWhatsapp,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 border-t border-gray-700/50 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 to-purple-900/10"></div>

      <div className="relative z-10 container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Nexfora
              </h3>
              <p className="text-gray-300 leading-relaxed text-sm">
                Platform terpadu untuk memesan kelas coding berkualitas dan jasa
                pembuatan website profesional. Wujudkan skill dan proyek impian
                Anda bersama kami.
              </p>
            </div>

            {/* Social Media */}
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800/50 rounded-full flex items-center justify-center text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 transition-all duration-300 hover:scale-110"
              >
                <FaInstagram size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800/50 rounded-full flex items-center justify-center text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 transition-all duration-300 hover:scale-110"
              >
                <FaTwitter size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800/50 rounded-full flex items-center justify-center text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 transition-all duration-300 hover:scale-110"
              >
                <FaLinkedin size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800/50 rounded-full flex items-center justify-center text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 transition-all duration-300 hover:scale-110"
              >
                <FaGithub size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6 relative">
              Quick Links
              <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mt-2"></div>
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    Home
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    About
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/courses"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    Kelas
                  </span>
                </Link>
              </li>
              <li>
                <a
                  href="#jasa"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    Jasa
                  </span>
                </a>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    Login
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6 relative">
              Layanan Kami
              <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mt-2"></div>
            </h4>
            <ul className="space-y-3">
              <li className="text-gray-400 text-sm">Kelas Python</li>
              <li className="text-gray-400 text-sm">Kelas Pascal</li>
              <li className="text-gray-400 text-sm">Jasa Website</li>
              <li className="text-gray-400 text-sm">Design Grafis</li>
              <li className="text-gray-400 text-sm">Konsultasi IT</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6 relative">
              Hubungi Kami
              <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mt-2"></div>
            </h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <FaWhatsapp className="text-green-400 flex-shrink-0" />
                <span>+62 822-7387-270</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <FaEnvelope className="text-blue-400 flex-shrink-0" />
                <span>nexfora@belumada.com</span>
              </div>
              <div className="flex items-start gap-3 text-gray-400 text-sm">
                <FaMapMarkerAlt className="text-red-400 flex-shrink-0 mt-0.5" />
                <span>Medan, Indonesia</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            <p>&copy; 2025 Nexfora. Made in 4 Naga.</p>
          </div>
          <div className="flex gap-6 text-gray-400 text-sm">
            <a
              href="#"
              className="hover:text-blue-400 transition-colors duration-300"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-blue-400 transition-colors duration-300"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="hover:text-blue-400 transition-colors duration-300"
            >
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
