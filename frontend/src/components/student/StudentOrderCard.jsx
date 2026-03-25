import { useState } from "react";
import axios from "axios";
import { serverUrl } from "../../config";

function StudentOrderCard({ data }) {
  const [selectedRating, setSelectedRating] = useState({});

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handelRating = async (itemId, rating) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/item/rating`,
        { itemId, rating },
        { withCredentials: true },
      );

      setSelectedRating((prev) => ({
        ...prev,
        [itemId]: rating,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "10px",
        padding: "15px",
        marginBottom: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      {/* ORDER HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <div>
          <p style={{ margin: 0, fontWeight: "bold" }}>
            Order #{data?._id?.slice(-6) || "-"}
          </p>
          <p style={{ margin: 0, color: "gray" }}>
            Date: {formatDate(data?.createdAt)}
          </p>
        </div>

        <div style={{ textAlign: "right" }}>
          <p
            style={{
              margin: 0,
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            {data?.paymentMethod}
          </p>
          <p style={{ margin: 0, color: "#007bff", fontWeight: "bold" }}>
            {data?.shopOrder?.[0]?.status}
          </p>
        </div>
      </div>

      {/* SHOP WISE ITEMS */}
      {data?.shopOrder?.map((shopOrder, index) => (
        <div key={index} style={{ marginBottom: "20px" }}>
          <h4 style={{ marginBottom: "10px" }}>
            {shopOrder?.shop?.name || "Unnamed Shop"}
          </h4>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {shopOrder?.shopOrderItems?.map(
              (item, idx) =>
                item && (
                  <div
                    key={idx}
                    style={{
                      width: "140px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      overflow: "hidden",
                    }}
                  >
                    {/* PDF Preview for print items */}
                    {item.printDetails?.pdfFile ? (
                      <img
                        src={item.printDetails.pdfFile.replace(".pdf", ".jpg")}
                        alt="PDF Preview"
                        style={{
                          width: "100%",
                          height: "120px",
                          objectFit: "cover",
                          cursor: "pointer",
                        }}
                      />
                    ) : (
                      <img
                        src={item.item?.image || "/default-image.png"}
                        alt={item.item?.name || "Item"}
                        style={{
                          width: "100%",
                          height: "120px",
                          objectFit: "cover",
                        }}
                      />
                    )}

                    <div style={{ padding: "10px" }}>
                      {item.printDetails ? (
                        <>
                          <p style={{ margin: 0, color: "gray" }}>
                            Pages: {item.printDetails.startPage} –{" "}
                            {item.printDetails.endPage}
                          </p>
                          <p style={{ margin: 0, color: "gray" }}>
                            Copies: {item.printDetails.copies}
                          </p>
                          <p style={{ margin: 0, color: "gray" }}>
                            Color:{" "}
                            {item.printDetails.color === "bw" ? "B&W" : "Color"}
                          </p>
                          <p style={{ margin: 0, color: "gray" }}>
                            Price: ₹{item.price || 0}
                          </p>
                        </>
                      ) : (
                        <>
                          <p style={{ margin: 0, color: "gray" }}>
                            Qty: {item.quantity || 0} × ₹{item.price || 0}
                          </p>

                          {shopOrder.status === "delivered" && (
                            <div
                              style={{
                                display: "flex",
                                gap: "4px",
                                marginTop: "8px",
                              }}
                            >
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  style={{
                                    fontSize: "18px",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: 0,
                                    color:
                                      selectedRating[item.item._id] >= star
                                        ? "#facc15"
                                        : "#9ca3af",
                                  }}
                                  onClick={() =>
                                    handelRating(item.item._id, star)
                                  }
                                >
                                  ★
                                </button>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ),
            )}
          </div>

          <p style={{ fontWeight: "bold", marginTop: "10px" }}>
            Subtotal: ₹{shopOrder?.subtotal || 0}
          </p>
          <span
            style={{
              margin: 0,
              color: shopOrder?.status === "delivered" ? "green" : "#007bff",
              fontWeight: "bold",
            }}
          >
            {shopOrder?.status || "-"}
          </span>
          <hr />
        </div>
      ))}

      {/* TOTAL */}
      <h3 style={{ textAlign: "right", marginTop: "10px" }}>
        Total: ₹{data?.totalAmount || 0}
      </h3>
    </div>
  );
}

export default StudentOrderCard;
