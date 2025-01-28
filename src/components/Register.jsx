import { auth, provider } from "../../firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Email/Password Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created successfully. You can now log in.");
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error.message);
      alert("Failed to register. Please try again.");
    }
  };

  // Google Sign-In
  const handleGoogleSignup = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (error) {
      console.error("Google login failed:", error.message);
      alert("Failed to register with Google.");
    }
  };

  return (
    <div className='register-container'>
      <form onSubmit={handleRegister}>
        <h2>Register</h2>
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
        <button type='submit'>Register</button>
      </form>

      <button onClick={handleGoogleSignup} className='google-login'>
        Sign up with Google
      </button>

      <p>
        Already have an account? <Link to='/login'>Login here</Link>
      </p>
    </div>
  );
};

export default Register;
