'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MobileMenuProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, toggleMenu }) => {
  const pathname = usePathname();

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={toggleMenu}
        aria-hidden="true"
      ></div>

      {/* Mobile menu content */}
      <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl flex flex-col overflow-y-auto">
        <div className="p-4 flex items-center justify-between border-b">
          <h2 className="text-xl font-bold text-indigo-600">GeeKtooL</h2>
          <button
            onClick={toggleMenu}
            className="text-gray-600 focus:outline-none"
            aria-label="Close menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <nav className="px-4 py-6 space-y-6">
          <Link
            href="/"
            className={`block text-lg ${
              pathname === '/'
                ? 'text-indigo-600 font-medium'
                : 'text-gray-600 hover:text-indigo-600'
            }`}
            onClick={toggleMenu}
          >
            首頁
          </Link>
          <Link
            href="https://geekt.tool/apps"
            className={`block text-lg ${
              pathname === '/apps' || pathname.startsWith('/apps/')
                ? 'text-indigo-600 font-medium'
                : 'text-gray-600 hover:text-indigo-600'
            }`}
            onClick={toggleMenu}
          >
            小工具庫
          </Link>
          <Link
            href="https://geekt.tool/about"
            className={`block text-lg ${
              pathname === '/about'
                ? 'text-indigo-600 font-medium'
                : 'text-gray-600 hover:text-indigo-600'
            }`}
            onClick={toggleMenu}
          >
            關於我們
          </Link>
          <Link
            href="https://geekt.tool/contact"
            className={`block text-lg ${
              pathname === '/contact'
                ? 'text-indigo-600 font-medium'
                : 'text-gray-600 hover:text-indigo-600'
            }`}
            onClick={toggleMenu}
          >
            聯絡我們
          </Link>
          <Link
            href="https://geekt.tool/submit"
            className={`block text-lg ${
              pathname === '/submit'
                ? 'text-indigo-600 font-medium'
                : 'text-gray-600 hover:text-indigo-600'
            }`}
            onClick={toggleMenu}
          >
            提交需求
          </Link>
          <Link
            href="https://geekt.tool/faq"
            className={`block text-lg ${
              pathname === '/faq'
                ? 'text-indigo-600 font-medium'
                : 'text-gray-600 hover:text-indigo-600'
            }`}
            onClick={toggleMenu}
          >
            常見問題
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu; 
