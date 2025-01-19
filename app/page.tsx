export default function Home() {
  return (
    <div>
      <nav className="bg-indigo-900 p-4 sticky top-0 z-50">
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
      </nav>

      <header
        className="flex flex-col justify-center items-center text-center bg-cover bg-center text-white py-16 min-h-[500px]"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/api/placeholder/1920/600')`,
        }}
      >
        <h1 className="text-5xl font-bold mb-4">Triumphant Baptist College</h1>
        <p className="text-xl">Nurturing Excellence, Building Character</p>
      </header>

      <section className="py-16 px-8">
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

      <section className="py-16 px-8 bg-gray-50">
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

      <section className="py-16 px-8 bg-indigo-900 text-white text-center">
        <h2 className="text-3xl font-bold">Begin Your Journey With Us</h2>
        <p className="mt-4">
          Applications are now open for the upcoming academic session
        </p>
        <a
          href="#"
          className="mt-6 inline-block bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg hover:bg-yellow-600"
        >
          Apply Now
        </a>
      </section>

      <footer className="bg-indigo-900 text-white py-8 text-center">
        <p>Contact Us: info@triumphantbaptist.edu | Phone: (234) 123-4567</p>
        <p className="mt-4">
          © 2025 Triumphant Baptist College. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
