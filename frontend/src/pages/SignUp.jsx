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
                navigate("/");
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

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#181818]">
            <div className="bg-[#202124] rounded-2xl p-10 w-full max-w-md shadow-lg">

                {/* Header */}
                <div className="flex items-center mb-6">
                    <button className="text-gray-300 mr-3 hover:text-white" onClick={prevStep}>
                        <FaArrowLeft size={20} />
                    </button>
                    <span className="text-white text-2xl font-medium flex-1">Create Account</span>
                </div>

                {/* STEP 1 */}
                {step === 1 && (
                    <>
                        <h1 className="text-white text-3xl font-normal mb-2 flex items-center gap-2">
                            <img src={logo} alt="logo" className="w-8" />
                            Basic Info
                        </h1>

                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            className="w-full bg-transparent border border-gray-500 rounded-md px-3 py-3 text-white focus:border-orange-500 mb-4"
                        />

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="w-full bg-transparent border border-gray-500 rounded-md px-3 py-3 text-white focus:border-orange-500 mb-4"
                        />

                        <button
                            className="mt-6 w-full bg-orange-600 hover:bg-orange-700 transition text-white py-3 rounded-lg"
                            onClick={nextStep}
                        >
                            Next
                        </button>
                    </>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <>
                        <h1 className="text-white text-3xl font-normal mb-2 flex items-center gap-2">
                            <img src={logo} alt="logo" className="w-8" />
                            Security
                        </h1>

                        <div className="flex items-center bg-[#3c4043] text-white px-3 py-2 rounded-full w-fit mb-6">
                            <FaUserCircle size={24} className="mr-2" />
                            {email}
                        </div>

                        <div className="relative mb-4">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full bg-transparent border border-gray-500 rounded-md px-3 py-3 text-white"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-3 text-gray-400 hover:text-white"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        <div className="relative mb-4">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm Password"
                                className="w-full bg-transparent border border-gray-500 rounded-md px-3 py-3 text-white"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-3 text-gray-400 hover:text-white"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        <button
                            className="mt-6 w-full bg-orange-600 hover:bg-orange-700 transition text-white py-3 rounded-lg"
                            onClick={nextStep}
                        >
                            Next
                        </button>
                    </>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                    <>
                        <h1 className="text-white text-3xl font-normal mb-6 text-center">
                            Choose Avatar
                        </h1>

                        <div className="flex flex-col items-center gap-6">
                            <div className="w-28 h-28 rounded-full border-4 border-gray-500 overflow-hidden shadow-lg flex items-center justify-center">
                                {frontendImage ? (
                                    <img
                                        src={frontendImage}
                                        alt="Profile Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <FaUserCircle className="text-gray-400 w-full h-full p-2" />
                                )}
                            </div>

                            <div className="flex flex-col gap-2 w-full">
                                <label className="text-gray-300 font-medium">Choose Profile Picture</label>

                                <input
                                    type="file"
                                    accept="image/*"
                                    className="block w-full text-gray-400
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-orange-600 file:text-white
                                        hover:file:bg-orange-700
                                        cursor-pointer"
                                    onChange={handleImage}
                                />
                            </div>
                        </div>

                        <button
                            className="mt-6 w-full bg-green-600 hover:bg-green-700 transition text-white py-3 rounded-lg flex justify-center items-center"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <ClipLoader size={22} color="black" />
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default SignUp;
