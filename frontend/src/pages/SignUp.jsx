import { useState } from "react";
import { FaArrowLeft, FaUserCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../../public/logo.png";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import PageShell from "../component/PageShell";
import SurfaceCard from "../component/SurfaceCard";

function SignUp() {
    const [step, setStep] = useState(1);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [backendImage, setBackendImage] = useState(null);
    const [frontendImage, setFrontendImage] = useState(null);

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFrontendImage(URL.createObjectURL(file));
        setBackendImage(file);
    };

    const nextStep = () => {
        if (step === 1) {
            if (!username || !email) {
                toast.error("Please fill all the fields");
                return;
            }
            setStep(2);
            return;
        }

        if (step === 2) {
            if (!password || !confirmPassword) {
                toast.error("Please fill all the fields");
                return;
            }
            if (password !== confirmPassword) {
                toast.error("Passwords do not match");
                return;
            }
            setStep(3);
            return;
        }
    };

    const handleSubmit = async () => {
        if (!backendImage) {
            toast.error("Please select a profile picture");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("username", username);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("profilePicture", backendImage);

        try {
            const res = await axios.post(`${serverUrl}/api/v1/auth/signup`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res.status === 201) {
                toast.success("Account created successfully!");
                dispatch(setUserData(res.data));
                navigate("/signin");
            } else {
                toast.error(res.data.message || "Signup failed");
            }
        } catch (error) {
            console.error("Signup error:", error);
            toast.error(error.response?.data?.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    const prevStep = () => {
        if (step === 1) {
            navigate("/signin");
            return;
        }
        setStep((prev) => prev - 1);
    };

    const headings = {
        1: "Create your PlayTube identity",
        2: "Secure your account",
        3: "Add your avatar",
    };

    const descriptions = {
        1: "Tell us a little about yourself so we can personalize your feed.",
        2: "Protect your channel with a strong password.",
        3: "Upload a profile picture to finish setting things up.",
    };

    const inputClasses =
        "w-full bg-[#1c1c1c] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-gray-400 focus:border-orange-500 focus:outline-none transition";

    return (
        <PageShell contentClassName="flex items-center justify-center min-h-screen">
            <SurfaceCard
                size="sm"
                heading={headings[step]}
                subheading={descriptions[step]}
            >
                <div className="flex justify-between items-center text-gray-400 text-sm">
                    <div className="flex items-center gap-2 font-semibold text-white/80">
                        <img src={logo} alt="logo" className="w-7" />
                        Step {step} of 3
                    </div>
                    <button className="hover:text-white flex items-center gap-2" onClick={prevStep}>
                        <FaArrowLeft />
                        {step === 1 ? "Back to Sign In" : "Back"}
                    </button>
                </div>

                {step === 1 && (
                    <div className="space-y-5">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            className={inputClasses}
                        />

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email address"
                            className={inputClasses}
                        />

                        <button
                            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 text-white py-3 rounded-2xl font-semibold transition"
                            onClick={nextStep}
                        >
                            Continue
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-5">
                        <div className="flex items-center gap-2 bg-[#1c1c1c] border border-white/10 rounded-2xl px-4 py-3">
                            <FaUserCircle className="text-xl text-orange-300" />
                            <span className="text-sm text-gray-300 truncate">{email}</span>
                        </div>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
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

                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm Password"
                                className={`${inputClasses} pr-12`}
                            />
                            <button
                                type="button"
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        <button
                            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 text-white py-3 rounded-2xl font-semibold transition"
                            onClick={nextStep}
                        >
                            Continue
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-28 h-28 rounded-full border border-white/15 bg-[#1c1c1c] overflow-hidden flex items-center justify-center">
                                {frontendImage ? (
                                    <img
                                        src={frontendImage}
                                        alt="Profile Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <FaUserCircle className="text-5xl text-gray-500" />
                                )}
                            </div>
                            <p className="text-sm text-gray-400 text-center">
                                Upload a crisp square image for best results.
                            </p>
                        </div>

                        <label className="block">
                            <span className="text-sm text-gray-300 font-medium">
                                Profile picture
                            </span>
                            <input
                                type="file"
                                accept="image/*"
                                className="mt-2 block w-full text-gray-300 file:mr-4 file:py-2.5 file:px-6 file:rounded-2xl file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer"
                                onChange={handleImage}
                            />
                        </label>

                        <button
                            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-2xl font-semibold transition flex justify-center items-center"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <ClipLoader size={22} color="white" />
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </div>
                )}
            </SurfaceCard>
        </PageShell>
    );
}

export default SignUp;
