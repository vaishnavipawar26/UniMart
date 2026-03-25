import React, { useState } from "react";
import axios from "axios";
import { serverUrl } from "../../config";
import { updateOrderStatus } from "../../redux/userSlice";
import { useDispatch } from "react-redux";
import "../../style/Vender.css";

export default function VendorOrderCard({ data }) {
  const [availableBoys, setAvailableBoys] = useState([]);

  const dispatch = useDispatch();

  const handleUpdateStatus = async (orderId, shopId, status) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/update-status/${orderId}/${shopId}`,
        { status },
        { withCredentials: true },
      );

      // Update Redux directly
      dispatch(updateOrderStatus({ orderId, shopId, status }));
      console.log(
        "Assigned delivery boy:",
        result.data.assignedDeliveryBoy?.fullName,
      );
      setAvailableBoys(result.data.availableBoys);
      console.log(result.data);
      // console.log("Assignments state:", assignments);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "10px",
        padding: "20px",
        margin: "10px 50px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      {/* User Info */}
      <h2 style={{ fontSize: "1.2rem", fontWeight: "600" }}>
        {data?.user?.fullName}
      </h2>
      <p style={{ color: "#555", fontSize: "0.85rem" }}>{data?.user?.email}</p>
      <p style={{ color: "#555", fontSize: "0.85rem" }}>{data?.user?.mobile}</p>

      {/* Delivery Address */}
      <p style={{ color: "#333" }}>{data?.deliveryAddress?.text}</p>

      {/* Use Redux/props directly instead of local state */}
      {data?.shopOrder?.map((shopOrder) => (
        <div key={shopOrder._id} style={{ marginTop: "15px" }}>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {shopOrder?.shopOrderItems?.map((item, idx) => (
              <div
                key={idx}
                style={{
                  width: "160px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                {/* PRINT ITEM */}
                {item.printDetails?.pdfFile ? (
                  <div style={{ position: "relative" }}>
                    <img
                      src={item.printDetails.pdfFile.replace(".pdf", ".jpg")}
                      alt="PDF Preview"
                      style={{
                        width: "100%",
                        height: "120px",
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        window.open(item.printDetails.pdfFile, "_blank")
                      }
                    />
                    <span
                      style={{
                        position: "absolute",
                        bottom: "5px",
                        right: "5px",
                        background: "rgba(0,0,0,0.7)",
                        color: "#fff",
                        fontSize: "11px",
                        padding: "2px 6px",
                        borderRadius: "4px",
                      }}
                    >
                      PDF
                    </span>
                  </div>
                ) : (
                  /* NORMAL ITEM */
                  <img
                    src={item?.item?.image || "/default-image.png"}
                    alt={item?.item?.name}
                    style={{
                      width: "100%",
                      height: "120px",
                      objectFit: "cover",
                    }}
                  />
                )}

                <div style={{ padding: "10px" }}>
                  {/* PRINT DETAILS */}
                  {item.printDetails ? (
                    <>
                      <p style={{ margin: 0, fontWeight: "bold" }}>
                        Print Document
                      </p>
                      <p style={{ margin: 0, fontSize: "13px", color: "gray" }}>
                        Pages: {item.printDetails.startPage} –{" "}
                        {item.printDetails.endPage}
                      </p>
                      <p style={{ margin: 0, fontSize: "13px", color: "gray" }}>
                        Copies: {item.printDetails.copies}
                      </p>
                      <p style={{ margin: 0, fontSize: "13px", color: "gray" }}>
                        Color:{" "}
                        {item.printDetails.color === "bw" ? "B&W" : "Color"}
                      </p>
                    </>
                  ) : (
                    /* NORMAL ITEM DETAILS */
                    <>
                      <p style={{ margin: 0, fontWeight: "bold" }}>
                        {item?.item?.name}
                      </p>
                      <p style={{ margin: 0, fontSize: "13px", color: "gray" }}>
                        Qty: {item.quantity} × ₹{item.price}
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Status */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <p>
              <span style={{ fontWeight: "600" }}>Status:</span>{" "}
              <span
                style={{
                  margin: 0,
                  fontWeight: "bold",
                  color: shopOrder.status === "delivered" ? "green" : "#007bff",
                }}
              >
                {shopOrder.status}
              </span>
            </p>

            <select
              value={shopOrder.status} // still controlled from props/Redux
              onChange={(e) =>
                handleUpdateStatus(data._id, shopOrder.shop._id, e.target.value)
              }
              style={{
                padding: "5px 10px",
                borderRadius: "8px",
                backgroundColor: "#433D8B",
                color: "white",
              }}
            >
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="out of delivery">Out of delivery</option>
            </select>
          </div>

          {/* Total Amount */}
          <p
            style={{
              textAlign: "right",
              marginTop: "10px",
              fontWeight: "600",
              fontSize: "1rem",
            }}
          >
            Total: ₹{shopOrder.subtotal}
          </p>

          {/* Available Delivery Boys */}
          {shopOrder.status === "out of delivery" && (
            <div
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "15px",
                marginTop: "10px",
                backgroundColor: "#f9f9f9",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              {shopOrder.assignedDeliveryBoy ? (
                <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
                  Assigned Delivery Boy:
                </p>
              ) : (
                <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
                  Available Delivery Boys:
                </p>
              )}

              {availableBoys?.length > 0 ? (
                availableBoys.map((b, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "8px",
                      borderBottom:
                        index !== availableBoys.length - 1
                          ? "1px solid #ddd"
                          : "none",
                    }}
                  >
                    {b.fullName} - {b.mobile}
                  </div>
                ))
              ) : shopOrder.assignedDeliveryBoy ? (
                <div>
                  {shopOrder.assignedDeliveryBoy?.fullName}:
                  {shopOrder.assignedDeliveryBoy?.mobile}
                </div>
              ) : (
                <div style={{ fontStyle: "italic", color: "#555" }}>
                  Waiting for delivery boy to accept
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
