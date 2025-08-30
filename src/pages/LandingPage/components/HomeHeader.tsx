
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { IMAGES } from "@/contants/images";
import { HashLink } from 'react-router-hash-link';

export default function HomeHeader() {


  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 text-white px-5 lg:px-14 xl:px-20 py-5 transition-all duration-300 ease-in-out ${isScrolled ? "bg-black shadow-lg" : "bg-transparent"
        }`}
      id="home"
    >
      <div className="flex items-center justify-between">
        {/* Left: Logo */}
        <HashLink smooth to="/home#home">
          <img
            src={IMAGES.logoHome}
            alt="Muvello Logo"
            className="h-8 cursor-pointer"
          />
        </HashLink>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex gap-8 items-center text-sm">
          <HashLink
            to="#why-us"
            className={`flex items-center gap-2 text-gray-400 hover:text-white`}
          >
            Why Us
          </HashLink>
          <HashLink
            to="#features"
            className={`flex items-center gap-2 text-gray-400 hover:text-white`}
          >
            Features
          </HashLink>
          <HashLink
            to="#trainer"
            className={`flex items-center gap-2 text-gray-400 hover:text-white`}
          >
            Trainer
          </HashLink>
          <HashLink
            to="#testimonial"
            className={`flex items-center gap-2 text-gray-400 hover:text-white`}
          >
            Testimonial
          </HashLink>
        </nav>

        {/* Right: Search + Icons */}
        <div className="flex items-center gap-4 text-sm hidden lg:flex">
          <Link
            to="/"
            className={`flex items-center gap-2 text-primary hover:text-white`}
          >
            Contact Us
          </Link>
          <Link
            to="/auth/"
            className={`flex items-center gap-2 text-black bg-primary px-4 py-2 rounded-full hover:text-black `}
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden p-2 rounded-full bg-[#2a2a2a]"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu size={25} />
        </button>
        {mobileMenuOpen && (
          <div className="lg:hidden">
            <div className="absolute top-0 left-0 w-full min-h-screen bg-black z-50 opacity-90">
              <button
                className="absolute top-5 right-5 text-white text-2xl font-semibold hover:text-gray-400 bg-primary rounded-full p-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X size={25} />
              </button>
              <nav className="flex flex-col gap-4 text-center pt-20 space-y-10">
                <HashLink
                  smooth
                  to="#why-us"
                  className="text-white text-4xl font-semibold hover:text-gray-400"
                >
                  Why Us
                </HashLink>
                <HashLink
                  to="/features"
                  className="text-white text-4xl font-semibold hover:text-gray-400"
                >
                  Features
                </HashLink>
                <HashLink
                  to="/trainer"
                  className="text-white text-4xl font-semibold hover:text-gray-400"
                >
                  Trainer
                </HashLink>
                <HashLink
                  to="/testimonial"
                  className="text-white text-4xl font-semibold hover:text-gray-400"
                >
                  Testimonial
                </HashLink>
                <Link
                  to="/"
                  className="text-white text-4xl font-semibold hover:text-gray-400"
                >
                  Contact Us
                </Link>
                <Link
                  to="/auth/"
                  className="text-white text-4xl font-semibold hover:text-gray-400"
                >
                  Get Started
                </Link>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
