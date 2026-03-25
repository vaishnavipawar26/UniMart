import React, { useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { serverUrl } from "./config";
import AuthPage from "./pages/AuthPage";
import ForgotPassword from "./components/Auth/ForgotPassword";
import Home from "./pages/Home"; 
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import useGetMyShop from "./hooks/useGetMyShop";
import useGetItemsByShopType from "./hooks/useGetItemsByShopType";
import useGetMyOrders from "./hooks/useGetMyOrders";
// Vendor components
import EditShop from "./components/vendor/EditShop";
import AddItems from "./components/vendor/AddItems";
import EditItem from "./components/vendor/EditItem";
// Student components
import ShopItems from "./components/student/ShopItems";
import CartPage from "./components/student/CartPage";
import Checkout from "./components/student/Checkout";
import MyOrders from "./components/student/MyOrders";
import Print from "./components/student/Print";
import PrintPreview from "./components/student/PrintPreview";
import PrintShopCard from "./components/student/PrintShopCard";
import Search from "./components/Search";

function App() {
  const { userData } = useSelector((state) => state.user);
  //const socketRef = useRef();
const [socket, setSocket] = React.useState(null);

  useGetCurrentUser();
  useGetMyShop();
  useGetItemsByShopType();
  useGetMyOrders();


useEffect(() => {
  if (!userData?._id) return;

  const newSocket = io(serverUrl, { withCredentials: true });

  newSocket.on("connect", () => {
    newSocket.emit("identity", { userId: userData._id });
  });

  setSocket(newSocket);

  return () => {
    newSocket.disconnect();
  };
}, [userData?._id]);


  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path="/auth" element={!userData ? <AuthPage /> : <Navigate to="/" />} />
        <Route path="/forgot-password" element={!userData ? <ForgotPassword /> : <Navigate to="/" />} />
        <Route path="/s" element={<Search />} />   
        
        {/* Home */}
        <Route path="/" element={userData ? <Home socket={socket} /> : <Navigate to="/auth" />} />

        {/* Vendor */}
        <Route path="/edit-shop" element={userData ? <EditShop /> : <Navigate to="/auth" />} />
        <Route path="/add-item" element={<AddItems />} />
        <Route path="/edit-item/:itemId" element={<EditItem />} />
<Route
  path="/myorders"
  element={
    userData ? <MyOrders socket={socket}  /> : <Navigate to="/auth" />
  }
/>

        {/* Student */}
        <Route path="/canteen" element={<ShopItems shopType="canteen" />} />
        <Route path="/stationery" element={<ShopItems shopType="stationery" />} />
        <Route path="/print-shop" element={<PrintShopCard shopType="printing" />} />
        <Route path="/printing/:shopId" element={<Print />} />
        <Route path="/print-preview" element={<PrintPreview />} />
        <Route path="/cart" element={userData ? <CartPage /> : <Navigate to="/auth" />} />
        <Route path="/checkOut" element={userData ? <Checkout /> : <Navigate to="/auth" />} />
      </Routes>
    </Router>
  );
}

export default App;


