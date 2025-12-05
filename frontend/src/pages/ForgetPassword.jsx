import { useState } from 'react';
import logo from '../../public/logo.png';
import { useNavigate } from 'react-router-dom';
import PageShell from '../component/PageShell';
import SurfaceCard from '../component/SurfaceCard';
import { toast } from 'react-toastify';
import axios from 'axios';
import { serverUrl } from '../App';
import { ClipLoader } from 'react-spinners';

function ForgetPassword() {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [OTP, setOTP] = useState('');
    const [resetPassword, setResetPassword] = useState('');
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    const steps = {
        1: {
            heading: "Reset your password",
            description: "Enter the email linked to your PlayTube account.",
            actionLabel: "Send OTP",
        },
        2: {
            heading: "Verify the OTP",
            description: "We’ve sent a 4-digit code to your inbox.",
            actionLabel: "Verify OTP",
        },
        3: {
            heading: "Create a new password",
            description: "Pick a strong password you’ll remember.",
            actionLabel: "Reset Password",
        },
    };

    const inputClasses =
        "w-full bg-[#1c1c1c] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-gray-400 focus:border-orange-500 focus:outline-none transition";

    // SEND OTP
    const handleSendOtp = async () => {
        if (!email.trim()) {
            toast.error("Email cannot be empty");
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post(
                `${serverUrl}/api/v1/auth/sendotp`,
                { email: email.trim().toLowerCase() },
                { withCredentials: true }
            );

            toast.success(res.data?.message || "OTP sent successfully");
            setStep(2);

        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong. Try again!");
            console.error("Send OTP Error:", error);
        } finally {
            setLoading(false);
        }
    };

    // VERIFY OTP
    const handleVerifyOtp = async () => {
        if (!OTP.trim() || OTP.length < 4) {
            toast.error("Enter a valid OTP");
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post(
                `${serverUrl}/api/v1/auth/verifyotp`,
                { email: email.trim().toLowerCase(), otp: OTP },
                { withCredentials: true }
            );

            toast.success(res.data?.message || "OTP verified successfully");
            setStep(3);

        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid OTP. Try again!");
            console.error("Verify OTP Error:", error);
        } finally {
            setLoading(false);
        }
    };

    // RESET PASSWORD
    const handleResetPassword = async () => {
        if (!resetPassword.trim() || resetPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post(
                `${serverUrl}/api/v1/auth/resetpassword`,
                { email: email.trim().toLowerCase(), newPassword: resetPassword },
                { withCredentials: true }
            );

            toast.success(res.data?.message || "Password reset successfully");
            navigate("/signin");

        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to reset password.");
            console.error("Reset Password Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageShell contentClassName="flex items-center justify-center min-h-screen">
            <SurfaceCard
                size="sm"
                heading={steps[step].heading}
                subheading={steps[step].description}
            >
                <div className="flex items-center gap-3 text-gray-300 mb-3">
                    <img src={logo} alt="Logo" className='w-10' />
                    <span className='text-sm uppercase tracking-widest text-gray-400'>
                        Step {step} of 3
                    </span>
                </div>

                {/* Step 1 — Enter Email */}
                {step === 1 && (
                    <div className='space-y-4'>
                        <label className='text-sm text-gray-300 font-medium'>
                            Email address
                        </label>

                        <input
                            type="email"
                            className={inputClasses}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            placeholder="you@playtube.com"
                        />

                        <button
                            type="button"
                            className='w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 text-white font-semibold py-3 rounded-2xl transition'
                            onClick={handleSendOtp}
                            disabled={loading}
                        >
                            {loading ? <ClipLoader color='black' size={20} /> : steps[step].actionLabel}
                        </button>

                        <button
                            className='w-full text-sm text-gray-400 hover:text-white'
                            onClick={() => navigate('/signin')}
                        >
                            Back to Sign In
                        </button>
                    </div>
                )}

                {/* Step 2 — Enter OTP */}
                {step === 2 && (
                    <div className='space-y-4'>
                        <label className='text-sm text-gray-300 font-medium'>
                            OTP
                        </label>

                        <input
                            type="number"
                            className={inputClasses}
                            value={OTP}
                            onChange={(e) => setOTP(e.target.value)}
                            disabled={loading}
                            placeholder="1234"
                        />

                        <button
                            type="button"
                            className='w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 text-white font-semibold py-3 rounded-2xl transition'
                            onClick={handleVerifyOtp}
                            disabled={loading}
                        >
                            {loading ? <ClipLoader /> : steps[step].actionLabel}
                        </button>

                        <div className='flex justify-between text-sm text-gray-400'>
                            <button className='hover:text-white' onClick={handleSendOtp} disabled={loading}>
                                Resend OTP
                            </button>
                            <button className='hover:text-white' onClick={() => navigate('/signin')}>
                                Back to Sign In
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3 — Create New Password */}
                {step === 3 && (
                    <div className='space-y-4'>
                        <label className='text-sm text-gray-300 font-medium'>
                            New Password
                        </label>

                        <input
                            type={show ? "text" : "password"}
                            className={inputClasses}
                            value={resetPassword}
                            onChange={(e) => setResetPassword(e.target.value)}
                            disabled={loading}
                            placeholder="••••••••"
                        />

                        <label className='flex items-center gap-2 text-sm text-gray-400'>
                            <input
                                type="checkbox"
                                onChange={() => setShow(!show)}
                                checked={show}
                                className='accent-orange-500'
                            />
                            Show password
                        </label>

                        <button
                            type="button"
                            className='w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 text-white font-semibold py-3 rounded-2xl transition'
                            onClick={handleResetPassword}
                            disabled={loading}
                        >
                            {loading ? <ClipLoader /> : steps[step].actionLabel}
                        </button>

                        <button
                            className='w-full text-sm text-gray-400 hover:text-white'
                            onClick={() => navigate('/signin')}
                        >
                            Back to Sign In
                        </button>
                    </div>
                )}

            </SurfaceCard>
        </PageShell>
    );
}

export default ForgetPassword;
