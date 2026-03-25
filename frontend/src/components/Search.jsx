import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../config";
import { setSearchItems } from "../redux/userSlice";
import ItemsCard from "./student/ItemsCard";
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";


function Search() {
  const dispatch = useDispatch();
  const searchItems = useSelector((state) => state.user.searchItems);
    const navigate = useNavigate();

  const [query, setQuery] = useState("");

// ---------------- SEARCH API ----------------
  const handleSearchItems = async (query) => {
  try {
    const result = await axios.get(
      `${serverUrl}/api/item/search-items?query=${query}`,
      { withCredentials: true }
    );

    dispatch(setSearchItems(result.data));
  } catch (error) {
    console.log(error);
  }
};

  // ---------------- SEARCH EFFECT (DEBOUNCE) ----------------
  useEffect(() => {
  const timer = setTimeout(() => {
    if (query) {
      handleSearchItems(query);
    } else {
      dispatch(setSearchItems(null));
    }
  }, 400); // wait 400ms

  return () => clearTimeout(timer);
}, [query]);


  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>

        <MdKeyboardBackspace
                   onClick={() => navigate("/")}
                   style={{
                     fontSize: "32px",
                     cursor: "pointer",
                     color: "#333",
                     marginBottom: "10px",
                   }}
                 />
      {/* SEARCH INPUT */}
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
        style={{
          width: "100%",
          padding: "12px 18px",
          borderRadius: "30px",
          border: "1px solid #ccc",
          fontSize: "16px",
          outline: "none",
        }}
      />

     {/* RESULTS */}
<div style={{ marginTop: "20px" }}>
  {searchItems?.length > 0 ? (
    <div
      style={{
        display: "flex",
        gap: "20px",
        flexWrap: "wrap", //  moves to next row if screen is small
      }}
    >
      {searchItems.map((item) => (
        <ItemsCard key={item._id} item={item} />
      ))}
    </div>
  ) : query ? (
    <p>No results found</p>
  ) : (
    <p>Start typing to search</p>
  )}
</div>


      
    </div>
  );
}

export default Search;



