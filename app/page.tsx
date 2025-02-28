"use client";
import Image from "next/image";
import { Facebook, Instagram } from "lucide-react";
import Navbar from "../components/NavBar";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <header className="relative flex items-center justify-center min-h-screen">
        <div className="absolute inset-0">
          <Image
            src="/school.jpg"
            alt="School Campus"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Triumphant Baptist College
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Nurturing Excellence, Building Character. Join us in shaping the
            future leaders of tomorrow through quality education and strong
            moral values.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#admissions"
              className="px-8 py-4 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition duration-300 transform hover:scale-105"
            >
              Apply Now
            </a>
            <a
              href="#about"
              className="px-8 py-4 bg-white text-gray-900 rounded-lg font-bold hover:bg-gray-100 transition duration-300 transform hover:scale-105"
            >
              Learn More
            </a>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="about" className="py-24 px-6 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Academic Excellence",
                description:
                  "Our rigorous curriculum and dedicated faculty ensure students receive the highest quality education.",
              },
              {
                title: "Christian Values",
                description:
                  "We integrate faith and learning, fostering spiritual growth alongside academic achievement.",
              },
              {
                title: "Holistic Development",
                description:
                  "Beyond academics, we focus on character building, leadership skills, and personal growth.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-8 bg-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
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
