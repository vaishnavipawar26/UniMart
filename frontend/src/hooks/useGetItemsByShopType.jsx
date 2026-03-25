import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { serverUrl } from "../config";
import {
  setCanteenItems,
  setStationeryItems,
} from "../redux/itemSlice";

function useGetItemsByShopType(shopType) {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/item/get-by-shoptype/${shopType}`,
          { withCredentials: true }
        );

        if (shopType === "canteen") {
          dispatch(setCanteenItems(res.data));
        }

        if (shopType === "stationery") {
          dispatch(setStationeryItems(res.data));
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    if (shopType) fetchItems();
  }, [shopType, dispatch]);
}

export default useGetItemsByShopType;
