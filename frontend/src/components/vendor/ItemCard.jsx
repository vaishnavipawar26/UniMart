import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../../config";
import axios from "axios";
import { setMyShopData } from "../../redux/ownerSlice";
import "../../style/Vender.css";

function ItemCard({ data }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user); 


  const handleDelete = async () => {
    try {
      const result = await axios.delete(
        `${serverUrl}/api/item/delete/${data._id}`,
        { withCredentials: true }
      );

      // Update Redux store with latest shop data
      dispatch(setMyShopData(result.data));
    } catch (error) {
      console.log("Delete error:", error);
    }
  };


return (
  <div className="vendoritem-card">

    {/* Left Side - Image */}
    <div className="item-image">
      <img
        src={data.image}
        alt={data.name}
      />
    </div>

    {/* Right Side - Content */}
    <div className="item-content">

      <h3 className="item-title">{data.name}</h3>

      {userData.shopType == "canteen" && (
        <p className="item-foodtype">
          <b>Food Type:</b> {data.foodType}
        </p>
      )}

      <p className="item-price">
        ₹{data.price}
      </p>

      {/* Edit Delete Icons */}
      <div className="item-actions">
        <FaEdit
          className="icon-btn"
          title="Edit Item"
          onClick={() => navigate(`/edit-item/${data._id}`)}
        />

        <FaTrash
          className="icon-btn"
          title="Delete Item"
          onClick={handleDelete}
        />
      </div>
    </div>
  </div>
);
}
export default ItemCard;