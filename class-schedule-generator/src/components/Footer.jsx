import React from 'react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { SiReact, SiVite, SiTailwindcss } from 'react-icons/si';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-3 mt-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <p>Developed by Roberto Prisoris</p>
            <div className="flex space-x-2">
              <a
                href="https://www.facebook.com/roberto.prisoris"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-400 transition-colors"
              >
                <FaFacebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/me_robbb/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-400 transition-colors"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs">Built with:</span>
            <SiReact className="w-4 h-4 text-[#61DAFB]" />
            <SiVite className="w-4 h-4 text-[#646CFF]" />
            <SiTailwindcss className="w-4 h-4 text-[#38B2AC]" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
