import React from "react";
import { useSelector } from "react-redux";
import { FaUtensils, FaPenFancy, FaPrint } from "react-icons/fa";
import { FaPenToSquare } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import "../../style/vender.css";

function ShowShop() {
  const myShopData = useSelector((state) => state.owner.myShopData);
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  
  const ShopInfo = {
    canteen: { icon: <FaUtensils color="#433D8B" size={45} /> },
    stationery: { icon: <FaPenFancy color="#433D8B" size={45} /> },
    print: { icon: <FaPrint color="#433D8B" size={45} /> },
    default: { icon: <FaUtensils color="#433D8B" size={45} /> },
  };

  const shopType = userData?.shopType || "default";

return (
  <>
    {myShopData && (
      <div className="Showshop-page">

        {/* Header */}
        <div className="shop-header">
          <h2>
            {ShopInfo[shopType].icon} Welcome to {myShopData.name}
          </h2>
        </div>

        {/* Card */}
        <div className="Showshop-card">

          <div className="shop-image-wrapper">

            {/* Edit Button */}
            <div
              className="edit-btn"
              onClick={() => navigate("/edit-shop")}
            >
              <FaPenToSquare color="white" size={20} />
            </div>

            {/* Image */}
            <img
              src={myShopData.image}
              alt="Shop"
              className="shop-image"
            />
          </div>

          <div className="shop-details">
            <h3>{myShopData.name}</h3>
            <p>{myShopData.city}, {myShopData.state}</p>
            <p>{myShopData.address}</p>
          </div>
        </div>
      </div>
    )}
  </>
);
}

export default ShowShop;
