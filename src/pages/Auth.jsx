import { useState } from "react";
import { auth, provider } from "../../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import authIllustration from "../assets/auth-illustration.png";

const Auth = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Account created successfully. You can now log in.");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/");
    } catch (error) {
      console.error("Authentication failed:", error.message);
      alert("Failed to process request. Please try again.");
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (error) {
      console.error("Google authentication failed:", error.message);
      alert("Failed to authenticate with Google.");
    }
  };

  return (
    <div className='flex items-center justify-center w-screen h-screen bg-red-600'>
      <div className='bg-white rounded-lg shadow-lg flex w-full max-w-4xl overflow-hidden'>
        {/* Left Side - Login/Register Form */}
        <div className='w-1/2 p-10'>
          <h2 className='text-3xl font-bold text-gray-900'>
            {isRegister ? "CREATE AN ACCOUNT" : "WELCOME BACK"}
          </h2>
          <p className='text-gray-500 mb-6'>
            {isRegister
              ? "Sign up now to start tracking your runs!"
              : "Welcome back! Please enter your details."}
          </p>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-gray-700 font-medium'>Email</label>
              <input
                type='email'
                placeholder='Enter your email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 bg-white text-gray-900'
              />
            </div>

            <div>
              <label className='block text-gray-700 font-medium'>
                Password
              </label>
              <input
                type='password'
                placeholder='********'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 bg-white text-gray-900'
              />
            </div>

            <button
              type='submit'
              className='w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition font-semibold'
            >
              {isRegister ? "Sign up" : "Sign in"}
            </button>
          </form>

          <button
            onClick={handleGoogleAuth}
            className='w-full flex items-center justify-center mt-4 border py-2 rounded-md hover:bg-gray-100 transition bg-white text-gray-900'
          >
            <FcGoogle className='text-xl mr-2' />
            {isRegister ? "Sign up with Google" : "Sign in with Google"}
          </button>

          <p className='mt-4 text-center text-gray-500'>
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsRegister(!isRegister)}
              className='text-red-500 font-semibold hover:underline'
            >
              {isRegister ? "Log in here!" : "Sign up for free!"}
            </button>
          </p>
        </div>

        {/* Right Side - Illustration */}
        <div className='w-1/2 bg-gray-100 flex items-center justify-center p-6'>
          <img
            src={authIllustration}
            alt='Authentication Illustration'
            className='max-h-64'
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
