import React, { useRef, useState } from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUtensils, FaPenFancy, FaPrint } from "react-icons/fa";
import { serverUrl } from "../../config";
import axios from "axios";
import { setMyShopData } from "../../redux/ownerSlice";
import { useEffect } from "react";
import "../../style/Vender.css";
import "../../style/Navbar.css";

function AddItems() {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const myShopData = useSelector((state) => state.owner?.myShopData);
  const dispatch = useDispatch();

  const [name, setName] = useState( "");
  const [price, setPrice] = useState(0);
  const [foodType,setFoodType]=useState("veg");
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("foodType", foodType);


      if (backendImage) {
        formData.append("image", backendImage);
      }
      const result = await axios.post(
        `${serverUrl}/api/item/add-item`,
        formData,
        { withCredentials: true }
      );

      dispatch(setMyShopData(result.data));
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const ShopInfo = {
    canteen: {
      icon: <FaUtensils size={60} color="white" />,
    },
    stationery: {
      icon: <FaPenFancy size={60} color="white" />,
    },
    print: {
      icon: <FaPrint size={60} color="white" />,
    },
    default: {
      icon: <FaUtensils size={60} color="white" />,
    },
  };

  const shopType = userData?.shopType || "default";

  if (userData?.role !== "vendor") {
    return null;
  }

return (
  <div className="add-item-page">
    {/* Back Icon */}
    <MdKeyboardBackspace
      onClick={() => navigate("/")}
      className="back-icon"
    />

    <div className="add-item-card">

      <div className="card-content">

        {/* Icon Circle */}
        <div className="shop-icon">
          {ShopInfo[shopType].icon}
        </div>

        <div className="form-title">
          Add items
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter item Name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>

          <div className="form-group">
            <label>Item Image</label>
            <input
              type="file"
              onChange={handleImage}
            />

            {frontendImage && (
              <img
                src={frontendImage}
                alt="preview"
                className="preview-image"
              />
            )}
          </div>

          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              placeholder="Enter Price"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
            />
          </div>

          {userData.shopType == "canteen" && (
            <div className="form-group">
              <label>Food Type</label>

              <select
                onChange={(e) => setFoodType(e.target.value)}
                value={foodType}
              >
                <option value="">-- Select Food Type --</option>
                <option value="veg">Veg</option>
                <option value="non-veg">Non Veg</option>
              </select>
            </div>
          )}

          <button type="submit" className="submit-btn" onClick={() => navigate("/")}>
            Add
          </button>

        </form>
      </div>
    </div>
  </div>
);
}
export default AddItems;


