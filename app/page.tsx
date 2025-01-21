/* eslint-disable react/no-unescaped-entities */
"use client";
import Image from "next/image";
import Link from "next/link";
export default function Home() {
  return (
    <div>
      {/* Navbar */}
      <nav className="bg-indigo-900 p-4 sticky top-0 z-50 flex justify-between items-center">
        <ul className="flex justify-center gap-8 text-white font-medium">
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
        <Link className="px-2 py-1 bg-white text-blue-900" href="/auth/login">
          Log in
        </Link>
      </nav>

      {/* Header Section */}
      <header
        className="flex flex-col justify-center items-center text-center bg-cover bg-center text-white py-16 min-h-[500px]"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/school.jpg')`,
        }}
      >
        <h1 className="text-5xl font-bold mb-4">Triumphant Baptist College</h1>
        <p className="text-xl">Nurturing Excellence, Building Character</p>
        <a
          href="#admissions"
          className="mt-6 bg-yellow-500 text-black py-3 px-6 rounded-lg font-bold hover:bg-yellow-600"
        >
          Enroll Now
        </a>
      </header>

      {/* Features Section */}
      <section id="about" className="py-16 px-8 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="p-8 bg-gray-100 rounded-lg text-center">
            <h3 className="text-xl font-semibold">Academic Excellence</h3>
            <p className="mt-4">
              Comprehensive curriculum focused on developing critical thinking
              and practical skills for future success.
            </p>
          </div>
          <div className="p-8 bg-gray-100 rounded-lg text-center">
            <h3 className="text-xl font-semibold">Christian Values</h3>
            <p className="mt-4">
              Strong foundation in Baptist principles while fostering respect
              for diverse perspectives.
            </p>
          </div>
          <div className="p-8 bg-gray-100 rounded-lg text-center">
            <h3 className="text-xl font-semibold">Holistic Development</h3>
            <p className="mt-4">
              Balanced focus on academics, sports, arts, and character
              development.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-8 bg-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-center">
          <div>
            <h3 className="text-4xl font-bold text-indigo-900">95%</h3>
            <p>WAEC Success Rate</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-indigo-900">25+</h3>
            <p>Extra-Curricular Activities</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-indigo-900">1:20</h3>
            <p>Teacher-Student Ratio</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          What Our Students and Parents Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <blockquote className="p-8 bg-indigo-100 rounded-lg">
            <p className="italic">
              "Triumphant Baptist College has been a blessing to our family. Our
              son has grown academically and spiritually."
            </p>
            <footer className="mt-4 font-semibold">- Parent</footer>
          </blockquote>
          <blockquote className="p-8 bg-indigo-100 rounded-lg">
            <p className="italic">
              "I’ve never felt more prepared for university. The teachers truly
              care about us and our future."
            </p>
            <footer className="mt-4 font-semibold">- Student</footer>
          </blockquote>
          <blockquote className="p-8 bg-indigo-100 rounded-lg">
            <p className="italic">
              "The environment is safe, nurturing, and welcoming. We highly
              recommend this school!"
            </p>
            <footer className="mt-4 font-semibold">- Parent</footer>
          </blockquote>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 px-8 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12">Gallery</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          <Image
            src="/school.jpg"
            alt="School Event"
            width={300}
            height={200}
            className="rounded-lg object-contain"
          />
          <Image
            src="/two.jpg"
            alt="Classroom"
            width={300}
            height={200}
            className="rounded-lg object-contain"
          />
          <Image
            src="/three.jpg"
            alt="Sports Activity"
            width={300}
            height={200}
            className="rounded-lg object-contain"
          />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h3 className="font-semibold text-lg">How can I apply?</h3>
            <p className="mt-2">
              Visit our{" "}
              <a href="#admissions" className="text-indigo-600 hover:underline">
                admissions page
              </a>{" "}
              to learn more about the application process.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">What are the school fees?</h3>
            <p className="mt-2">
              Fees vary by grade level. Please contact our administration office
              for detailed information.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">
              Are scholarships available?
            </h3>
            <p className="mt-2">
              Yes, we offer scholarships to outstanding students. Learn more on
              the{" "}
              <a href="#admissions" className="text-indigo-600 hover:underline">
                admissions page
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section
        id="admissions"
        className="py-16 px-8 bg-indigo-900 text-white text-center"
      >
        <h2 className="text-3xl font-bold">Start Your Journey Today</h2>
        <p className="mt-4">
          Applications are now open for the upcoming academic session.
        </p>
        <a
          href="#"
          className="mt-6 inline-block bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg hover:bg-yellow-600"
        >
          Apply Now
        </a>
      </section>

      {/* Footer Section */}
      <footer className="bg-indigo-900 text-white py-8">
        <div className="max-w-5xl mx-auto text-center">
          <p>Contact Us: info@triumphantbaptist.edu | Phone: (234) 123-4567</p>
          <p className="mt-4">
            Follow us:
            <a href="#" className="ml-2 text-yellow-500 hover:underline">
              Facebook
            </a>{" "}
            |{" "}
            <a href="#" className="text-yellow-500 hover:underline">
              Instagram
            </a>
          </p>
          <p className="mt-8">
            © 2025 Triumphant Baptist College. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
