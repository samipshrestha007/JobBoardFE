import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { FaBell, FaTrash, FaEdit, FaTimes, FaBuilding, FaMapMarkerAlt, FaDollarSign, FaPhone } from 'react-icons/fa';

export default function Dashboard() {
  const [notifs, setNotifs] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');
  const [token, setToken] = useState('');
  const [showEmployerModal, setShowEmployerModal] = useState(false);
  const [employerDetails, setEmployerDetails] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [editJob, setEditJob] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', company: '', location: '', description: '', contact: '', salary: '' });
  const [showCoverLetterModal, setShowCoverLetterModal] = useState(false);
  const [coverLetterText, setCoverLetterText] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) return;

    setToken(storedToken);
    const decoded = jwtDecode(storedToken);
    setUserRole(decoded.role);
    setUserName(decoded.name || 'User');

    axios.get('/api/notifications', {
      headers: { Authorization: `Bearer ${storedToken}` }
    }).then(res => setNotifs(res.data));

    if (decoded.role === 'employer') {
      axios.get(`/api/jobs/employer/${decoded.id || decoded._id || decoded.userId || decoded.user_id}`, {
        headers: { Authorization: `Bearer ${storedToken}` }
      }).then(res => setJobs(res.data));
    }
  }, []);

  const handleDeleteNotification = async (id) => {
    try {
      await axios.delete(`/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifs(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      alert('Failed to delete notification');
    }
  };

  const handleRespondToCV = async (notifId, approved) => {
    const message = approved
      ? '✅ Your CV has been approved. We will contact you for confirmation.'
      : '❌ Your CV has been declined. Thank you for applying.';

    try {
      await axios.post(`/api/notifications/respond/${notifId}`, { response: message }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNotifs(prev =>
        prev.map(n => (n._id === notifId ? { ...n, response: message } : n))
      );
    } catch (err) {
      alert('Failed to send response');
    }
  };

  const fetchEmployerDetails = async (employerId) => {
    try {
      const res = await axios.get(`/api/users/${employerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployerDetails(res.data);
      setShowEmployerModal(true);
    } catch (err) {
      alert('Failed to fetch employer details');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await axios.delete(`/api/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(prev => prev.filter(j => j._id !== jobId));
    } catch (err) {
      alert('Failed to delete job');
    }
  };

  const openEditModal = (job) => {
    setEditJob(job);
    setEditForm({
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      contact: job.contact,
      salary: job.salary
    });
  };

  const closeEditModal = () => {
    setEditJob(null);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(f => ({ ...f, [name]: value }));
  };

  const handleEditJobSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/jobs/${editJob._id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(prev => prev.map(j => j._id === editJob._id ? { ...j, ...editForm } : j));
      setEditJob(null);
    } catch (err) {
      alert('Failed to update job');
    }
  };

  const handleViewCoverLetter = (coverLetter) => {
    setCoverLetterText(coverLetter);
    setShowCoverLetterModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-700 drop-shadow">Welcome, <span className="text-green-600">{userName}</span>!</h1>

        {/* Notifications Section - now on top */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-6 text-green-700 flex items-center gap-2"><FaBell /> Notifications</h2>
          {notifs.length === 0 ? (
            <p className="text-gray-500 text-base">No notifications yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {notifs.map(notif => (
                <div key={notif._id} className="bg-white p-6 rounded-2xl shadow-lg flex flex-col justify-between min-h-[210px] border border-green-100 hover:shadow-2xl transition relative text-base">
                  <div>
                    <div className="flex items-center gap-2 text-blue-600 font-semibold mb-2 text-lg">
                      <FaBell /> Notification
                    </div>
                    <p className="text-gray-800 font-medium text-base">{notif.message}</p>
                    {notif.match && (
                      <p className="text-sm text-green-600 font-semibold mt-2">✅ Job matches desired position</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Received on {new Date(notif.createdAt).toLocaleString()}
                    </p>
                    {userRole === 'jobseeker' && notif.response && (
                      <div className="bg-indigo-50 border-l-4 border-indigo-500 text-indigo-800 p-3 rounded-md mt-3">
                        <p className="font-semibold text-xs">📩 CV Response</p>
                        <p className="text-xs mt-1">{notif.response}</p>
                      </div>
                    )}
                  </div>
                  {userRole === 'jobseeker' && (
                    <div className="mt-auto pt-4">
                      <button
                        onClick={() => fetchEmployerDetails(notif.from)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 font-semibold text-xs"
                      >
                        Employer's Details
                      </button>
                    </div>
                  )}
                  {userRole === 'employer' && notif.type === 'applyJob' && !notif.response && (
                    <div className="mt-auto pt-4 space-y-2">
                      <div className="flex gap-2">
                        {notif.cv && (
                          <a
                            href={`http://localhost:5000/${notif.cv.replace(/\\/g, '/')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline text-xs flex items-center gap-1 font-semibold"
                          >
                            View CV
                          </a>
                        )}
                        {notif.coverLetter && (
                          <button
                            onClick={() => handleViewCoverLetter(notif.coverLetter)}
                            className="text-green-600 underline text-xs flex items-center gap-1 font-semibold"
                          >
                            View Cover Letter
                          </button>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRespondToCV(notif._id, true)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 font-semibold text-xs"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRespondToCV(notif._id, false)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 font-semibold text-xs"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => handleDeleteNotification(notif._id)}
                    className="absolute top-2 right-2 text-red-400 hover:text-red-700"
                    title="Delete Notification"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Employer's Jobs Section */}
        {userRole === 'employer' && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-blue-700 flex items-center gap-2"><FaBuilding /> Your Posted Jobs</h2>
            {jobs.length === 0 ? (
              <p className="text-gray-500">You have not posted any jobs yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
                {jobs.map(job => (
                  <div
                    key={job._id}
                    className="w-72 bg-white p-4 rounded-2xl shadow-md border border-blue-100 flex flex-col gap-2 relative hover:shadow-xl transition-all duration-200"
                    style={{ minHeight: 270 }}
                  >
                    <h3 className="text-lg font-bold text-blue-700 mb-1 flex items-center gap-2">
                      <FaBuilding /> {job.title}
                    </h3>
                    <p className="text-green-700 font-semibold flex items-center gap-2">
                      <FaMapMarkerAlt /> {job.location}
                    </p>
                    <p className="text-gray-700 flex items-center gap-2">
                      <FaDollarSign className="text-green-500" /> Salary: <span className="font-semibold">Rs. {job.salary}</span>
                    </p>
                    <p className="text-gray-700 flex items-center gap-2">
                      <FaPhone className="text-blue-500" /> {job.contact}
                    </p>
                    <p className="text-gray-600 text-xs mb-2 break-words line-clamp-2">{job.description}</p>
                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => openEditModal(job)}
                        className="flex items-center gap-1 px-3 py-1 bg-yellow-400 text-white rounded shadow hover:bg-yellow-500 transition font-semibold text-xs"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded shadow hover:bg-red-600 transition font-semibold text-xs"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {showEmployerModal && employerDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm relative">
              <h2 className="text-lg font-bold mb-4 text-blue-700">👤 Employer Details</h2>
              <p><strong>Name:</strong> {employerDetails.name}</p>
              <p><strong>Email:</strong> {employerDetails.email}</p>
              <p><strong>Contact:</strong> {employerDetails.contact || 'N/A'}</p>
              <button
                onClick={() => setShowEmployerModal(false)}
                className="mt-4 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {editJob && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg relative border-2 border-blue-200">
              <button
                onClick={closeEditModal}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
              >
                <FaTimes />
              </button>
              <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">Edit Job</h2>
              <form onSubmit={handleEditJobSubmit} className="space-y-4">
                <input
                  name="title"
                  value={editForm.title}
                  onChange={handleEditFormChange}
                  placeholder="Job Title"
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-300"
                />
                <input
                  name="company"
                  value={editForm.company}
                  onChange={handleEditFormChange}
                  placeholder="Company Name"
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-300"
                />
                <input
                  name="location"
                  value={editForm.location}
                  onChange={handleEditFormChange}
                  placeholder="Location"
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-300"
                />
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditFormChange}
                  placeholder="Description"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-300"
                />
                <input
                  name="contact"
                  value={editForm.contact}
                  onChange={handleEditFormChange}
                  placeholder="Contact Number"
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-300"
                />
                <input
                  name="salary"
                  type="number"
                  min="0"
                  value={editForm.salary}
                  onChange={handleEditFormChange}
                  placeholder="Salary"
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-300"
                />
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold text-lg shadow"
                >
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        )}

        {showCoverLetterModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
              <button
                onClick={() => setShowCoverLetterModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
              >
                <FaTimes />
              </button>
              <h2 className="text-2xl font-bold mb-4 text-green-700">Cover Letter</h2>
              <div className="whitespace-pre-line text-gray-800 text-base max-h-96 overflow-y-auto border p-4 rounded">
                {coverLetterText}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
