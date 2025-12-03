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
      toast.success(res.data.message);
      dispatch(setUserData(res.data));
      console.log(res.data);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#181818]">
      <div className="bg-[#202124] rounded-2xl p-10 w-full max-w-md shadow-lg">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="w-12" />
        </div>

        {/* Title */}
        <h1 className="text-white text-3xl font-medium mb-6 text-center">Sign In</h1>

        {/* Email */}
        <div className="flex items-center bg-[#3c4043] text-white px-3 py-2 rounded-full mb-4">
          <FaUserCircle size={24} className="mr-2" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="bg-transparent w-full focus:outline-none text-white"
          />
        </div>

        {/* Password */}
        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-[#3c4043] text-white px-3 py-3 rounded-full focus:outline-none"
          />
          <button
            type="button"
            className="absolute right-4 top-3 text-gray-400 hover:text-white"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Sign In Button */}
        <button
          onClick={handleSignIn}
          disabled={loading}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-full transition"
        >
          {loading ? <ClipLoader size={20} color="white" /> : "Sign In"}
        </button>

        {/* Links */}
        <div className="flex justify-between mt-4 text-gray-400 text-sm">
          <button onClick={() => navigate("/signup")} className="hover:text-white">
            Create Account
          </button>
          <button className="hover:text-white">Forgot Password?</button>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
