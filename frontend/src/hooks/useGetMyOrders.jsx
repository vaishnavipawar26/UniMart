import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useDispatch } from "react-redux";
import { serverUrl } from "../config";
import { setMyOrders } from "../redux/userSlice";

function useGetMyOrders() {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData); 

  useEffect(() => {

        if (!userData?._id) return;

    const fetchOrders = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/order/myorder`, {
          withCredentials: true,
        });
        dispatch(setMyOrders(result.data)); 
      } catch (error) {
  console.log("AUTH ERROR:", error.response?.data);
      }
    };

    fetchOrders();
  },  [userData, dispatch]);
}

export default useGetMyOrders;
