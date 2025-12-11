// client/src/components/Hero.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Hero() {
  const token = localStorage.getItem('token');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        className="relative h-[600px] flex items-center justify-center text-white"
        style={{
          background: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://alumni.amrita.edu/wp-content/uploads/2023/06/job_search_portals.png') center/cover no-repeat"
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Your Gateway to Career Success
            </motion.h1>
            <motion.p 
              className="text-xl mb-8 text-gray-200"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Connect with top employers and talented professionals in one seamless platform
            </motion.p>
            {!token && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Link
                  to="/register"
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-medium transition-colors duration-300"
                >
                  Get Started
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </motion.section>

      {/* What Makes Us Different Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Makes Us Different</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're not just another job board. We're a comprehensive platform that connects talent with opportunity.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white p-8 rounded-lg shadow-lg"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-blue-600 text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-3">New Job Notifications</h3>
              <p className="text-gray-600">Our website will notify you with the new job for you based on your skills and preferences.</p>
            </motion.div>
            <motion.div 
              className="bg-white p-8 rounded-lg shadow-lg"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-blue-600 text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-3">Direct Communication</h3>
              <p className="text-gray-600">Connect the employer and jobseeker directly through our website.</p>
            </motion.div>
            <motion.div 
              className="bg-white p-8 rounded-lg shadow-lg"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-blue-600 text-4xl mb-4">📈</div>
              <h3 className="text-xl font-semibold mb-3">Career Growth</h3>
              <p className="text-gray-600">Access resources and tools to help you advance your career and reach your professional goals.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">For Job Seekers</h2>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <span className="text-blue-600 mr-3">✓</span>
                  <span className="text-gray-600">Create a professional profile to showcase your skills</span>
                </li>
                <li className="flex items-center">
                  <span className="text-blue-600 mr-3">✓</span>
                  <span className="text-gray-600">Upload your CV and cover letter</span>
                </li>
                <li className="flex items-center">
                  <span className="text-blue-600 mr-3">✓</span>
                  <span className="text-gray-600">Get matched with relevant job opportunities</span>
                </li>
                <li className="flex items-center">
                  <span className="text-blue-600 mr-3">✓</span>
                  <span className="text-gray-600">Direct communication with employers</span>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">For Employers</h2>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <span className="text-blue-600 mr-3">✓</span>
                  <span className="text-gray-600">Post and manage job listings</span>
                </li>
                <li className="flex items-center">
                  <span className="text-blue-600 mr-3">✓</span>
                  <span className="text-gray-600">Access a pool of qualified candidates</span>
                </li>
                <li className="flex items-center">
                  <span className="text-blue-600 mr-3">✓</span>
                  <span className="text-gray-600">Review applications and manage hiring process</span>
                </li>
                <li className="flex items-center">
                  <span className="text-blue-600 mr-3">✓</span>
                  <span className="text-gray-600">Connect directly with potential hires</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of professionals and companies already using our platform to find their next opportunity or perfect candidate.
          </p>
          {!token && (
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 rounded-lg text-lg font-medium transition-colors duration-300"
            >
              Create Your Account
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
