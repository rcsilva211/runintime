import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Routes, Route, Navigate } from "react-router-dom";
import RunList from "./components/RunList";
import RunForm from "./components/RunForm";
import Profile from "./components/Profile";
import Auth from "./pages/Auth";
import Navbar from "./components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaPlus } from "react-icons/fa";
import "./App.css";

function App() {
  const [user] = useAuthState(auth);
  const [selectedRun, setSelectedRun] = useState(null);
  const [runs, setRuns] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      auth.onAuthStateChanged((authUser) => {
        if (!authUser) {
          localStorage.removeItem("user");
        }
      });
    }
  }, []);

  const handleLogout = () => {
    auth.signOut().then(() => {
      localStorage.removeItem("user");
    });
  };

  return (
    <div className='app'>
      {user && <Navbar user={user} handleLogout={handleLogout} />}

      <div className={user ? "pt-16" : ""}>
        <Routes>
          {user ? (
            <>
              <Route
                path='/'
                element={
                  <div className='flex h-screen w-full overflow-hidden'>
                    {/* ✅ Mobile Hamburger Button (Top Left, Below Navbar) */}
                    <button
                      onClick={() => setSidebarOpen(true)}
                      className='absolute top-28 left-4 md:hidden bg-red-600 text-white p-2 rounded-md shadow-lg'
                    >
                      <FaBars className='text-xl' />
                    </button>

                    {/* ✅ Sidebar Overlay for Mobile */}
                    <AnimatePresence>
                      {sidebarOpen && (
                        <motion.div
                          initial={{ x: "-100%" }}
                          animate={{ x: 0 }}
                          exit={{ x: "-100%" }}
                          transition={{ duration: 0.3 }}
                          className='fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden'
                          onClick={() => setSidebarOpen(false)}
                        >
                          <RunList
                            setSelectedRun={(run) => {
                              setSelectedRun(run);
                              setSidebarOpen(false);
                            }}
                            user={user}
                            runs={runs}
                            setRuns={setRuns}
                            closeSidebar={() => setSidebarOpen(false)}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* ✅ Sidebar for Desktop (Always Visible) */}
                    <div className='md:block md:w-1/4 h-screen bg-white flex flex-col overflow-hidden'>
                      <div className='h-full overflow-y-auto'>
                        <RunList
                          setSelectedRun={setSelectedRun}
                          user={user}
                          runs={runs}
                          setRuns={setRuns}
                        />
                      </div>
                    </div>

                    {/* ✅ Right Content (Run Form) */}
                    <div className='flex-1 flex items-center justify-center p-6'>
                      <RunForm
                        selectedRun={selectedRun}
                        setSelectedRun={setSelectedRun}
                        user={user}
                        addRunToList={(newRun) =>
                          setRuns((prevRuns) => [newRun, ...prevRuns])
                        }
                      />
                    </div>

                    {/* ✅ Floating Buttons (Bottom Right) */}
                    <div className='fixed bottom-4 right-4 flex flex-col space-y-3 items-end'>
                      {/* Add Run Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedRun(null);
                          setSidebarOpen(false);
                        }}
                        className='bg-red-500 text-white p-4 rounded-full shadow-lg hover:bg-red-600 transition-all'
                      >
                        <FaPlus className='text-2xl' />
                      </motion.button>
                    </div>
                  </div>
                }
              />

              <Route path='/profile' element={<Profile user={user} />} />
              <Route path='*' element={<Navigate to='/' replace />} />
            </>
          ) : (
            <>
              <Route path='/auth' element={<Auth />} />
              <Route path='*' element={<Navigate to='/auth' replace />} />
            </>
          )}
        </Routes>
      </div>
    </div>
  );
}

export default App;
