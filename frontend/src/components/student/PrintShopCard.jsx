import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../../config";
import { useSelector } from "react-redux";
import Footer from "../Footer";
import "../../style/Print.css";

function PrintShopCard() {
  const navigate = useNavigate();
  const [printShops, setPrintShops] = useState([]);
  const myShopData = useSelector((state) => state.owner?.myShopData);

  useEffect(() => {
    const fetchPrintShops = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/shop/printshops`, {
          withCredentials: true,
        });
        setPrintShops(res.data);
      } catch (error) {
        console.error("Error fetching print shops:", error);
      }
    };

    fetchPrintShops();
  }, []);

  return (
    <div>
      <Navbar />

      <div style={{ minHeight: "100vh" }}>
        {/* Back Button */}
        <div>
          <MdKeyboardBackspace onClick={() => navigate("/")} className="back" />
        </div>

        {/* Main Content */}
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          <p className="heading">Select Print Shop of Your Chooise</p>

          {/* Shop Cards */}
          <div className="card-container">
            {printShops.map((shop) => (
              <div
                className="print-card"
                key={shop._id}
                onClick={() => navigate(`/printing/${shop._id}`)}
              >
                <h5 className="shopname">{shop.name}</h5>

                <p
                  className="print-tag"
                  style={{ color: "#666", fontSize: "14px" }}
                >
                  Fast & reliable printing services
                </p>

                <button className="view-shop-btn">View Shop</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default PrintShopCard;
