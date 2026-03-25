import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../config";
import { useNavigate } from "react-router-dom";
import "../style/DeliveryDashboard.css";

function DeliveryDashboard({socket}) {
  const { userData } = useSelector((state) => state.user);
  const [availableAssignments, setAvailableAssignments] = useState([]);
  const [currentOrder, setCurrentOrder] = useState();
  const [showOtpBox,setShowOtpBox]=useState(false);
  const [otp,setotp]=useState("")
 const navigate = useNavigate();

  const getAssignments = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-assignments`, {
        withCredentials: true,
      });
       setAvailableAssignments(result.data||null );
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentOrder = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/getcurrent-order`,
        { withCredentials: true }
      );
      setCurrentOrder(result.data || null);
    } catch (error) {
      console.log(error);
    }
  };


  const acceptOrder = async (assignmentId) => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/accept-order/${assignmentId}`,
        { withCredentials: true }
      );
      await getCurrentOrder();
    } catch (error) {
      console.log(error);
    }
  };

   const sendOtp = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/send-delivery-otp`,{
          orderId:currentOrder._id,shopOrderId:currentOrder.shopOrder._id
        },{ withCredentials: true }
      )
      setShowOtpBox(true);
    } catch (error) {
      console.log(error);
    }
  };

  
const verifyOtp = async () => {
  if (!currentOrder?._id || !currentOrder?.shopOrder?._id) {
    return;
  }

  try {
    const result = await axios.post(
      `${serverUrl}/api/order/verify-delivery-otp`,
      {
        orderId: currentOrder._id,
        shopOrderId: currentOrder.shopOrder._id,
        otp,
      },
      { withCredentials: true }
    );

    setCurrentOrder(null);
    setShowOtpBox(false);
    setotp("");

    await getAssignments();     
    await getCurrentOrder();   

  } catch (error) {
    console.log("OTP Error:", error.response?.data || error.message);
  }
};


useEffect(() => {
  if (!socket || !userData?._id) {
    return;
  }
  const handler = (data) => {
    if (String(data.sentTo) === String(userData._id)) {
      setAvailableAssignments(prev => [...prev || [], data]);
    }
  };
  socket.on("newAssignment", handler);
  return () => {
    socket.off("newAssignment", handler);
  };
}, [socket, userData?._id]);


  useEffect(() => {
    if (userData) {
      getAssignments();
      getCurrentOrder();
    }
  }, [userData]);


  return (
    <div>
      <Navbar />

      <div className="dashboard-container">
        <h2>Welcome, {userData?.fullName}</h2>

        {!currentOrder?._id && (
          <>
            <p className="section-title">Available Orders</p>

            {availableAssignments.length > 0 ? (
              availableAssignments.map((a, index) => (
                <div key={index} className="order-card">
                  <div className="order-info">
                    <p className="shop-name">{a.shopName}</p>
                    <p className="address">{a.deliveryAddress.text}</p>
                    <p className="order-meta">
                      {a.items?.length || 0} items | ₹{a.subtotal || 0}
                    </p>
                  </div>

                  <button
                    className="accept-btn"
                    onClick={() => acceptOrder(a.assignmentId)}
                  >
                    Accept
                  </button>
                </div>
              ))
            ) : (
              <p>No Available Orders</p>
            )}
          </>
        )}

        {currentOrder?._id && currentOrder?.shopOrder?._id && (
          <div className="current-order-card">
            <h5>Current Order</h5>

            <div>
              <p className="shop-name">{currentOrder?.shopOrder?.shop?.name}</p>

              <p className="address">{currentOrder?.deliveryAddress?.text}</p>

              <p className="order-meta">
                {currentOrder?.shopOrder?.shopOrderItems?.length} items | ₹
                {currentOrder?.shopOrder?.subtotal}
              </p>
            </div>

            {!showOtpBox ? (
              <button className="deliver-btn" onClick={sendOtp}>
                Mark as delivered
              </button>
            ) : (
              <div className="otp-box">
                <p>
                  Enter OTP sent to <b>{currentOrder?.user?.fullName}</b>
                </p>

                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="otp-input"
                  onChange={(e) => setotp(e.target.value)}
                  value={otp}
                />

                <button className="submit-otp-btn" onClick={verifyOtp}>
                  Submit OTP
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DeliveryDashboard;






