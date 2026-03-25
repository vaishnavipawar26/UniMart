import React, { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
 import { serverUrl } from "../../config";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState(""); // variable name fixed
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Step 1 — Send OTP
  const handleSendOtp = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/send-otp`,
        { email },
        { withCredentials: true }
      );
      setStep(2);
    } catch (error) {
      setError(error.response?.data?.message);
    }
  };

  //  Step 2 — Verify OTP
  const handleVerifyOtp = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/verify-otp`,
        { email, otp },
        { withCredentials: true }
      );
      setStep(3);
    } catch (error) {
      setError(error.response?.data?.message);
    }
  };

  // Step 3 — Reset Password
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/reset-password`,
        { email, newPassword }, // ✅ key names should match backend
        { withCredentials: true }
      );

      alert("Password reset successful!");
      navigate("/", { state: { showSignin: true } });
    } catch (error) {
      setError(error.response?.data?.message);
        }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
      }}
    >
      <div
        className="card shadow p-4"
        style={{
          width: "400px",
          borderRadius: "10px",
          border: "none",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#433D8B",
            fontWeight: "bold",
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          <IoIosArrowRoundBack
            size={30}
            onClick={() => navigate("/", { state: { showSignin: true } })}
          />
          <p style={{ margin: 0 }}>Forgot Password</p>
        </div>



        {/* Step 1 — Email */}
      {console.log("Current step:", step)}  
        {step === 1 && (
          <div>
            <label className="form-label fw-bold mt-3">Email</label>
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="form-control"
            />
           
           {error && <p className="text-danger text-center" style={{ margin: "10px 0", fontWeight: "500" }}>{error}</p>}


            <div className="d-flex flex-column align-items-center justify-content-center mt-3">
              <button
                onClick={handleSendOtp}
                style={{
                  width: "350px",
                  backgroundColor: "#433D8B",
                  color: "white",
                  borderRadius: "5px",
                  padding: "8px 0",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Send OTP
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — OTP Verification */}
        {step === 2 && (
          <div>
            <label className="form-label fw-bold mt-3">OTP</label>
            <input
              type="text"
              placeholder="Enter your OTP"
              onChange={(e) => setOtp(e.target.value)}
              value={otp}
              className="form-control"
            />

            {error && <p className="text-danger text-center" style={{ margin: "10px 0", fontWeight: "500" }}>{error}</p>}

            <div className="d-flex flex-column align-items-center justify-content-center mt-3">
              <button
                onClick={handleVerifyOtp}
                style={{
                  width: "350px",
                  backgroundColor: "#433D8B",
                  color: "white",
                  borderRadius: "5px",
                  padding: "8px 0",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Verify
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Reset Password */}
        {step === 3 && (
          <div>
            <label className="form-label fw-bold">New Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
              className="form-control"
              required
            />

            {error && <p className="text-danger text-center" style={{ margin: "10px 0", fontWeight: "500" }}>{error}</p>}

            <label className="form-label fw-bold mt-3">Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              className="form-control"
              required
            />

            <div className="d-flex flex-column align-items-center justify-content-center mt-3">
              <button
                onClick={handleResetPassword}
                style={{
                  width: "350px",
                  backgroundColor: "#433D8B",
                  color: "white",
                  borderRadius: "5px",
                  padding: "8px 0",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Reset Password
              </button>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;

