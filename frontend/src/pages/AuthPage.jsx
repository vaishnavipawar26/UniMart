import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Signin from "../components/Auth/Signin";
import Signup from "../components/Auth/Signup";

function AuthPage() {
  const [isSignup, setIsSignup] = useState(true);


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
      <h1 style={{ color: "#2E236C", marginBottom: "30px", fontWeight: "bold" }}>
        UniMart
      </h1>

      <div
        className="card shadow p-4"
        style={{ width: "400px", borderRadius: "10px", border: "none" }}
      >
        {isSignup ? <Signup /> : <Signin />}

        <p className="text-center mt-3 mb-0">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            className="btn btn-link p-0"
            onClick={() => setIsSignup(!isSignup)}
            style={{
              color: "#433D8B",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            {isSignup ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthPage;

