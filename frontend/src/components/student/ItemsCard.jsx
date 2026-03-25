import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { FaStar, FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa6";
import { addToCart } from "../../redux/userSlice";
import "../../style/CartPage.css";

function ItemsCard({ item }) {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} color="#FFD700" />
        ) : (
          <FaRegStar key={i} color="#FFD700" />
        )
      );
    }
    return stars;
  };

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => Math.max(prev - 1, 1));

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: item._id,
        name: item.name,
        price: item.price,
        image: item.image,
        shop: item.shop?._id || item.shopId,
        quantity,
        foodType: item.foodType,
      })
    );
    setAddedToCart(true);
  };

  return (
    <div
      className="item-card"
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <img src={item.image} alt={item.name} className="item-image" />

      <div className="item-info">
        <h3 className="item-name">{item.name}</h3>
        <div className="item-stars">{renderStars(item.rating?.average || 0)}</div>
        <p className="item-rating-count">{item.rating?.count || 0} ratings</p>

        <div className="item-footer">
          <p className="item-price">₹{item.price}</p>

          <div className="item-quantity-cart">
            <button className="quantity-btn" onClick={handleDecrease}>
              <FaMinus size={12} />
            </button>

            <span className="quantity-value">{quantity}</span>

            <button className="quantity-btn" onClick={handleIncrease}>
              <FaPlus size={12} />
            </button>

            <button
              className={`add-cart-btn ${addedToCart ? "added" : ""}`}
              onClick={handleAddToCart}
              disabled={addedToCart}
            >
              <FaShoppingCart />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemsCard;
