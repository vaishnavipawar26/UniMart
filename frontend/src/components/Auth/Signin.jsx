import React, { useState } from "react";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { serverUrl } from "../../config";
import { useNavigate } from "react-router-dom";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../../../firebase";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/userSlice";

const auth = getAuth(app);

function Signin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const dispatch=useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    if (!form.checkValidity()) {
      e.stopPropagation();
      form.classList.add("was-validated");
      return;
    }

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      setError("");
    
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Invalid email or password");
    }
  };

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const { data } = await axios.post(
        `${serverUrl}/api/auth/google-auth`,
        {
          email: result.user.email,
        },
        { withCredentials: true }
      );
      dispatch(setUserData(data));
    } catch (error) {
      console.log(error);
      setError("Google sign-in failed");
    }
  };

  return (
    <form
      className="needs-validation"
      noValidate
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      <input style={{ display: "none" }} type="text" name="hidden" autoComplete="off" />
      <h2 className="text-center mb-4">Sign In</h2>

      {/* Email Field */}
      <div className="mb-3">
        <label className="form-label fw-bold">Email</label>
        <input
          type="email"
          name="signin-email" 
          id="signinEmail"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          className="form-control"
          autoComplete="off" 
          required
        />
        <div className="invalid-feedback">Please enter your email.</div>
      </div>

      {/* Password Field */}
      <div className="mb-3">
        <label className="form-label fw-bold">Password</label>
        <input
          type={showPassword ? "text" : "password"}
          name="signin-password" 
          id="signinPassword"
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          className="form-control"
          autoComplete="new-password"
          required
          minLength="6"
        />
        <div style={{ marginTop: "5px" }}>
          <input
            type="checkbox"
            id="showPass"
            onChange={() => setShowPassword(!showPassword)}
          />{" "}
          <label htmlFor="showPass">Show Password</label>
        </div>
        <div className="invalid-feedback">Please enter your password.</div>
      </div>

      {/* Forgot Password */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "10px",
        }}
      >
        <button
          type="button"
          onClick={() => navigate("/forgot-password")}
          style={{
            background: "none",
            border: "none",
            color: "#433D8B",
            fontWeight: "bold",
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          Forgot Password?
        </button>
      </div>

      {/* Submit Button */}
      <div className="d-flex flex-column align-items-center justify-content-center mt-3">
        <button
          type="submit"
          className="btn mb-3"
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
          Sign In
        </button>

        {/* Error Message */}
        {error && (
          <p
            className="text-danger text-center"
            style={{
              margin: "10px 0",
              fontWeight: "500",
            }}
          >
            {error}
          </p>
        )}

        {/* Google Sign-in */}
        <button
          type="button"
          className="btn d-flex align-items-center justify-content-center"
          style={{
            width: "350px",
            backgroundColor: "white",
            color: "black",
            borderRadius: "5px",
            padding: "8px 0",
            border: "1px solid #ccc",
            cursor: "pointer",
            fontWeight: "bold",
            gap: "8px",
          }}
          onClick={handleGoogleAuth}
        >
          <FcGoogle size={24} />
          Sign In with Google
        </button>
      </div>
    </form>
  );
}

export default Signin;

