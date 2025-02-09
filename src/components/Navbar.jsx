import { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../firebase";
import { motion } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = ({ user, handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className='bg-white shadow-md fixed top-0 left-0 w-full z-50'>
      <div className='max-w-6xl mx-auto px-6'>
        <div className='flex justify-between items-center py-4'>
          {/* Logo */}
          <Link
            to='/'
            className='text-2xl font-bold text-red-500 flex items-center'
          >
            Runin&apos;time 🏃‍♂️
          </Link>

          {/* Desktop Menu */}
          <ul className='hidden md:flex space-x-6 text-gray-700 font-medium items-center'>
            <li>
              <Link
                to='/'
                className='hover:text-red-500 transition duration-200 px-4 py-2 rounded-md hover:bg-gray-100'
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to='/profile'
                className='hover:text-red-500 transition duration-200 px-4 py-2 rounded-md hover:bg-gray-100'
              >
                Profile
              </Link>
            </li>
            <li>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className='bg-red-500 text-white px-5 py-2 rounded-md hover:bg-red-600 transition font-semibold shadow'
              >
                Logout
              </motion.button>
            </li>
          </ul>

          {/* Mobile Menu Toggle */}
          <button
            className='md:hidden text-gray-700 text-2xl'
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className='md:hidden bg-white shadow-md p-4 absolute w-full left-0 top-full'
        >
          <ul className='space-y-4 text-gray-700 text-lg font-medium'>
            <li>
              <Link
                to='/'
                className='block hover:text-red-500 transition duration-200 px-4 py-2 hover:bg-gray-100 rounded-md'
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to='/profile'
                className='block hover:text-red-500 transition duration-200 px-4 py-2 hover:bg-gray-100 rounded-md'
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
            </li>
            <li>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className='w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition font-semibold'
              >
                Logout
              </motion.button>
            </li>
          </ul>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
