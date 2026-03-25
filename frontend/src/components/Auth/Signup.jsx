import React, { useState } from "react";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { serverUrl } from "../../config";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../../../firebase";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/userSlice";

const auth = getAuth(app);

function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if form is invalid → stop
    const form = e.target;
    if (!form.checkValidity()) {
      e.stopPropagation();
      form.classList.add("was-validated");
      return;
    }
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { fullName, email, password, mobile, role },
        { withCredentials: true },
      );
      dispatch(setUserData(result.data));
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleGoogleAuth = async () => {
    if (!mobile) return setError("Mobile number is required");

    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const { data } = await axios.post(
        `${serverUrl}/api/auth/google-auth`,
        {
          fullName: result.user.displayName,
          email: result.user.email,
          role,
          mobile,
        },
        { withCredentials: true },
      );
      dispatch(setUserData(data));
    } catch (error) {
      console.error(error);
      setError("Google sign-in failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      autoComplete="off"
      className="needs-validation"
      noValidate
    >
      <h2 className="text-center mb-4">Sign Up</h2>

      <div className="row mb-3">
        <div className="col-6">
          <label className="form-label fw-bold">Full Name</label>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            className="form-control"
            required
          />
          <div className="invalid-feedback">Enter full name.</div>
        </div>

        <div className="col-6">
          <label className="form-label fw-bold">Mobile Number</label>
          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            onChange={(e) => setMobile(e.target.value)}
            value={mobile}
            className="form-control"
            required
            pattern="^[0-9]{10}$"
          />
          <div className="invalid-feedback">Enter 10-digit mobile number.</div>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          autoComplete="off"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          className="form-control"
          required
        />
        <div className="invalid-feedback">Enter a valid email id</div>
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">Password</label>
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          className="form-control"
          autoComplete="new-password"
          required
          minLength="6"
        />
        <div className="invalid-feedback">Enter 6-digit Password.</div>
      </div>

      <div style={{ marginBottom: "15px" }}>
        {/* Label on top */}
        <label
          style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}
        >
          Signup As
        </label>

        {/* Buttons below the label */}
        <div style={{ display: "flex", gap: "5px" }}>
          {["student", "vendor", "delivery"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              style={{
                padding: "5px 30px",
                borderRadius: "5px",
                border: "1px solid gray",
                backgroundColor: role === r ? "#433D8B" : "white",
                color: role === r ? "white" : "black",
                cursor: "pointer",
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

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
          Sign Up
        </button>

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
          Sign up with Google
        </button>
      </div>
    </form>
  );
}

export default Signup;
