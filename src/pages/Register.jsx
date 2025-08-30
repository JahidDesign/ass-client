import React, { useState, useContext } from "react";
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
import { ThemeContext } from "../context/ThemeContext";

const Register = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [fullName, setFullName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (pass) =>
    pass.length >= 6 && /[A-Z]/.test(pass) && /[a-z]/.test(pass);

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
        password,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Backend error");
    return data;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) return toast.error("Full Name is required");
    if (!email.trim()) return toast.error("Email is required");
    if (!validatePassword(password))
      return toast.error(
        "Password must be at least 6 characters, include uppercase & lowercase letters"
      );

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: fullName, photoURL });
      await sendUserToBackend(user, password);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") toast.error("This email is already registered");
      else if (err.code === "auth/invalid-email") toast.error("Invalid email address");
      else toast.error(err.message);
    }
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await sendUserToBackend(user);
      toast.success("Signed up with Google!");
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gradient-to-r from-purple-200 via-pink-100 to-yellow-50"
      }`}
    >
      <div
        className={`rounded-3xl w-full max-w-lg p-10 shadow-2xl relative ${
          isDark ? "bg-gray-800 shadow-gray-700" : "bg-white shadow-2xl"
        }`}
      >
        <h2 className="text-3xl font-bold text-center mb-8">
          Create Account
        </h2>

        <form onSubmit={handleRegister} className="space-y-5">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={`peer w-full px-4 py-3 border rounded-xl outline-none transition ${
              isDark
                ? "bg-gray-700 border-gray-600 placeholder-gray-300 text-gray-100 focus:border-green-400 focus:ring-green-400"
                : "bg-white border-gray-300 placeholder-gray-500 text-gray-800 focus:border-purple-500 focus:ring-purple-500"
            }`}
            required
          />

          <input
            type="url"
            placeholder="Photo URL (optional)"
            value={photoURL}
            onChange={(e) => setPhotoURL(e.target.value)}
            className={`peer w-full px-4 py-3 border rounded-xl outline-none transition ${
              isDark
                ? "bg-gray-700 border-gray-600 placeholder-gray-300 text-gray-100 focus:border-green-400 focus:ring-green-400"
                : "bg-white border-gray-300 placeholder-gray-500 text-gray-800 focus:border-purple-500 focus:ring-purple-500"
            }`}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`peer w-full px-4 py-3 border rounded-xl outline-none transition ${
              isDark
                ? "bg-gray-700 border-gray-600 placeholder-gray-300 text-gray-100 focus:border-green-400 focus:ring-green-400"
                : "bg-white border-gray-300 placeholder-gray-500 text-gray-800 focus:border-purple-500 focus:ring-purple-500"
            }`}
            required
          />

          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`peer w-full px-4 py-3 border rounded-xl outline-none transition ${
              isDark
                ? "bg-gray-700 border-gray-600 placeholder-gray-300 text-gray-100 focus:border-green-400 focus:ring-green-400"
                : "bg-white border-gray-300 placeholder-gray-500 text-gray-800 focus:border-purple-500 focus:ring-purple-500"
            }`}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`peer w-full px-4 py-3 pr-12 border rounded-xl outline-none transition ${
                isDark
                  ? "bg-gray-700 border-gray-600 placeholder-gray-300 text-gray-100 focus:border-green-400 focus:ring-green-400"
                  : "bg-white border-gray-300 placeholder-gray-500 text-gray-800 focus:border-purple-500 focus:ring-purple-500"
              }`}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-3 right-4 cursor-pointer text-gray-400 hover:text-gray-200 transition"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </span>
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-xl font-semibold shadow-lg transition ${
              isDark
                ? "bg-green-600 hover:bg-green-700 text-white shadow-green-400"
                : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-purple-400"
            }`}
          >
            Register
          </button>

          <button
            type="button"
            onClick={handleGoogleSignUp}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold shadow transition ${
              isDark
                ? "bg-gray-700 border border-gray-600 hover:bg-gray-600 text-gray-100"
                : "bg-white border border-gray-300 hover:shadow-gray-300"
            }`}
          >
            <FcGoogle size={24} /> Sign Up with Google
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className={`font-medium hover:underline ${
              isDark ? "text-green-400" : "text-purple-600"
            }`}
          >
            Login
          </Link>
        </p>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Register;
