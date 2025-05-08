import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFacebook, FaInstagram, FaTwitter, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

function Footer() {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/#about-us' },
    { label: 'Services', path: '/#services' },
    { label: 'Trainers', path: '/#trainers' },
    { label: 'Pricing', path: '/#pricing' },
    { label: 'FAQs', path: '/#faqs' }
  ];

  const programs = [
    'Personal Training',
    'Group Classes',
    'Weight Training',
    'Cardio Programs',
    'Yoga & Wellness',
    'Nutrition Guidance'
  ];

  return (
    <footer className="bg-neutral-900 border-t border-neutral-800">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <Link to="/" className="inline-block">
              <img
                src="/assets/images/Logo.png"
                alt="Amigos Fitness Gym"
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-neutral-400 leading-relaxed">
              Transform your body and mind with our expert guidance and state-of-the-art facilities.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-neutral-800 text-neutral-400 hover:bg-[#bfa14a] hover:text-neutral-900
                  transition-colors flex items-center justify-center"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-neutral-800 text-neutral-400 hover:bg-[#bfa14a] hover:text-neutral-900
                  transition-colors flex items-center justify-center"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-neutral-800 text-neutral-400 hover:bg-[#bfa14a] hover:text-neutral-900
                  transition-colors flex items-center justify-center"
              >
                <FaTwitter size={20} />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-white font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-neutral-400 hover:text-[#bfa14a] transition-colors inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Programs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-white font-semibold mb-6">Our Programs</h3>
            <ul className="space-y-3">
              {programs.map((program) => (
                <li key={program}>
                  <span className="text-neutral-400 hover:text-[#bfa14a] transition-colors cursor-pointer">
                    {program}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-white font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:amigosfitnessgym.management@gmail.com"
                  className="flex items-center gap-3 text-neutral-400 hover:text-[#bfa14a] transition-colors"
                >
                  <FaEnvelope className="text-[#bfa14a]" />
                  <span>amigosfitness@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+639760760570"
                  className="flex items-center gap-3 text-neutral-400 hover:text-[#bfa14a] transition-colors"
                >
                  <FaPhone className="text-[#bfa14a]" />
                  <span>+63 976 076 0570</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-neutral-400">
                <FaMapMarkerAlt className="text-[#bfa14a] mt-1" />
                <span>
                  2nd Floor JNL Building, San Gabriel, San Pablo City, Laguna
                </span>
              </li>
              <li className="pt-4">
                <button
                  onClick={() => window.open('https://maps.google.com', '_blank')}
                  className="px-6 py-3 bg-neutral-800 text-white rounded-lg hover:bg-[#bfa14a] hover:text-neutral-900
                    transition-colors inline-flex items-center gap-2"
                >
                  <FaMapMarkerAlt />
                  Get Directions
                </button>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-500 text-sm text-center md:text-left">
              © {currentYear} Amigos Fitness Gym. All rights reserved.
              <span 
                onClick={() => navigate('/admin/login')} 
                className="ml-1 cursor-default select-none hover:text-neutral-500"
              >
                .
              </span>
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-neutral-500 hover:text-[#bfa14a] text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-neutral-500 hover:text-[#bfa14a] text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;