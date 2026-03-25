import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoCartOutline, IoSearchOutline } from "react-icons/io5";
import axios from "axios";
import { serverUrl } from "../config";
import { setSearchItems, setUserData } from "../redux/userSlice";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../style/Navbar.css";

function Navbar() {
  const { userData, cartItems } = useSelector((state) => state.user);
  const myShopData = useSelector((state) => state.owner?.myShopData);

  const [showPopup, setShowPopup] = useState(false);
  const [query, setQuery] = useState("");
  const [isLargeScreen, setIsLargeScreen] = useState(
    window.innerWidth > 768
  );


  const popupRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ---------------- LOGOUT ----------------
  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  // ---------------- CLOSE PROFILE POPUP ----------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  return (
    <nav className="Nav-container">
      <div className="nav-left">
        {/* ---------- LOGO ---------- */}
        <div className="logo">
          UniMart
        </div>
</div>

<div className="nav-right">
        {/* ---------- SEARCH for small screen ---------- */}
        {userData?.role === "student" && !isLargeScreen && (
          <IoSearchOutline
            size={22}
            onClick={() => navigate("/s")}
            style={{
              cursor: "pointer",
              color: "#433D8B",
            }}
          />
        )}

        {/* ---------- SEARCH for large screen ---------- */}
        {userData?.role === "student" && isLargeScreen && (
          <form
            onSubmit={(e) => e.preventDefault()}
            style={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
              // margin: "0 20px",
            }}
          >
            <input
              type="text"
              placeholder="Search products..."
              value={query}
              onFocus={() => navigate("/s")}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: "360px",
                padding: "8px 15px",
                border: "1px solid #ccc",
                borderRadius: "40px",
                outline: "none",
                fontSize: "14px",
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: "#433D8B",
                color: "white",
                border: "none",
                padding: "8px 15px",
                borderRadius: "10px",
                cursor: "pointer",
                marginLeft: "8px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <IoSearchOutline size={20} />
              Search
            </button>
          </form>
        )}
    

        {/* Cart */}
        {userData?.role == "student" && (
          <div className="cart-icon"
            onClick={() => navigate("/cart")}
          >
            <IoCartOutline size={28} />
            <span className="cart-count">
              {cartItems.length}
            </span>
          </div>
        )}
        <div>
          {userData?.role === "vendor" && userData?.shopType !== "print" && myShopData && (
            <button className="add-btn"
              onClick={() => navigate("/add-item")}>
              <FaPlus size={18} />
              Add Items
            </button>
          )}
        </div>

        {/* My Orders */}
        <div style={{ position: "relative", display: "inline-block" }}>
          <button className="orders"
            onClick={() => navigate("/myorders")}
          >
            Orders
          </button>

          <span className="cart-count"
          >
            0
          </span>
        </div>


        <div ref={popupRef} style={{ position: "relative" }}>
          <div className="profile"
            onClick={() => setShowPopup(!showPopup)}
          >
            {userData?.fullName?.slice(0, 1) || "A"}
          </div>

          {showPopup && (
            <div
              style={{
                position: "absolute",
                top: "50px",
                right: "0",
                backgroundColor: "white",
                fontWeight: "bold",
                color: "#292727",
                border: "1px solid #ccc",
                padding: "8px 15px",
                borderRadius: "5px",
                zIndex: 10,
                minWidth: "120px",
                textAlign: "center",
              }}>
              {userData?.fullName || "User"}
              <div
                style={{
                  color: "#433D8B",
                  cursor: "pointer",
                  fontWeight: "bold",
                  marginTop: "5px",
                }}
                onClick={handleLogOut}>
                Log Out
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;


