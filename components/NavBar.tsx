import { useState, useEffect } from "react";
import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#about", label: "About" },
    { href: "#academics", label: "Academics" },
    { href: "#admissions", label: "Admissions" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white text-gray-800 shadow-lg"
          : "bg-transparent text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold">
              TBC
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium hover:text-red-500 transition duration-300"
              >
                {link.label}
              </a>
            ))}
            <div className="ml-4">
              <SignedOut>
                <SignInButton>
                  <button className="py-2 px-4 rounded-md bg-red-600 text-white hover:bg-red-700 transition duration-300">
                    Log in
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <SignOutButton />
              </SignedIn>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-md hover:bg-gray-100 hover:bg-opacity-20"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`${
            menuOpen ? "block" : "hidden"
          } md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block px-3 py-2 text-gray-800 rounded-md hover:bg-gray-100 hover:text-red-500 transition duration-300"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="px-3 py-2">
              <SignedOut>
                <SignInButton>
                  <button className="w-full py-2 px-4 rounded-md bg-red-600 text-white hover:bg-red-700 transition duration-300">
                    Log in
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <SignOutButton />
              </SignedIn>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
