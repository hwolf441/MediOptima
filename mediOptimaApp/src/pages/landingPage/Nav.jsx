import Logo from '../../assets/LandingPage/LogoWhite.png';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

export default function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('section');
  const navigate = useNavigate();


  const handleLoginClick = (type) => {
    setLoginDropdownOpen(false);
    setMobileMenuOpen(false);
    if (type === 'admin') {
      navigate('/adminlogin');
    } else if (type === 'staff') {
      navigate('/stafflogin');
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    setMobileMenuOpen(false);
    setActiveSection(sectionId);
  };

  const isActive = (section) => activeSection === section;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a 
              href="#home" 
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('home');
              }}
              className="cursor-pointer"
            >
              <img src={Logo} alt="Company Logo" className="h-14 md:h-16" />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('home');
              }}
              className={`font-medium transition-colors duration-300 ${
                isActive('home') 
                  ? 'text-blue-600 font-semibold' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Home
            </a>
            <a 
              href="#services"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('how-it-works');
              }}
              className={`font-medium transition-colors duration-300 ${
                isActive('services') 
                  ? 'text-blue-600 font-semibold' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Services
            </a>
            <a 
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('why-us');
              }}
              className={`font-medium transition-colors duration-300 ${
                isActive('about') 
                  ? 'text-blue-600 font-semibold' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              About Us
            </a>
            <a 
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('team');
              }}
              className={`font-medium transition-colors duration-300 ${
                isActive('contact') 
                  ? 'text-blue-600 font-semibold' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Contact Us
            </a>
            
            {/* Login Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors duration-300 shadow-md hover:shadow-lg flex items-center"
              >
                Log In
                <svg 
                  className={`ml-2 w-4 h-4 transition-transform ${loginDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {loginDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={() => handleLoginClick('admin')}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    Admin Log In
                  </button>
                  <button
                    onClick={() => handleLoginClick('staff')}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    Staff Log In
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-8 w-8" />
              ) : (
                <Bars3Icon className="h-8 w-8" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            <a 
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('home');
              }}
              className={`block px-3 py-2 rounded-md transition-colors duration-300 ${
                isActive('home')
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Home
            </a>
            <a 
              href="#services"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('how-it-works');
              }}
              className={`block px-3 py-2 rounded-md transition-colors duration-300 ${
                isActive('services')
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Services
            </a>
            <a 
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('why-us');
              }}
              className={`block px-3 py-2 rounded-md transition-colors duration-300 ${
                isActive('about')
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              About Us
            </a>
            <a 
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('team');
              }}
              className={`block px-3 py-2 rounded-md transition-colors duration-300 ${
                isActive('contact')
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Contact Us
            </a>
            
            {/* Mobile Login Dropdown */}
            <div className="w-full">
              <button 
                onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors duration-300 mt-2 flex justify-between items-center"
              >
                Log In
                <svg 
                  className={`ml-2 w-4 h-4 transition-transform ${loginDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {loginDropdownOpen && (
                <div className="mt-2 bg-white rounded-md shadow-inner py-1">
                  <button
                    onClick={() => handleLoginClick('admin')}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    Admin Log In
                  </button>
                  <button
                    onClick={() => handleLoginClick('staff')}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    Staff Log In
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}