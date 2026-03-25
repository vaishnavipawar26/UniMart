import React from "react";
import { useSelector } from "react-redux";
import { FaUtensils, FaPenFancy, FaPrint } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../style/Vender.css";

function AddShop() {
  // Step 1: Get logged-in user data
  const { userData } = useSelector((state) => state.user); 
  const myShopData = useSelector((state) => state.owner?.myShopData); 
  const navigate = useNavigate();

  // Step 2: Define shop card info for each shop type
  const ShopInfoCard = {
    canteen: {
      icon: <FaUtensils size={100} color="#433D8B" style={{ marginBottom: "15px" }} />,
      title: "Add Your Canteen",
      description: "Join our platform and serve delicious food to students every day.",
    },
    stationery: {
      icon: <FaPenFancy size={100} color="#433D8B" style={{ marginBottom: "15px" }} />,
      title: "Add Your Stationery Shop",
      description: "Offer notebooks, pens, and supplies to students and staff.",
    },
    print: {
      icon: <FaPrint size={100} color="#433D8B" style={{ marginBottom: "15px" }} />,
      title: "Add Your Printing Shop",
      description: "Provide quick and reliable printing services to students.",
    },
    default: {
      icon: <FaUtensils size={100} color="#433D8B" style={{ marginBottom: "15px" }} />,
      title: "Add Your Shop",
      description: "Join our platform and start serving students today.",
    },
  };

  // Step 3: Pick which card to show
  const shopType =
    userData?.shopType || "default";

  // Step 4: Only show card if vendor is logged in
  if (userData?.role !== "vendor") {
    return null;
  }


return (
  <div className="shop-wrapper">
    {!myShopData && (
      <div className="Addshop-card">
        {ShopInfoCard[shopType].icon}

        <h5 className="shop-title">
          {ShopInfoCard[shopType].title}
        </h5>

        <p className="shop-description">
          {ShopInfoCard[shopType].description}
        </p>

        <button
          className="shop-btn"
          onClick={() => navigate("/edit-shop")}
        >
          Get Started
        </button>
      </div>
    )}
  </div>
);
}
export default AddShop;


