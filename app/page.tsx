"use client";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Twitter,
  Globe,
  Users,
  BookOpen,
  Calendar,
  CreditCard,
  Settings,
  Check,
  ArrowRight,
  Shield,
  Zap,
  BarChart,
} from "lucide-react";
import Navbar from "../components/NavBar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <header className="relative flex items-center justify-center min-h-screen">
        <div className="absolute inset-0">
          <Image
            src="/school.jpg"
            alt="School Management"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gray-800/70" />
        </div>

        {/* Content */}
        <div className="container relative z-10 px-4 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="text-left max-w-2xl mb-12 md:mb-0">
            <div className="inline-block px-3 py-1 bg-blue-500/60 rounded-full text-blue-50 text-sm font-medium mb-6">
              All-in-one School Management Platform
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Simplify Your School Operations with{" "}
              <span className="text-blue-600">S</span>
              <span className="text-white">cool</span>
              <span className="text-indigo-400">r</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed max-w-lg">
              The complete platform that empowers secondary schools to
              effortlessly manage staff, students, finances, and events.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#demo"
                className="px-8 py-4 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition duration-300 flex items-center justify-center"
              >
                Request Demo <ArrowRight size={16} className="ml-2" />
              </a>
              <a
                href="#pricing"
                className="px-8 py-4 bg-white text-blue-700 rounded-lg font-bold hover:bg-gray-100 transition duration-300 flex items-center justify-center"
              >
                View Pricing
              </a>
            </div>
            <div className="mt-8 flex items-center text-sm text-gray-300">
              <Shield className="h-4 w-4 mr-2" /> No credit card required •
              14-day free trial
            </div>
          </div>
          <div className="md:w-1/2 relative h-96 w-full md:h-auto shadow-2xl rounded-xl overflow-hidden hidden md:block">
            <Image
              src="/dashboard-mockup.png"
              alt="Scoolr Dashboard"
              fill
              className="object-cover object-center rounded-xl"
            />
          </div>
        </div>
      </header>

      {/* Social Proof */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="container max-w-6xl mx-auto px-4">
          <p className="text-center text-gray-500 text-sm mb-6">
            TRUSTED BY LEADING EDUCATIONAL INSTITUTIONS
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70">
            {[
              "Academy Trust",
              "Oakwood Schools",
              "Westfield College",
              "Northern Education",
              "Global Learning",
            ].map((partner, index) => (
              <div key={index} className="text-gray-400 font-semibold text-lg">
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                stat: "500+",
                label: "Schools Trust Us",
                icon: <Globe className="h-8 w-8 text-blue-500 mb-4" />,
              },
              {
                stat: "98%",
                label: "Customer Satisfaction",
                icon: <BarChart className="h-8 w-8 text-blue-500 mb-4" />,
              },
              {
                stat: "30%",
                label: "Average Time Saved",
                icon: <Zap className="h-8 w-8 text-blue-500 mb-4" />,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="p-8 text-center bg-gray-50 rounded-lg hover:shadow-md transition-all duration-300"
              >
                {item.icon}
                <p className="text-5xl font-bold text-blue-600 mb-2">
                  {item.stat}
                </p>
                <p className="text-gray-600 font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 md:px-8 bg-gray-50">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
              FEATURES
            </div>
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              Everything You Need to Run Your School
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From academic planning to financial management, Scoolr provides
              everything your school needs in one intuitive platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users size={32} className="text-blue-600" />,
                title: "Staff & Student Management",
                description:
                  "Seamlessly manage teacher profiles, student records, class assignments, and attendance tracking all in one place.",
              },
              {
                icon: <BookOpen size={32} className="text-blue-600" />,
                title: "Academic Planning",
                description:
                  "Create and organize subjects, classes, timetables, and curriculum planning with an intuitive drag-and-drop interface.",
              },
              {
                icon: <CreditCard size={32} className="text-blue-600" />,
                title: "Billing & Finance",
                description:
                  "Streamline tuition collection, track expenses, generate financial reports, and manage payment reminders automatically.",
              },
              {
                icon: <Calendar size={32} className="text-blue-600" />,
                title: "Event Management",
                description:
                  "Plan and coordinate school events, parent-teacher meetings, and extracurricular activities with built-in scheduling tools.",
              },
              {
                icon: <Globe size={32} className="text-blue-600" />,
                title: "Parent Portal",
                description:
                  "Keep parents informed with real-time updates on attendance, grades, assignments, and important school announcements.",
              },
              {
                icon: <Settings size={32} className="text-blue-600" />,
                title: "Customizable Dashboard",
                description:
                  "Tailor your dashboard to display the metrics and information most important to your school's unique operational needs.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
              >
                <div className="p-3 bg-blue-50 rounded-lg inline-block mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
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

      {/* Product Highlights */}
      <section className="py-24 px-4 bg-white">
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-16 mb-20">
            <div className="md:w-1/2 relative h-96 w-full rounded-xl overflow-hidden shadow-lg order-2 md:order-1">
              <Image
                src="/financial-dashboard.png"
                alt="Financial Dashboard"
                fill
                className="object-cover object-center"
              />
            </div>
            <div className="md:w-1/2 order-1 md:order-2">
              <div className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
                FINANCIAL MANAGEMENT
              </div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">
                Take Control of Your School&apos;s Finances
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our comprehensive financial tools help you manage tuition, track
                expenses, and generate reports with ease. No more spreadsheets
                or manual calculations.
              </p>
              <ul className="space-y-4">
                {[
                  "Automated invoice generation",
                  "Multiple payment methods",
                  "Financial reporting",
                  "Budget planning tools",
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-blue-500 mr-3 mt-1" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2">
              <div className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
                STUDENT MANAGEMENT
              </div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">
                Streamline Student Records & Performance
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Keep all student information in one place. Track academic
                progress, attendance, behavior, and communicate with parents
                seamlessly.
              </p>
              <ul className="space-y-4">
                {[
                  "Comprehensive student profiles",
                  "Attendance tracking",
                  "Performance analytics",
                  "Parent communication tools",
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-blue-500 mr-3 mt-1" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/2 relative h-96 w-full rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/financial-dashboard.png"
                alt="Student Management"
                fill
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
              TESTIMONIALS
            </div>
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              Trusted by School Leaders
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear what administrators and educators have to say about their
              experience with Scoolr.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "Scoolr has transformed how we manage our school operations. What used to take hours now takes minutes, and our administrative staff couldn't be happier.",
                name: "Sarah Johnson",
                role: "Principal, Westfield Secondary School",
                image: "/testimonial1.jpg",
              },
              {
                quote:
                  "The billing system alone has saved us countless hours of work. Parents appreciate the transparency, and we've seen a 25% improvement in on-time payments.",
                name: "Michael Chen",
                role: "Finance Director, Oakridge Academy",
                image: "/testimonial2.jpg",
              },
              {
                quote:
                  "The parent portal has drastically improved our communication with families. They appreciate the real-time updates and easy access to their child's information.",
                name: "Rebecca Williams",
                role: "IT Administrator, Brighton College",
                image: "/testimonial3.jpg",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start mb-6">
                  <div className="text-blue-500 text-4xl font-serif">
                    &quot;
                  </div>
                </div>
                <p className="text-gray-700 mb-6">{testimonial.quote}</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden relative mr-4">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* How It Works Section */}
      <section className="py-24 px-4 bg-white">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
              GETTING STARTED
            </div>
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              Set Up in Four Simple Steps
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our guided onboarding process makes it easy to get your school up
              and running with Scoolr.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Set Up Your School",
                description:
                  "Create your school profile and customize settings to match your specific needs.",
                icon: <Globe className="h-6 w-6 text-white" />,
              },
              {
                step: "2",
                title: "Import Data",
                description:
                  "Easily import your existing student, teacher, and course data into the platform.",
                icon: <Users className="h-6 w-6 text-white" />,
              },
              {
                step: "3",
                title: "Configure Modules",
                description:
                  "Activate the features you need—from academics to finance to event management.",
                icon: <Settings className="h-6 w-6 text-white" />,
              },
              {
                step: "4",
                title: "Go Live",
                description:
                  "Deploy your fully configured system and start experiencing streamlined school management.",
                icon: <Zap className="h-6 w-6 text-white" />,
              },
            ].map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="relative">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 z-10 relative">
                    {step.icon}
                  </div>
                  <div className="absolute top-8 left-0 right-0 flex items-center justify-center">
                    <span className="text-white font-bold">{step.step}</span>
                  </div>
                  {index < 3 && (
                    <div
                      className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-blue-100"
                      style={{ transform: "translateY(-50%)" }}
                    ></div>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section id="pricing" className="py-24 px-4 bg-gray-50">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
              PRICING
            </div>
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that works best for your school&apos;s size and
              needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "$299",
                description: "Perfect for small schools just getting started",
                features: [
                  "Up to 300 students",
                  "Basic student management",
                  "Simple financial tools",
                  "Email support",
                ],
              },
              {
                name: "Professional",
                price: "$499",
                description: "Our most popular plan for growing schools",
                features: [
                  "Up to 1,000 students",
                  "Advanced student management",
                  "Complete financial suite",
                  "Parent portal access",
                  "Priority support",
                ],
                highlighted: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                description: "For large schools with complex needs",
                features: [
                  "Unlimited students",
                  "All premium features",
                  "Custom integrations",
                  "Dedicated account manager",
                  "24/7 priority support",
                ],
              },
            ].map((plan, index) => (
              <div
                key={index}
                className={`p-8 rounded-xl border ${
                  plan.highlighted
                    ? "border-blue-200 shadow-lg bg-white relative"
                    : "border-gray-200 bg-white"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-sm font-medium px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  {plan.price !== "Custom" && (
                    <span className="text-gray-500 ml-2">/month</span>
                  )}
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-blue-500 mr-3 mt-1" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className={`w-full py-3 px-4 rounded-lg font-medium text-center block ${
                    plan.highlighted
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-white text-blue-600 border border-blue-600 hover:bg-blue-50"
                  } transition duration-300`}
                >
                  {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 bg-white">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
              FAQ
            </div>
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions? We&apos;ve got answers.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "How long does it take to set up Scoolr?",
                answer:
                  "Most schools are fully set up within 1-2 weeks. Our team provides guided onboarding to ensure a smooth transition.",
              },
              {
                question: "Can I import data from our existing systems?",
                answer:
                  "Yes, Scoolr supports importing data from most school management systems and spreadsheets. Our team will help you migrate your data seamlessly.",
              },
              {
                question: "Is Scoolr secure and GDPR compliant?",
                answer:
                  "Absolutely. Security is our top priority. Scoolr is GDPR compliant and uses industry-leading encryption to protect your school's data.",
              },
              {
                question: "Do you offer training for our staff?",
                answer:
                  "Yes, we provide comprehensive training for all staff members. We also offer ongoing webinars and a knowledge base with tutorials.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-6"
              >
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-700 to-blue-600 text-white">
        <div className="container max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to transform your school&apos;s management?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of schools already using Scoolr to streamline their
            operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#demo"
              className="px-8 py-4 bg-white text-blue-700 rounded-lg font-bold hover:bg-gray-100 transition duration-300 flex items-center justify-center"
            >
              Schedule a Free Demo <ArrowRight size={16} className="ml-2" />
            </a>
            <a
              href="#contact"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold hover:bg-white/10 transition duration-300"
            >
              Contact Sales
            </a>
          </div>
          <p className="text-blue-100 mt-8 text-sm">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Scoolr</h3>
            <p className="text-gray-400 mb-4">
              Empowering schools with smart management solutions.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition duration-300"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition duration-300"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition duration-300"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#features"
                  className="text-gray-400 hover:text-white transition"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-gray-400 hover:text-white transition"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#demo"
                  className="text-gray-400 hover:text-white transition"
                >
                  Demo
                </a>
              </li>
              <li>
                <a
                  href="#roadmap"
                  className="text-gray-400 hover:text-white transition"
                >
                  Roadmap
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#blog"
                  className="text-gray-400 hover:text-white transition"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#support"
                  className="text-gray-400 hover:text-white transition"
                >
                  Support
                </a>
              </li>
              <li>
                <a
                  href="#documentation"
                  className="text-gray-400 hover:text-white transition"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#webinars"
                  className="text-gray-400 hover:text-white transition"
                >
                  Webinars
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: info@scoolr.com</li>
              <li>Phone: (234) 567-8901</li>
              <li>Mon-Fri: 9AM - 5PM</li>
            </ul>
          </div>
        </div>
        <div className="container max-w-6xl mx-auto text-center mt-12 border-t border-gray-800 pt-8">
          <p className="text-gray-500">© 2025 Scoolr. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-400">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-gray-400">
              Terms of Service
            </a>
            <a href="#" className="hover:text-gray-400">
              Accessibility
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
