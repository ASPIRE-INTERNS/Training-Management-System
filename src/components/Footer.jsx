import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">Training Management System</h3>
            <p className="text-gray-300 text-sm">
              A comprehensive platform for managing training courses, sessions, 
              and certifications for professionals across multiple domains.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>
                <Link to="/" className="hover:text-blue-300">Home</Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-blue-300">Browse Courses</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-blue-300">Sign In</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-blue-300">Register</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>Email: support@trainingms.com</li>
              <li>Phone: (123) 456-7890</li>
              <li>Address: 123 Training Street, Education City</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-6 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; {currentYear} Training Management System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;