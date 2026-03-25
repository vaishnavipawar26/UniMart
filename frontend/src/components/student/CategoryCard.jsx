import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/CategoryCard.css";

function CategoryCard() {
  const navigate = useNavigate();
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 768);

  // Listen for window resize
  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth > 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const categories = [
    {
      title: "Canteen at your doorstep!",
      subtitle: "Snacks, meals & beverages",
      bg: "linear-gradient(135deg, #00c6a7, #0cb49dff)",
      image:
        "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=500",
      route: "/canteen",
    },
    {
      title: "Stationery in minutes",
      subtitle: "Books, pens, files & more",
      bg: "linear-gradient(135deg, #ffd54f, #ffb300)",
      image:
        "https://images.unsplash.com/photo-1588072432836-e10032774350?w=500",
      route: "/stationery",
    },
    {
      title: "Print anything fast",
      subtitle: "Notes, assignments, projects",
      bg: "linear-gradient(135deg, #FF7043, #FF8C42)",
      image:
        "https://images.unsplash.com/photo-1630327722923-5ebd594ddda9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      route: "/print-shop",
    },
  ];

  return (
    <div className="category-wrapper">
      {categories.map((cat, index) => (
        <div
          key={index}
          className="category-card"
          style={{ background: cat.bg }}
          onClick={() => navigate(cat.route)}
        >
          <div className="category-content">
            <h2>{cat.title}</h2>
            <p>{cat.subtitle}</p>
            <button>Order Now</button>
          </div>

          {/* Image only for desktop */}
          <img src={cat.image} alt={cat.title} className="category-image" />
        </div>
      ))}
    </div>
  );
}

export default CategoryCard;
