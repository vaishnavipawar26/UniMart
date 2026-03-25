import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import StudentOrderCard from './StudentOrderCard';
import VendorOrderCard from '../vendor/VendorOrderCard';
import { useEffect } from 'react'
import { setMyOrders } from '../../redux/userSlice';
import { updateRealtimeOrderStatus } from '../../redux/userSlice';

function MyOrders({socket}) {
  const {userData,myOrders} = useSelector(state=>state.user)
    const navigate = useNavigate();
  const dispatch = useDispatch();


useEffect(() => {
  if (!socket || !userData) return;

  const handleNewOrder = (data) => {
    const normalizedData = {
      ...data,
      shopOrder: Array.isArray(data.shopOrder) ? data.shopOrder : [data.shopOrder],
    };

    const isMine = normalizedData.shopOrder.some(
      (shop) => shop.owner?._id === userData._id
    );

    if (isMine) {
      dispatch(setMyOrders([normalizedData, ...myOrders]));
    }
  };

  socket.on("newOrder", handleNewOrder);

  socket.on('update-status', ({ orderId, shopId, status, userId }) => {
  if (userId === userData._id) {
    dispatch(updateRealtimeOrderStatus({ orderId, shopId, status }))
  }
});

  return () => {
    socket.off("newOrder", handleNewOrder);
    socket.off("update-status");

  }
}, [socket, userData, myOrders, dispatch]);



  return (
   <div
         style={{
           minHeight: "100vh",
           padding: "20px",
           position: "relative",
         }}
       >
         <MdKeyboardBackspace
           onClick={() => navigate("/")}
           style={{
             fontSize: "32px",
             cursor: "pointer",
             color: "#333",
             marginBottom: "10px",
           }}
         />
        <div>
          {myOrders?.map((order,index)=>(
            userData.role=="student" ?
            (
              <StudentOrderCard data={order} key={index}/>
            ):
            userData.role=="vendor" && 
            (
              <VendorOrderCard  data={order} key={index}/>
            )
          ))}
        </div>
    </div>
  )
}

export default MyOrders

