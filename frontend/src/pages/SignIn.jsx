import React, { useState } from "react";
import { FaUserCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import logo from "../../public/logo.png";
import { toast } from "react-toastify";
import api from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import LoadingSpinner from "../components/LoadingSpinner";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/firebase";
import PageShell from "../component/PageShell";
import SurfaceCard from "../component/SurfaceCard";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e?.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill all the fields");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(API_ENDPOINTS.AUTH.SIGNIN, { 
        email: email.trim(), 
        password 
      });
      
      if (res.data.success && res.data.user) {
        toast.success(res.data.message);
        dispatch(setUserData(res.data.user));
        navigate("/");
      }
    } catch (error) {
      // Error is handled by axios interceptor
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (googleLoading) return;
    
    setGoogleLoading(true);
    try {
      const res = await signInWithPopup(auth, provider);
      const { displayName, email, photoURL } = res.user;

      const userData = {
        username: displayName,
        email: email,
        profilePictureUrl: photoURL,
      };
      
      const response = await api.post(API_ENDPOINTS.AUTH.GOOGLE_AUTH, userData);
      if (response.data.success && response.data.user) {
        toast.success(response.data.message || "Signed in with Google successfully.");
        dispatch(setUserData(response.data.user));
        navigate("/");
      }
    } catch (error) {
      // Error is handled by axios interceptor
      console.error("Error during Google sign-in:", error);
    } finally {
      setGoogleLoading(false);
    }
  };

  const inputClasses =
    "w-full bg-[#1c1c1c] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-gray-400 focus:border-orange-500 focus:outline-none transition";

  return (
    <PageShell contentClassName="flex items-center justify-center min-h-screen">
      <SurfaceCard
        size="sm"
        heading="Welcome back"
        subheading="Sign in to keep watching and manage your subscriptions."
      >
        <div className="flex justify-center">
          <img src={logo} alt="Logo" className="w-14" />
        </div>

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={googleLoading || loading}
          className="w-full bg-[#1c1c1c] border border-white/10 hover:bg-white/5 text-white py-3 rounded-2xl font-medium transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {googleLoading ? (
            <LoadingSpinner size={20} color="#fff" />
          ) : (
            <>
              <FcGoogle className="text-2xl" />
              <span>Continue with Google</span>
            </>
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="text-sm text-gray-400">or</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        <div className="space-y-4">
          <label className="text-sm text-gray-300 font-medium flex items-center gap-2">
            <FaUserCircle />
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@playtube.com"
            className={inputClasses}
          />
        </div>

        <div className="space-y-4">
          <label className="text-sm text-gray-300 font-medium flex items-center gap-2">
            <FaEye className="text-xs opacity-70" />
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`${inputClasses} pr-12`}
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <button
          onClick={handleSignIn}
          disabled={loading}
          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 text-white py-3 rounded-2xl font-semibold transition disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? <LoadingSpinner size={20} color="#fff" /> : "Sign In"}
        </button>

        <div className="flex flex-wrap justify-between gap-4 text-gray-400 text-sm">
          <button onClick={() => navigate("/signup")} className="hover:text-white">
            Create Account
          </button>
          <button className="hover:text-white" onClick={() => navigate("/forgetpass")}>
            Forgot Password?
          </button>
        </div>
      </SurfaceCard>
    </PageShell>
  );
}

export default SignIn;
