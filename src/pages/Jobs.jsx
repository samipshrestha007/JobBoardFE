import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { FaBriefcase, FaBuilding, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userPosition, setUserPosition] = useState('');
  const [error, setError] = useState('');
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const position = decoded.position?.toLowerCase().trim();
        if (position) setUserPosition(position);
      } catch (err) {
        console.error('Failed to decode token', err);
      }
    }

    axios.get('/api/jobs')
      .then(res => {
        setJobs(res.data);
        setFilteredJobs(res.data);
      })
      .catch(err => {
        console.error('Fetch jobs error:', err);
        setError(err.response?.data?.error || 'Failed to load jobs');
      });
  }, []);

  // Filter jobs based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredJobs(jobs);
    } else {
      const filtered = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredJobs(filtered);
    }
  }, [searchTerm, jobs]);

  const matchesUserPosition = (jobTitle = '') => {
    return userPosition && jobTitle.toLowerCase().includes(userPosition);
  };

  const handleApply = (jobId) => {
    setSelectedJobId(jobId);
    setShowApplyModal(true);
  };

  const submitApplication = async () => {
    if (!cvFile) {
      alert('Please upload a CV (PDF or JPG)');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to apply');
      return;
    }

    const formData = new FormData();
    formData.append('cv', cvFile);
    formData.append('coverLetter', coverLetter);

    try {
      await axios.post(`http://localhost:5000/api/jobs/${selectedJobId}/apply`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Applied successfully with CV and cover letter!');
      setShowApplyModal(false);
      setCvFile(null);
      setCoverLetter('');
    } catch (err) {
      console.error('Apply job error:', err);
      alert(err.response?.data?.error || 'Failed to apply');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Explore Job Opportunities</h1>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search jobs by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {searchTerm && (
            <p className="text-center text-sm text-gray-600 mt-2">
              Found {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} matching "{searchTerm}"
            </p>
          )}
        </div>

        {error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center">
            {searchTerm ? (
              <div>
                <p className="text-gray-500 mb-2">No jobs found matching "{searchTerm}"</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Clear search and show all jobs
                </button>
              </div>
            ) : (
              <p className="text-gray-500">No jobs found.</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map(job => {
              const isMatch = matchesUserPosition(job.title);

              return (
                <div key={job._id} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
                  <div className="flex items-center gap-3 mb-2 text-blue-600">
                    <FaBriefcase className="text-xl" />
                    <h2 className="text-lg font-semibold">{job.title}</h2>
                    {isMatch && (
                      <span className="ml-auto text-green-600 text-sm font-semibold">✅ Match</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                    <FaBuilding /> {job.company || 'N/A'}
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                    <FaMapMarkerAlt /> {job.location || 'Remote'}
                  </div>

                  <p className="text-sm text-gray-700 line-clamp-3 mb-2">{job.description}</p>

                  <p className="text-sm text-gray-600">
                    💰 Salary: <span className="font-medium text-gray-800">Rs. {job.salary}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    📞 Contact: <span className="font-medium text-gray-800">{job.contact}</span>
                  </p>

                  <button
                    onClick={() => handleApply(job._id)}
                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                  >
                    Apply Now
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Apply to this Job</h2>
            <p className="mb-4">Do you want to apply? Please upload your CV (PDF or JPG) and write a cover letter.</p>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg"
              onChange={(e) => setCvFile(e.target.files[0])}
              className="mb-4 w-full border p-2 rounded"
            />
            <textarea
              value={coverLetter}
              onChange={e => setCoverLetter(e.target.value)}
              placeholder="Write your cover letter here..."
              className="mb-4 w-full border p-2 rounded min-h-[100px]"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowApplyModal(false);
                  setCvFile(null);
                  setCoverLetter('');
                }}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={submitApplication}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Upload & Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
