import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";

const Navbar = ({ user, handleLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    const storedProfilePicture = localStorage.getItem(
      `profilePicture-${user.uid}`
    );
    if (storedProfilePicture) {
      setProfilePicture(storedProfilePicture);
    }
  }, [user]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64Image = reader.result;
      localStorage.setItem(`profilePicture-${user.uid}`, base64Image);
      setProfilePicture(base64Image);
    };
    reader.readAsDataURL(file);
  };

  return (
    <nav className='bg-white shadow-md fixed top-0 left-0 w-full z-50 p-4 flex justify-between items-center'>
      {/* ✅ Runin'time Logo */}
      <div className='text-2xl font-bold text-red-600 flex items-center'>
        Runin&apos;time <span className='ml-2'>🏃‍♂️</span>
      </div>

      {/* ✅ Profile Icon / Sidebar Toggle */}
      <button
        className='text-gray-700 text-3xl ml-auto p-2'
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {profilePicture ? (
          <img
            src={profilePicture}
            alt='Profile'
            className='w-10 h-10 rounded-full'
          />
        ) : (
          <FaUserCircle />
        )}
      </button>

      {/* ✅ Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-40'
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* ✅ Sidebar Content */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: sidebarOpen ? "0%" : "100%" }}
        transition={{ duration: 0.3 }}
        className='fixed top-0 right-0 h-full w-72 bg-white shadow-lg p-6 z-50 flex flex-col'
      >
        <h2 className='text-xl font-semibold mb-4'>Profile</h2>

        {/* ✅ Display Profile Picture */}
        <div className='flex justify-center mb-4'>
          {profilePicture ? (
            <img
              src={profilePicture}
              alt='Profile'
              className='w-24 h-24 rounded-full object-cover'
            />
          ) : (
            <FaUserCircle className='text-gray-400 text-6xl' />
          )}
        </div>

        {/* ✅ Upload Button */}
        <input type='file' onChange={handleImageUpload} accept='image/*' />

        <p className='text-gray-700'>
          <strong>Email:</strong> {user.email}
        </p>
        <p className='text-gray-700'>
          <strong>UID:</strong> {user.uid}
        </p>

        {/* ✅ Logout Button */}
        <button
          onClick={handleLogout}
          className='mt-auto bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition font-semibold w-full'
        >
          Logout
        </button>
      </motion.div>
    </nav>
  );
};

Navbar.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    uid: PropTypes.string.isRequired,
  }).isRequired,
  handleLogout: PropTypes.func.isRequired,
};

export default Navbar;
