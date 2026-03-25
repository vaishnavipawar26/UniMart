import React from "react";
import Navbar from "../components/Navbar";
import CategoryCard from "../components/student/CategoryCard";
import { useSelector } from "react-redux";
import ItemsCard from "../components/student/ItemsCard";
import Footer from "../components/Footer";
import useGetItemsByShopType from "../hooks/useGetItemsByShopType";
import "../style/StudentDashboard.css";

function StudentDashboard() {
  //  API calls
  useGetItemsByShopType("canteen");
  useGetItemsByShopType("stationery");

  const { searchItems } = useSelector((state) => state.user);
  const { canteenItems, stationeryItems } = useSelector(
    (state) => state.items
  );

const horizontalScrollStyle = {
    display: "flex",
    gap: "12px",
    overflowX: "auto",
    padding: "10px 0",
      alignItems: "stretch",
  };

  const itemCardWrapper = {
  flex: "0 0 160px",
  display: "flex",   // 🔥 ADD THIS
};

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <div style={{ flex: 1 }}>
        <Navbar />
        <CategoryCard />

        {/* Canteen Items */}
        <div className="item-container">
          <p className="item-type">Suggested Food Items</p>
          {canteenItems.length > 0 ? (
            <div className="horizontal-scroll" style={horizontalScrollStyle}>
              {canteenItems.map((item) => (
                <div style={itemCardWrapper} key={item._id}>
      <ItemsCard item={item} />
    </div>

              ))}
            </div>
          ) : (
            <p>No canteen items found</p>
          )}
        </div>

        {/* Stationery Items */}
        <div className="item-container">
          <p className="item-type"> Suggested Stationery Items</p>
          {stationeryItems.length > 0 ? (
            <div className="horizontal-scroll" style={horizontalScrollStyle}>
              {stationeryItems.map((item) => (
<div className="item-card-wrapper" style={itemCardWrapper} key={item._id}>
      <ItemsCard item={item} />
    </div>
              ))}
            </div>
          ) : (
            <p>No stationery items found</p>
          )}
        </div>
      </div>
      

      <Footer />
    </div>
  );
}

export default StudentDashboard;
