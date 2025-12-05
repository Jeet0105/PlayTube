import React, { useState } from "react";
import { FaUserCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../../public/logo.png";
import { toast } from "react-toastify";
import axios from "axios";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import PageShell from "../component/PageShell";
import SurfaceCard from "../component/SurfaceCard";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleSignIn = async () => {
    if (!email || !password) {
      toast.error("Please fill all the fields");
      return;
    }

    setLoading(true);
    // const formData = new FormData();
    // formData.append("email", email);
    // formData.append("password", password);
    try {
      const res = await axios.post(`${serverUrl}/api/v1/auth/signin`, { email, password }, { withCredentials: true });
      toast.success(res?.data?.message);
      dispatch(setUserData(res.data.user));
      console.log(res.data);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Sign in failed");
    } finally {
      setLoading(false);
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
          {loading ? <ClipLoader size={20} color="white" /> : "Sign In"}
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
