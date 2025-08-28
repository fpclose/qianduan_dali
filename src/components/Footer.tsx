import React from 'react';

const Footer = () => {
  return (
    <footer className="fixed bottom-0 w-full backdrop-blur-md bg-transparent">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-white/80 hover:text-white transition-colors duration-200">
          © 2023-2026 理大 CTF 终端 | ICP备案 123456789号
        </p>
      </div>
    </footer>
  );
};

export default Footer;