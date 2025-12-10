// client/src/components/Footer.jsx
import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 p-6 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <p>© {new Date().getFullYear()} JobJungle</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-white"><FaGithub size={20}/></a>
          <a href="#" className="hover:text-white"><FaLinkedin size={20}/></a>
          <a href="#" className="hover:text-white"><FaTwitter size={20}/></a>
        </div>
      </div>
    </footer>
  );
}
