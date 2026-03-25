import React, { useEffect, useState } from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUtensils, FaPenFancy, FaPrint } from "react-icons/fa";
import { serverUrl } from "../../config";
import axios from "axios";
import { setMyShopData } from "../../redux/ownerSlice";

function EditShop() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userData } = useSelector((state) => state.user);
  const myShopData = useSelector((state) => state.owner?.myShopData);

  // form state (initialize from myShopData if available)
  const [frontendImage, setFrontendImage] = useState(myShopData?.image || null);
  const [backendImage, setBackendImage] = useState(null);
  const [name, setName] = useState(myShopData?.name || "");
  const [address, setAddress] = useState(myShopData?.address || "");
  const [city, setCity] = useState(myShopData?.city || "");
  const [stateName, setStateName] = useState(myShopData?.state || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // update local state when myShopData loads/changes
    if (myShopData) {
      setName(myShopData.name || "");
      setAddress(myShopData.address || "");
      setCity(myShopData.city || "");
      setStateName(myShopData.state || "");
      setFrontendImage(myShopData.image || null);
    }
  }, [myShopData]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Build form data and ALWAYS include userData.shopType
      const formData = new FormData();
      formData.append("name", name);
      formData.append("city", city);
      formData.append("address", address);
      formData.append("state", stateName);

      // include shopType from userData (important)
      if (userData?.shopType) {
        formData.append("shopType", userData.shopType);
      }

      if (backendImage) {
        formData.append("image", backendImage);
      }

      const result = await axios.post(`${serverUrl}/api/shop/edit-shop`, formData, {
        withCredentials: true,
      });

      // Update redux and navigate
      dispatch(setMyShopData(result.data));
      setSaving(false);
      navigate("/"); 
    } catch (err) {
      console.error("EditShop error:", err);
      setError(err.response?.data?.message || err.message || "Something went wrong");
      setSaving(false);
    }
  };

  // block non-vendors
  if (userData?.role !== "vendor") return null;

  const ShopInfo = {
    canteen: { icon: <FaUtensils size={60} color="white" /> },
    stationery: { icon: <FaPenFancy size={60} color="white" /> },
    print: { icon: <FaPrint size={60} color="white" /> },
    default: { icon: <FaUtensils size={60} color="white" /> },
  };

  const shopType = userData?.shopType || "default";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f8f8f8",
        position: "relative",
        padding: 20,
      }}
    >
      <MdKeyboardBackspace
        onClick={() => navigate("/")}
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          fontSize: 30,
          cursor: "pointer",
        }}
      />

      <div
        className="card"
        style={{
          width: 520,
          backgroundColor: "white",
          borderRadius: 12,
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
          paddingBottom: 20,
        }}
      >
        <div style={{ margin: "10px 25px 0 25px" }}>
          <div
            style={{
              color: "white",
              backgroundColor: "#433D8B",
              borderRadius: "50%",
              height: 100,
              width: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "10px auto",
            }}
          >
            {ShopInfo[shopType].icon}
          </div>

          <div style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
            {myShopData ? "Edit Shop" : "Add Shop"}
          </div>

          <form onSubmit={handleSubmit} style={{ marginTop: 10 }}>
            <div>
              <label style={{ marginBottom: 6, fontWeight: 500 }}>Name</label>
              <input
                type="text"
                placeholder="Enter Shop Name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                style={{
                  padding: 8,
                  borderRadius: 6,
                  width: "100%",
                  border: "1px solid #ccc",
                  marginBottom: 10,
                }}
                required
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
              <label style={{ marginBottom: 6, fontWeight: 500 }}>Shop Image</label>
              <input
                type="file"
                onChange={handleImage}
                style={{
                  padding: 6,
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  cursor: "pointer",
                  marginBottom: 8,
                }}
                accept="image/*"
              />
              {frontendImage && (
                <div>
                  <img
                    src={frontendImage}
                    alt="preview"
                    style={{ width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 8, marginBottom: 10 }}
                  />
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: 6 }}>City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={{ padding: 8, borderRadius: 6, width: "100%", border: "1px solid #ccc" }}
                  required
                />
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: 6 }}>State</label>
                <input
                  type="text"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  style={{ padding: 8, borderRadius: 6, width: "100%", border: "1px solid #ccc" }}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontWeight: 500 }}>Address</label>
              <input
                type="text"
                placeholder="Enter Shop Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={{ padding: 8, borderRadius: 6, width: "100%", border: "1px solid #ccc" }}
                required
              />
            </div>

            {/* show shopType just for info */}
            <div style={{ marginBottom: 12 }}>
              <strong>Shop type:</strong> {userData?.shopType || "not set"}
            </div>

            {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}

            <div>
              <button
                type="submit"
                disabled={saving}
                style={{
                  width: "100%",
                  backgroundColor: "#433D8B",
                  color: "white",
                  borderRadius: 10,
                  height: 45,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditShop;




