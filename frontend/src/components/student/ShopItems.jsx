import { useSelector } from "react-redux";
import Navbar from "../Navbar";
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import useGetItemsByShopType from "../../hooks/useGetItemsByShopType";
import ItemsCard from "./ItemsCard";
import Footer from "../Footer";
import "../../style/ShopItems.css";

function ShopItems({ shopType }) {
  useGetItemsByShopType(shopType);

  const { canteenItems, stationeryItems } = useSelector(
    (state) => state.items
  );
  const navigate = useNavigate();
  const items = shopType === "canteen" ? canteenItems : stationeryItems;


  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />

      <MdKeyboardBackspace className="back"
        onClick={() => navigate("/")}
      />

      <div className="items-container">
        {items.length === 0 ? (
          <p>No items found.</p>
        ) : (
          <div className="items-grid">
            {items.map((item) => (
              <ItemsCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default ShopItems;
