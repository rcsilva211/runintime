import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Routes, Route, Navigate } from "react-router-dom";
import RunList from "./components/RunList";
import RunForm from "./components/RunForm";
import Profile from "./components/Profile";
import Auth from "./pages/Auth";
import Navbar from "./components/Navbar"; // ✅ Import Navbar
import "./App.css";

function App() {
  const [user] = useAuthState(auth);
  const [selectedRun, setSelectedRun] = useState(null);

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
      {user && <Navbar user={user} handleLogout={handleLogout} />}{" "}
      <div className={user ? "mt-16" : ""}>
        {" "}
        <Routes>
          {user ? (
            <>
              <Route
                path='/'
                element={
                  <div className='flex h-screen w-full overflow-hidden'>
                    {/* Left Sidebar (Run List) */}
                    <div className='w-1/5 h-screen bg-gray-900 flex flex-col overflow-hidden'>
                      <div className='h-full overflow-y-auto'>
                        <RunList setSelectedRun={setSelectedRun} user={user} />
                      </div>
                    </div>

                    {/* Right Content (Run Form) */}
                    <div className='flex-1 flex items-center justify-center p-6'>
                      <RunForm
                        selectedRun={selectedRun}
                        setSelectedRun={setSelectedRun}
                        user={user}
                      />
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
