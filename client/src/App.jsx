import { useState } from "react";
import Navbar from "./components/Navbar";
import NotesPage from "./components/NotesPage";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup form state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  function isValidEmail(email) {
    // Simple but pretty good regex for email validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  function validatePassword(password) {
    if (password.length < 6) {
      toast.error("Please enter more than five characters.");
      return false;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      toast.error("Please enter at least one special character.");
      return false;
    }
    return true;
  }



  async function handleLogin() {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        setIsLoggedIn(true);
        // You can save token or user info here if needed
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      alert("Login error: " + err.message);
    }
  }

  async function handleSignup() {
    if (!isValidEmail(signupEmail)) {
      toast.error("Please enter a valid email address");
      return; // stop submitting if email is invalid
    }
    if (!validatePassword(signupPassword)) {
      return; // stop signup if invalid password
    }
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupName,
          email: signupEmail,
          password: signupPassword,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Signup successful! Please login.");
        setIsLogin(true);
        // Optionally clear signup form here
        setSignupName("");
        setSignupEmail("");
        setSignupPassword("");
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (err) {
      toast.error("Signup error: " + err.message);
    }
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <div
        className="flex flex-col min-h-screen 
      bg-gradient-to-r from-blue-400 to-pink-400 
      dark:from-gray-900 dark:to-indigo-900"
      >
        <Navbar />

        <main className="flex-grow flex items-center justify-center">
          {isLoggedIn ? (
            <NotesPage />
          ) : (
            <div className="relative w-80 h-96 border-2 border-white backdrop-blur-lg rounded-lg overflow-hidden">
              {/* Forms wrapper */}
              <div
                className={`flex w-[200%] h-full transition-transform duration-500 ease-in-out`}
                style={{
                  transform: isLogin ? "translateX(0%)" : "translateX(-50%)",
                }}
              >
                {/* Login Form */}
                <div className="w-1/2 flex flex-col items-center justify-center p-6 text-white">
                  <h2 className="text-2xl font-bold mb-4">Login</h2>
                  <input
                    type="email"
                    placeholder="Email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="mb-3 p-3 rounded w-full bg-white/30 backdrop-blur-md text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
                    style={{ color: "#756363ff" }}
                  />
                  <div className="mb-3 w-full relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="p-3 rounded w-full bg-white/30 backdrop-blur-md text-white placeholder-white text-opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
                      style={{ color: "#ffffff" }}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-white"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>

                  <button
                    className="bg-blue-500 px-4 py-2 rounded"
                    onClick={handleLogin}
                  >
                    Login
                  </button>

                  <p className="mt-4 text-white">
                    Don't have an account?{" "}
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsLogin(false);
                      }}
                      className="inline font-semibold text-white hover:text-white hover:underline focus:outline-none"
                    >
                      Sign up
                    </a>
                  </p>
                </div>

                {/* Signup Form */}
                <div className="w-1/2 flex flex-col items-center justify-center p-6 text-white">
                  <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
                  <input
                    type="text"
                    placeholder="Name"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="mb-3 p-3 rounded w-full bg-white/30 backdrop-blur-md text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
                    style={{ color: "#ffffff" }}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="mb-3 p-3 rounded w-full bg-white/30 backdrop-blur-md text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
                    style={{ color: "#ffffff" }}
                  />
                  <div className="mb-3 w-full relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="p-3 rounded w-full bg-white/30 backdrop-blur-md text-white placeholder-white text-opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
                      style={{ color: "#ffffff" }}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-white"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  <button
                    className="bg-blue-500 px-4 py-2 rounded"
                    onClick={handleSignup}
                  >
                    Signup
                  </button>
                  <p className="mt-4 text-white">
                    Already have an account?{" "}
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsLogin(true);
                      }}
                      className="inline font-semibold text-white hover:text-white hover:underline focus:outline-none"
                    >
                      Login
                    </a>
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
