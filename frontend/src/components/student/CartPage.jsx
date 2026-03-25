import React from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import { FaTrashAlt, FaMinus, FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateQuantity } from "../../redux/userSlice";
import { removeCartItems } from "../../redux/userSlice";
import "../../style/CartPage.css";

function CartPage() {
  const navigate = useNavigate();
  const { cartItems, totalAmount } = useSelector((state) => state.user);
  const dispatch = useDispatch();


  /* ---------- NORMAL ITEM QUANTITY ---------- */

  const handleIncrease = (id, currentQty) => {
    dispatch(updateQuantity({ id, quantity: currentQty + 1 }));
  };

  const handleDecrease = (id, currentQty) => {
    if (currentQty > 1) {
      dispatch(updateQuantity({ id, quantity: currentQty - 1 }));
    }
  };

  /* ---------- PRINT COPIES ---------- */
  const handleIncreasePrint = (id, copies) => {
    dispatch(updateQuantity({ id, quantity: copies + 1, type: "print" }));
  };

  const handleDecreasePrint = (id, copies) => {
    if (copies > 1) {
      dispatch(updateQuantity({ id, quantity: copies - 1, type: "print" }));
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        position: "relative",
      }}
    >
      <MdKeyboardBackspace
        onClick={() => navigate("/")}
        style={{
          fontSize: "32px",
          cursor: "pointer",
          color: "#333",
          marginBottom: "10px",
        }}
      />

      <h2
        style={{
          textAlign: "center",
          marginBottom: "30px",
          fontWeight: "600",
          color: "#333",
        }}
      >
        Your Cart
      </h2>

      {cartItems.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            color: "#777",
            fontSize: "18px",
            marginTop: "100px",
          }}
        >
          Your cart is empty 🛒
        </p>
      ) : (
        <>{cartItems.map((item) =>
          item.shopType === "print" ? (
            /* ================= PRINT CARD ================= */
            <div
              key={item.id}
              className="cart-card"
            >
              {/* PDF Preview */}
              <div className="cart-left">
                <img
                  src={item.printDetails.pdfFile.replace(".pdf", ".jpg")}
                  alt="PDF Preview"
                  style={{
                    width: "150px",
                    height: "200px",
                    objectFit: "cover",
                    cursor: "pointer",
                    borderRadius: "20px",
                  }}
                />

                {/* Details */}
                <div className="cart-info" style={{ flex: 1 }}>
                  <h3>Print Document</h3>

                  <p>
                    Pages: {item.printDetails.startPage} –{" "}
                    {item.printDetails.endPage}
                  </p>
                  <p>Copies: {item.printDetails.copies}</p>
                  <p>
                    Color:{" "}
                    {item.printDetails.color === "bw"
                      ? "B&W"
                      : "Color"}
                  </p>

                  <h4>₹{item.price}</h4>
                </div>
                </div>
                <div className="cart-actions"
                >
                  <button
                    style={{
                      padding: "5px 8px",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      handleDecreasePrint(
                        item.id,
                        item.printDetails.copies
                      )
                    }
                  >
                    <FaMinus size={12} />
                  </button>

                  <span>{item.printDetails.copies}</span>

                  <button
                    style={{
                      padding: "5px 8px",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      handleIncreasePrint(
                        item.id,
                        item.printDetails.copies
                      )
                    }
                  >
                    <FaPlus size={12} />
                  </button>

                  <FaTrashAlt
                    className="delete-btn"
                    onClick={() =>
                      dispatch(removeCartItems(item.id))
                    }
                  />
                </div>
            </div>
          ) : (
            /* ================= NORMAL ITEM CARD ================= */
            <div className="cart-card"
              key={item.id}
            >
              <div className="cart-left">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-img"
                />
                <div className="cart-info"
                >
                  <h3 style={{ marginBottom: "5px" }}>{item.name}</h3>
                  <p style={{ color: "#777", margin: 0 }}>
                    ₹{item.price} × {item.quantity}
                  </p>
                  <h4 style={{ marginTop: "5px" }}>
                    ₹{item.price * item.quantity}
                  </h4>
                </div>
              </div>

              <div className="cart-actions"
              >
                <button
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                  onClick={() => handleDecrease(item.id, item.quantity)}
                >
                  <FaMinus size={12} />
                </button>

                <span style={{ margin: "0 8px" }}>{item.quantity}</span>

                <button
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                  onClick={() => handleIncrease(item.id, item.quantity)}
                >
                  <FaPlus size={12} />
                </button >
                <FaTrashAlt className="delete-btn"
                  onClick={() => dispatch(removeCartItems(item.id))}
                />
              </div>
            </div>
          ))}

          <div className="cart-total"
          >
            <span>Total Amount</span>
            <span style={{ color: "#000000ff" }}>₹{totalAmount}</span>
          </div>

          <div style={{ textAlign: "center" }}>
            <button
              style={{
                backgroundColor: "#433D8B",
                color: "white",
                padding: "12px 40px",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                cursor: "pointer",
                fontWeight: "500",
              }}
              onClick={() => navigate("/checkOut")}
            >
              Proceed to CheckOut
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;

