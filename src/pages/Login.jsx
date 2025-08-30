// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { ThemeContext } from "../context/ThemeContext"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext); 

  // -----------------------------
  // Login to backend (email/password)
  // -----------------------------
  const loginWithEmailBackend = async (email, password) => {
    const res = await fetch("https://ass-server-1.onrender.com/customers/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Email login failed");
    return data;
  };

  // -----------------------------
  // Login to backend (Firebase)
  // -----------------------------
  const loginWithFirebaseBackend = async (user) => {
    const token = await user.getIdToken();

    const res = await fetch(
      "https://ass-server-1.onrender.com/customers/firebase-login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          picture: user.photoURL,
        }),
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Firebase login failed");
    return data;
  };

  // -----------------------------
  // Handle Email/Password Login
  // -----------------------------
  const handleEmailLogin = async (e) => {
    e.preventDefault();

    if (!email.trim()) return toast.error("Email is required");
    if (!password) return toast.error("Password is required");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await loginWithEmailBackend(email, password);

      toast.success("Logged in successfully!");
      navigate("/");
    } catch (err) {
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        toast.error("Invalid email or password");
      } else {
        toast.error(err.message);
      }
    }
  };

  // -----------------------------
  // Handle Google Login
  // -----------------------------
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await loginWithFirebaseBackend(user);

      toast.success("Logged in with Google!");
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-r from-purple-200 via-pink-100 to-yellow-50 text-gray-900"
      }`}
    >
      <div
        className={`shadow-2xl rounded-3xl w-full max-w-lg p-10 relative transition-colors duration-300 ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h2
          className={`text-3xl font-bold text-center mb-8 ${
            theme === "dark" ? "text-yellow-400" : "text-gray-800"
          }`}
        >
          Login
        </h2>

        <form onSubmit={handleEmailLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`peer w-full px-4 py-3 border rounded-xl outline-none transition ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600 text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                : "bg-white border-gray-300 text-black focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            }`}
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`peer w-full px-4 py-3 pr-12 border rounded-xl outline-none transition ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                  : "bg-white border-gray-300 text-black focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              }`}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-3 right-4 cursor-pointer transition"
            >
              {showPassword ? (
                <FiEyeOff
                  size={20}
                  className={theme === "dark" ? "text-gray-300" : "text-gray-600"}
                />
              ) : (
                <FiEye
                  size={20}
                  className={theme === "dark" ? "text-gray-300" : "text-gray-600"}
                />
              )}
            </span>
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-xl font-semibold shadow-lg transition ${
              theme === "dark"
                ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-purple-400"
            }`}
          >
            Login
          </button>

          <button
            onClick={handleGoogleLogin}
            type="button"
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold shadow transition ${
              theme === "dark"
                ? "bg-gray-700 border border-gray-600 text-white hover:bg-gray-600"
                : "bg-white border border-gray-300 text-black hover:shadow-gray-300"
            }`}
          >
            <FcGoogle size={24} /> Login with Google
          </button>
        </form>

        <p
          className={`text-center mt-6 ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            className={`font-medium hover:underline ${
              theme === "dark" ? "text-yellow-400" : "text-purple-600"
            }`}
          >
            Register
          </Link>
        </p>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Login;
