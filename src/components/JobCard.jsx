// client/src/components/JobCard.jsx
import React from 'react';
import { FaBuilding, FaMapMarkerAlt, FaDollarSign, FaPhone } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function JobCard({ job, onApply }) {
  return (
    <motion.div
      className="border p-6 rounded-lg bg-white shadow hover:shadow-lg"
      whileHover={{ scale: 1.03 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-semibold mb-2">
        <FaBuilding className="inline mr-1 text-blue-600" /> {job.company}
      </h3>
      <p className="mb-1"><FaMapMarkerAlt className="inline mr-1"/> {job.location}</p>
      <p className="mb-1"><FaDollarSign className="inline mr-1"/> ${job.salary}</p>
      <p className="mb-4"><FaPhone className="inline mr-1"/> {job.contact}</p>
      <button
        onClick={() => onApply(job._id)}
        className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded"
      >
        Apply Now
      </button>
    </motion.div>
  );
}
