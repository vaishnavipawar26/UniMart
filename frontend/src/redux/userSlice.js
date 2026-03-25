import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    cartItems: [],
    totalAmount: 0,
    myOrders: [],
    searchItems: null,
     socket:null,
  },

  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },

    /* ================= ADD TO CART ================= */
    addToCart: (state, action) => {
  const cartItem = action.payload;

  //  PRINT ITEM
  if (cartItem.shopType === "print") {
    state.cartItems.push(cartItem);
  } 
  //  NORMAL ITEM
  else {
    const existingItem = state.cartItems.find((i) => i.id === cartItem.id);

    if (existingItem) {
      existingItem.quantity += cartItem.quantity;
    } else {
      // make sure shopId is included
      state.cartItems.push({
        ...cartItem,
        shopId: cartItem.shopId, // add this
      });
    }
  }

  //  TOTAL AMOUNT
  state.totalAmount = state.cartItems.reduce((sum, item) => {
    if (item.shopType === "print") {
      return sum + item.price;
    }
    return sum + item.price * item.quantity;
  }, 0);
},


    /* ================= UPDATE QUANTITY ================= */
    updateQuantity: (state, action) => {
      const { id, quantity, type } = action.payload;
      const item = state.cartItems.find((i) => i.id === id);

      if (!item) return;

      //  PRINT → update copies
      if (type === "print" && item.shopType === "print") {
        item.printDetails.copies = Math.max(quantity, 1);

        // update price when copies change
        item.price =
          item.printDetails.pricePerPage *
          item.printDetails.copies *
          (item.printDetails.endPage - item.printDetails.startPage + 1);
      }

      //  NORMAL → update quantity
      if (!type && item.shopType !== "print") {
        item.quantity = Math.max(quantity, 1);
      }

      //  RECALCULATE TOTAL
      state.totalAmount = state.cartItems.reduce((sum, item) => {
        if (item.shopType === "print") {
          return sum + item.price;
        }
        return sum + item.price * item.quantity;
      }, 0);
    },

    /* ================= REMOVE ITEM ================= */
    removeCartItems: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (i) => i.id !== action.payload
      );

      state.totalAmount = state.cartItems.reduce((sum, item) => {
        if (item.shopType === "print") {
          return sum + item.price;
        }
        return sum + item.price * item.quantity;
      }, 0);
    },

    /* ================= ORDERS ================= */
    setMyOrders: (state, action) => {
  if (typeof action.payload === "function") {
    state.myOrders = action.payload(state.myOrders);
  } else {
    state.myOrders = action.payload;
  }
}
,

    addMyOrder: (state, action) => {
      state.myOrders = [action.payload, ...state.myOrders];
    },

    updateOrderStatus: (state, action) => {
      const { orderId, shopId, status } = action.payload;
      const order = state.myOrders.find((o) => o._id === orderId);

      if (order && order.shopOrder) {
        order.shopOrder = order.shopOrder.map((shop) =>
          shop.shop._id === shopId ? { ...shop, status } : shop
        );
      }
    },

    updateRealtimeOrderStatus:(state,action)=>{
      const { orderId, shopId, status } = action.payload;
      const order = state.myOrders.find((o) => o._id === orderId);

      if (order && order.shopOrder) {
        const shopOrder = order.shopOrder.find(so => so.shop._id == shopId)
      if(shopOrder){
        shopOrder.status = status
      } 
      }
    },


    setSearchItems: (state, action) => {
      state.searchItems = action.payload;
    },

     setSocket: (state, action) => {
      state.socket = action.payload;
    },

    
  },
});

export const {
  setUserData,
  addToCart,
  updateQuantity,
  removeCartItems,
  setMyOrders,
  addMyOrder,
  updateOrderStatus,
  setSearchItems,
  setSocket,
  updateRealtimeOrderStatus,
} = userSlice.actions;

export default userSlice.reducer;
