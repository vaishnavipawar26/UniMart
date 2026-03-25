import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setUserData } from "../redux/userSlice"; // adjust path if needed
import CanteenDashboard from "../components/vendor/CanteenDashboard";
import StationeryDashboard from "../components/vendor/StationeryDashboard";
import PrintDashboard from "../components/vendor/PrintDashboard";
import "../style/Vender.css";

const VendorDashboard = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);
  const [shopType, setShopType] = useState(userData?.shopType || "");

  useEffect(() => {
    setShopType(userData?.shopType || "");
  }, [userData]);

  const handleShopTypeSelect = async (type) => {
    setShopType(type);
    try {
      const { data } = await axios.put(
        "http://localhost:8000/api/vendor/updateShopType",
        { shopType: type },
        { withCredentials: true }
      );
      console.log("Shop type updated successfully!");
      dispatch(setUserData(data)); //  update Redux
    } catch (err) {
      console.error("Error updating shop type:", err.response?.data || err.message);
    }
  };

  if (shopType === "canteen") return <CanteenDashboard />;
  if (shopType === "stationery") return <StationeryDashboard />;
  if (shopType === "print") return <PrintDashboard/>;


  return (
  <div className="shop-container">
    <h2 className="shop-title">Select Your Shop Type</h2>

    <div className="shop-options">
      <div className="shop-card" onClick={() => handleShopTypeSelect("canteen")}>
        🍔
        <p>Canteen</p>
      </div>

      <div className="shop-card" onClick={() => handleShopTypeSelect("stationery")}>
        📚
        <p>Stationery</p>
      </div>

      <div className="shop-card" onClick={() => handleShopTypeSelect("print")}>
        🖨️
        <p>Print</p>
      </div>
    </div>
  </div>
);
};

export default VendorDashboard;
