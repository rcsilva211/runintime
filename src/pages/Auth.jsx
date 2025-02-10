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
import { motion } from "framer-motion";

const Auth = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/");
    } catch (error) {
      console.error("Authentication failed:", error.message);
      setError("Invalid email or password.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (error) {
      console.error("Google authentication failed:", error.message);
      setError("Failed to authenticate with Google.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='flex items-center justify-center w-screen h-screen bg-[#eb444c] p-4'
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className='bg-white rounded-lg shadow-lg flex flex-col md:flex-row w-full max-w-4xl overflow-hidden'
      >
        {/* Left Side - Login/Register Form */}
        <motion.div
          key={isRegister ? "register" : "login"}
          initial={{ x: isRegister ? 100 : -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: isRegister ? -100 : 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className='w-full md:w-1/2 p-6 md:p-10'
        >
          <h2 className='text-3xl font-bold text-gray-900 text-center md:text-left'>
            {isRegister ? "CREATE AN ACCOUNT" : "WELCOME BACK"}
          </h2>
          <p className='text-gray-500 mb-6 text-center md:text-left'>
            {isRegister
              ? "Sign up now to start tracking your runs!"
              : "Please enter your details to login."}
          </p>

          <motion.form
            onSubmit={handleSubmit}
            className='space-y-4'
            animate={shake ? { x: [-5, 5, -5, 5, 0] } : {}}
            transition={{ duration: 0.2 }}
          >
            <div>
              <label className='block text-gray-700 font-medium'>Email</label>
              <input
                type='email'
                placeholder='Enter your email'
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                required
                className={`w-full px-4 py-2 border ${
                  error ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 ${
                  error ? "focus:ring-red-500" : "focus:ring-red-400"
                } bg-white text-gray-900`}
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
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                required
                className={`w-full px-4 py-2 border ${
                  error ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 ${
                  error ? "focus:ring-red-500" : "focus:ring-red-400"
                } bg-white text-gray-900`}
              />
            </div>

            {/* Error Message Display */}
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='text-red-500 text-sm font-medium mt-1'
              >
                {error}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type='submit'
              className='w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition font-semibold'
            >
              {isRegister ? "Sign up" : "Sign in"}
            </motion.button>
          </motion.form>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoogleAuth}
            className='w-full flex items-center justify-center mt-4 border py-2 rounded-md hover:bg-gray-100 transition bg-white text-gray-900'
          >
            <FcGoogle className='text-xl mr-2' />
            {isRegister ? "Sign up with Google" : "Sign in with Google"}
          </motion.button>

          <p className='mt-4 text-center text-gray-500'>
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
              }}
              className='bg-red-500 text-white font-semibold px-5 py-2 rounded-lg transition-all 
             hover:text-red-500 hover:bg-white hover:shadow-md'
            >
              {isRegister ? "Log in here!" : "Sign up for free!"}
            </motion.button>
          </p>
        </motion.div>

        {/* Right Side - Illustration (Hidden on small screens) */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className='hidden md:flex w-1/2 bg-gray-100 items-center justify-center'
        >
          <img src={authIllustration} alt='Authentication Illustration' />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Auth;
