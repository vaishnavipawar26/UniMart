import React, { useState } from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addMyOrder } from "../../redux/userSlice";
import { serverUrl } from "../../config";
import axios from "axios";

function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [showPopup, setShowPopup] = useState(false);

  const { cartItems, totalAmount } = useSelector((state) => state.user);

  const deliveryFee = totalAmount < 500 ? 0 : 40;
  const subtotal = totalAmount;
  const grandTotal = subtotal + deliveryFee;

  // ---------------- POPUP COMPONENT ----------------
  const Popup = ({ onClose }) => (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
      }}
    >
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          textAlign: "center",
          width: "350px",
        }}
      >
        <FaCheckCircle size={60} color="green" />
        <h2 style={{ marginTop: "10px" }}>Order Placed!</h2>
        <p>Your order is being prepared. Redirecting...</p>
        <button
          onClick={onClose}
          style={{
            marginTop: "15px",
            padding: "10px 20px",
            background: "#433D8B",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Go to My Orders
        </button>
      </div>
    </div>
  );

  // --------------- PLACE ORDER FUNCTION ----------------
  const handlePlaceOrder = async () => {
    if (!address) {
      alert("Please enter your delivery address!");
      return;
    }
    
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/placeorder`,
        {
          paymentMethod,
          deliveryAddress: { text: address },
          totalAmount,
          cartItems,
        },
        { withCredentials: true }
      );
      dispatch(addMyOrder(result.data))
      setShowPopup(true);
      setTimeout(() => {
        navigate("/myorders");
      }, 3000);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {showPopup && <Popup onClose={() => navigate("/myorders")} />}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f9f9f9",
          position: "relative",
        }}
      >
        <MdKeyboardBackspace
          onClick={() => navigate(-1)}
          style={{
            position: "absolute",
            top: "20px",
            left: "30px",
            fontSize: "30px",
            cursor: "pointer",
          }}
        />

        <div
          style={{
            width: "500px",
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
            padding: "20px",
          }}
        >
          <h2 style={{ marginBottom: "10px" }}>Checkout</h2>

          {/* Delivery Address */}
          <div style={{ marginBottom: "20px" }}>
            <p style={{ fontWeight: "500" }}>
              <FaLocationDot size={14} style={{ marginRight: "6px" }} />
              Delivery Location
            </p>
            <select
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{
                padding: "10px",
                width: "100%",
                borderRadius: "8px",
                border: "1px solid #ccc",
                cursor: "pointer",
              }}
            >
              <option value="">Select delivery location</option>
              <option value="Central Library">Central Library</option>
              <option value="Main College Gate">Main College Gate</option>
              <option value="Seminar Hall (1st Floor)">Seminar Hall (1st Floor)</option>
            </select>
          </div>

          {/* Payment Method */}
          <div style={{ marginBottom: "20px" }}>
            <h4 style={{ marginBottom: "10px" }}>Payment Method</h4>
            <div style={{ display: "flex", gap: "10px" }}>
              <div
                onClick={() => setPaymentMethod("cod")}
                style={{
                  flex: 1,
                  border: paymentMethod === "cod" ? "2px solid #433D8B" : "1px solid #ddd",
                  borderRadius: "10px",
                  padding: "10px",
                  cursor: "pointer",
                  textAlign: "center",
                  backgroundColor: paymentMethod === "cod" ? "#E6E4FB" : "transparent",
                }}
              >
                <p style={{ margin: 0, fontWeight: "500" }}>Cash on Delivery</p>
                <small>Pay when your order arrives</small>
              </div>

              <div
                onClick={() => setPaymentMethod("online")}
                style={{
                  flex: 1,
                  border: paymentMethod === "online" ? "2px solid #433D8B" : "1px solid #ddd",
                  borderRadius: "10px",
                  padding: "10px",
                  cursor: "pointer",
                  textAlign: "center",
                  backgroundColor: paymentMethod === "online" ? "#E6E4FB" : "transparent",
                }}
              >
                <p style={{ margin: 0, fontWeight: "500" }}>UPI / Credit / Debit Card</p>
                <small>Pay securely online</small>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <h4 style={{ marginBottom: "10px" }}>Order Summary</h4>
            {cartItems.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                {item.shopType === "print" ? (
                  <>
                    <p>🖨️ Print Document ({item.printDetails.copies} copies)</p>
                    <p>₹{item.price}</p>
                  </>
                ) : (
                  <>
                    <p>
                      {item.name} × {item.quantity}
                    </p>
                    <p>₹{item.price * item.quantity}</p>
                  </>
                )}
              </div>
            ))}

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <p>Subtotal</p>
              <p>₹{subtotal}</p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <p>Delivery Fee</p>
              <p>{deliveryFee === 0 ? "Free" : deliveryFee}</p>
            </div>
            <hr />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              <p>Total</p>
              <p>₹{grandTotal}</p>
            </div>
          </div>

          {/* Place Order Button */}
          <button
            style={{
              width: "100%",
              backgroundColor: "#433D8B",
              color: "white",
              padding: "12px",
              fontSize: "16px",
              border: "none",
              borderRadius: "8px",
              marginTop: "20px",
              cursor: "pointer",
            }}
            onClick={handlePlaceOrder}
          >
            {paymentMethod === "cod" ? "Place Order" : "Pay & Place Order"}
          </button>
        </div>
      </div>
    </>
  );
}

export default Checkout;
