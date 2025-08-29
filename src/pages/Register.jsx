// src/pages/Register.jsx
import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Password validation
  const validatePassword = (pass) =>
    pass.length >= 6 && /[A-Z]/.test(pass) && /[a-z]/.test(pass);

  // Send user to backend
  const sendUserToBackend = async (user, password = null) => {
    const token = await user.getIdToken();
    const res = await fetch("https://ass-server-1.onrender.com/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        firebaseUid: user.uid,
        fullName: user.displayName,
        email: user.email,
        photo: user.photoURL || "",
        phone,
        password, // backend will hash if provided
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Backend error");
    return data;
  };

  // Handle email/password registration
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!fullName.trim()) return toast.error("Full Name is required");
    if (!email.trim()) return toast.error("Email is required");
    if (!validatePassword(password))
      return toast.error(
        "Password must be at least 6 characters, include uppercase & lowercase letters"
      );

    try {
      // Firebase auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update Firebase profile
      await updateProfile(user, { displayName: fullName, photoURL });

      // Send to MongoDB backend
      await sendUserToBackend(user, password);

      toast.success("Account created successfully!");
      navigate("/"); // Redirect to home immediately
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        toast.error("This email is already registered");
      } else if (err.code === "auth/invalid-email") {
        toast.error("Invalid email address");
      } else {
        toast.error(err.message);
      }
    }
  };

  // Handle Google signup
  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Send to backend (password optional)
      await sendUserToBackend(user);

      toast.success("Signed up with Google!");
      navigate("/"); // Redirect to home immediately
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-200 via-pink-100 to-yellow-50 p-4">
      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-lg p-10 relative">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Create Account
        </h2>

        <form onSubmit={handleRegister} className="space-y-5">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="peer w-full px-4 py-3 border rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
            required
          />

          <input
            type="url"
            placeholder="Photo URL (optional)"
            value={photoURL}
            onChange={(e) => setPhotoURL(e.target.value)}
            className="peer w-full px-4 py-3 border rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="peer w-full px-4 py-3 border rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
            required
          />

          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="peer w-full px-4 py-3 border rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer w-full px-4 py-3 pr-12 border rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-3 right-4 cursor-pointer text-gray-600 hover:text-gray-900 transition"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-purple-400 transition"
          >
            Register
          </button>

          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 py-3 rounded-xl font-semibold shadow hover:shadow-gray-300 transition"
          >
            <FcGoogle size={24} /> Sign Up with Google
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Register;
