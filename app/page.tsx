"use client";
import { useState } from "react";
import Image from "next/image";
import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { Facebook, Instagram, Menu } from "lucide-react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-indigo-900 p-4 sticky top-0 z-50 flex justify-between items-center shadow-lg">
        <button
          className="md:hidden text-white hover:text-gray-300 transition duration-300"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu />
        </button>
        <ul
          className={`${
            menuOpen ? "block" : "hidden"
          } md:flex justify-center gap-8 text-white font-medium`}
        >
          <li>
            <a
              href="#about"
              className="hover:underline hover:text-gray-300 transition duration-300"
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#academics"
              className="hover:underline hover:text-gray-300 transition duration-300"
            >
              Academics
            </a>
          </li>
          <li>
            <a
              href="#admissions"
              className="hover:underline hover:text-gray-300 transition duration-300"
            >
              Admissions
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className="hover:underline hover:text-gray-300 transition duration-300"
            >
              Contact
            </a>
          </li>
        </ul>
        <div className="flex gap-4">
          <SignedOut>
            <SignInButton>
              <button className="py-2 px-4 border-none rounded-md bg-red-600 text-white hover:bg-red-700 transition duration-300">
                Log in
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <SignOutButton />
          </SignedIn>
        </div>
      </nav>

      {/* Header Section */}
      <header
        className="flex flex-col justify-center items-center text-center bg-cover bg-center text-white py-32 min-h-[600px]"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0)), url('/school.jpg')`,
        }}
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Triumphant Baptist College
        </h1>
        <p className="text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed">
          Nurturing Excellence, Building Character. Join us in shaping the
          future leaders of tomorrow through quality education and strong moral
          values.
        </p>
        <a
          href="#admissions"
          className="mt-8 bg-red-600 text-white py-3 px-8 rounded-lg font-bold hover:bg-red-700 transition duration-300"
        >
          Enroll Now
        </a>
      </header>

      {/* Features Section */}
      <section id="about" className="py-20 px-6 md:px-8 bg-gray-50">
        <h2 className="text-4xl font-bold text-center mb-16">About Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            "Academic Excellence",
            "Christian Values",
            "Holistic Development",
          ].map((title, index) => (
            <div
              key={index}
              className="p-8 bg-white rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-2xl font-semibold mb-4">{title}</h3>
              <p className="text-gray-600">Description of {title} goes here.</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 px-6 bg-gray-50">
        <h2 className="text-4xl font-bold text-center mb-16">Gallery</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {["/school.jpg", "/two.jpg", "/three.jpg"].map((src, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <Image
                src={src}
                alt="School Image"
                width={400}
                height={300}
                className="object-cover w-full h-64 transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-indigo-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Contact Us</h3>
            <p>Email: info@triumphantbaptist.edu</p>
            <p>Phone: (234) 123-4567</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-yellow-500 hover:text-yellow-400 transition duration-300"
              >
                <Facebook size={24} />
              </a>
              <a
                href="#"
                className="text-yellow-500 hover:text-yellow-400 transition duration-300"
              >
                <Instagram size={24} />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">Quick Links</h3>
            <ul>
              <li>
                <a href="#about" className="hover:underline">
                  About
                </a>
              </li>
              <li>
                <a href="#academics" className="hover:underline">
                  Academics
                </a>
              </li>
              <li>
                <a href="#admissions" className="hover:underline">
                  Admissions
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:underline">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-8 border-t border-gray-700 pt-8">
          <p>© 2025 Triumphant Baptist College. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
