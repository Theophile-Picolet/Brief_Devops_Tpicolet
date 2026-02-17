"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "World News" },
    { href: "/articles", label: "Articles" },
    { href: "/articles/category", label: "Catégories" },
    { href: "/favoris", label: "Favoris" },
    { href: "/a-propos", label: "A propos" },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-[#5C6C73] w-full">
      <nav className="container mx-auto px-4 sm:px-6 md:px-8 py-3 sm:py-4">
        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 lg:gap-10">
          {navLinks.map((link) => {
            const isActive = 
              pathname === link.href || 
              (link.href === "/articles" && pathname?.startsWith("/articles"));
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-base lg:text-lg text-gray-300 hover:text-white transition-colors ${
                    isActive
                      ? "text-white underline decoration-[#C2E0E3] underline-offset-4"
                      : ""
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="md:hidden flex items-center justify-between">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none focus:ring-2 focus:ring-[#C2E0E3] rounded p-2"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <ul className="md:hidden mt-4 space-y-3 pb-2">
            {navLinks.map((link) => {
              const isActive = 
                pathname === link.href || 
                (link.href === "/articles" && pathname?.startsWith("/articles"));
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    className={`block text-base text-gray-300 hover:text-white transition-colors py-2 ${
                      isActive
                        ? "text-white underline decoration-[#C2E0E3] underline-offset-4"
                        : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </nav>
    </header>
  );
}
