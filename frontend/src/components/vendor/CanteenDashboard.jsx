import React from "react";
import Navbar from "../Navbar";
import AddShop from "./AddShop";
import { useSelector } from "react-redux";
import ShowShop from "./ShowShop";
import ItemCard from "./itemCard";
import "../../style/Navbar.css";
import "../../style/vender.css";
import Footer from "../Footer";

function CanteenDashboard() {
  const myShopData = useSelector((state) => state.owner.myShopData);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Navbar />

      <div style={{ flex: 1 }}>
        <AddShop />
        <ShowShop />

        {myShopData?.items?.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            {myShopData.items.map((item, index) => (
              <ItemCard data={item} key={index} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default CanteenDashboard;