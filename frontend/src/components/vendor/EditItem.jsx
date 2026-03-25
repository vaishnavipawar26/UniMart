import React, { useState, useEffect } from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FaUtensils, FaPenFancy, FaPrint } from "react-icons/fa";
import { serverUrl } from "../../config";
import axios from "axios";
import { setMyShopData } from "../../redux/ownerSlice";

function EditItem() {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { itemId } = useParams();

  const [currentItem, setCurrentItem] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [foodType, setFoodType] = useState("");
  const [frontendImage, setFrontendImage] = useState("");
  const [backendImage, setBackendImage] = useState(null);

  // Fetch item details
  useEffect(() => {
    const handleGetItemById = async () => {
      try {
        const result = await axios.post(
          `${serverUrl}/api/item/get-item-id/${itemId}`,
          {},
          { withCredentials: true }
        );
        console.log("Fetched item:", result.data);
        setCurrentItem(result.data);
      } catch (error) {
        console.log("Error fetching item:", error);
      }
    };
    handleGetItemById();
  }, [itemId]);

  //  Set fields after fetching item
  useEffect(() => {
    if (currentItem) {
      setName(currentItem.name || "");
      setPrice(currentItem.price || 0);
      setFoodType(currentItem.foodType || "");
      setFrontendImage(currentItem.image || "");
    }
  }, [currentItem]);

  //  Handle image preview
  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  //  Handle update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("foodType", foodType);
      if (backendImage) formData.append("image", backendImage);

      const result = await axios.post(
        `${serverUrl}/api/item/edit-item/${itemId}`,
        formData,
        { withCredentials: true }
      );
      

      dispatch(setMyShopData(result.data));
      console.log("Updated item:", result.data);
      navigate("/");
    } catch (error) {
      console.log("Error updating item:", error);
    }
  };

  const ShopInfo = {
    canteen: { icon: <FaUtensils size={60} color="white" /> },
    stationery: { icon: <FaPenFancy size={60} color="white" /> },
    print: { icon: <FaPrint size={60} color="white" /> },
    default: { icon: <FaUtensils size={60} color="white" /> },
  };

  const shopType = userData?.shopType || "default";
  if (userData?.role !== "vendor") return null;


  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f8f8f8",
        position: "relative",
      }}
    >
      <MdKeyboardBackspace
        onClick={() => navigate("/")}
        style={{
          position: "absolute",
          top: "20px",
          left: "30px",
          fontSize: "30px",
          cursor: "pointer",
        }}
      />

      <div
        className="card"
        style={{
          width: "500px",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ margin: "10px 25px" }}>
          <div
            style={{
              color: "white",
              backgroundColor: "#433D8B",
              borderRadius: "50%",
              height: "100px",
              width: "100px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "10px auto",
            }}
          >
            {ShopInfo[shopType].icon}
          </div>

          <h3 style={{ textAlign: "center", fontWeight: "bold" }}>Edit Item</h3>

          <form onSubmit={handleSubmit}>
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control mb-3"
            />

            <label>Item Image</label>
            <input type="file" onChange={handleImage} className="form-control mb-3" />
            {frontendImage && (
              <img
                src={frontendImage}
                alt="preview"
                style={{ width: "450px", height: "200px", borderRadius: "8px" }}
              />
            )}

            <label>Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="form-control mb-3"
            />

            {userData.shopType === "canteen" && (
              <>
                <label>Food Type</label>
                <select
                  value={foodType}
                  onChange={(e) => setFoodType(e.target.value)}
                  className="form-control mb-3"
                >
                  <option value="">-- Select Food Type --</option>
                  <option value="veg">Veg</option>
                  <option value="non-veg">Non Veg</option>
                </select>
              </>
            )}

            <button
              type="submit"
              className="btn"
              style={{
                width: "450px",
                backgroundColor: "#433D8B",
                color: "white",
                borderRadius: "10px",
                height: "45px",
                border: "none",
                fontWeight: "bold",
              }}
            >
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditItem;



