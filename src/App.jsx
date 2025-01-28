import { useState } from "react";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import RunList from "./components/RunList";
import RunForm from "./components/RunForm";
import Profile from "./components/Profile";
import { Routes, Route, Link } from "react-router-dom"; // ❌ Removed BrowserRouter here
import Login from "./components/Login";
import Register from "./components/Register";
import "./App.css";

function App() {
  const [user] = useAuthState(auth);
  const [selectedRun, setSelectedRun] = useState(null);

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <div className='app'>
      {" "}
      {/* ✅ Removed the redundant <Router> */}
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
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route
            path='*'
            element={
              <div>
                <h2>Welcome to Jog Tracker</h2>
                <p>
                  <Link to='/login'>Login</Link> or{" "}
                  <Link to='/register'>Register</Link> to save your runs!
                </p>
              </div>
            }
          />
        </Routes>
      )}
    </div>
  );
}

export default App;
