import { useState } from "react";
import { auth, provider } from "../../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Email/Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error.message);
      alert("Failed to login. Please check your credentials.");
    }
  };

  // Google Sign-In
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (error) {
      console.error("Google login failed:", error.message);
      alert("Failed to login with Google.");
    }
  };

  return (
    <div className='login-container'>
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type='submit'>Login</button>
      </form>

      <button onClick={handleGoogleLogin} className='google-login'>
        Sign in with Google
      </button>

      <p>
        Don&apos;t have an account? <Link to='/register'>Register here</Link>
      </p>
    </div>
  );
};

export default Login;
