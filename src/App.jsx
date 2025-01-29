import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import RunList from "./components/RunList";
import RunForm from "./components/RunForm";
import Profile from "./components/Profile";
import Auth from "./pages/Auth"; // ✅ New Auth Page
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
      {user ? (
        <>
          <header>
            <nav>
              <ul>
                <li>
                  <Link to='/'>Home</Link>
                </li>
                <li>
                  <Link to='/profile'>Profile</Link>
                </li>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </nav>
          </header>
          <Routes>
            <Route
              path='/'
              element={
                <div className='container'>
                  <div className='left-side'>
                    <RunList setSelectedRun={setSelectedRun} user={user} />
                  </div>
                  <div className='right-side'>
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
          </Routes>
        </>
      ) : (
        <Routes>
          {/* Redirect all unauthenticated users to Auth page */}
          <Route path='/auth' element={<Auth />} />
          <Route path='*' element={<Navigate to='/auth' replace />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
