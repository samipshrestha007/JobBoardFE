// client/src/components/EmployeeCard.jsx
import React from 'react';
import { FaEnvelope, FaBriefcase, FaClock, FaPhone } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function EmployeeCard({ emp, onApply }) {
  return (
    <motion.div
      className="border p-6 rounded-lg bg-white shadow hover:shadow-lg"
      whileHover={{ scale: 1.03 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-semibold mb-2">
        <FaBriefcase className="inline mr-1 text-blue-600" /> {emp.position}
      </h3>
      <p className="mb-1"><FaEnvelope className="inline mr-1 text-gray-600"/> {emp.email}</p>
      <p className="mb-1">
        <FaClock className="inline mr-1 text-gray-600"/>
        {emp.yearsOfExperience} year{emp.yearsOfExperience!==1 && 's'}
      </p>
      <p className="mb-4"><FaPhone className="inline mr-1 text-gray-600"/> {emp.contact}</p>
      <button
        onClick={() => onApply(emp._id)}
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
      >
        Contact
      </button>
    </motion.div>
  );
}
