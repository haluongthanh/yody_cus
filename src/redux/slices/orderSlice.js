import { createSlice } from "@reduxjs/toolkit";

const loadOrderFromLocalStorage = () => {
  const orderData = localStorage.getItem("order");
  return orderData ? JSON.parse(orderData) : null;
};

const orderSlice = createSlice({
  name: "order",
  initialState: {
    shipping_address: loadOrderFromLocalStorage()?.shipping_address || null,
    total_amount: loadOrderFromLocalStorage()?.total_amount || 0,
    order_code: "",
    order_detail: loadOrderFromLocalStorage()?.order_detail || [],
  },
  reducers: {
    addOrder(state, action) {
      const { items, shipping_address, total_amount } = action.payload;
      state.order_detail = items;
      state.shipping_address = shipping_address;
      state.total_amount = total_amount;

      localStorage.setItem("order", JSON.stringify(state));
    },
    removeOrder(state) {
      state.order_detail = [];
      state.shipping_address = "";
      state.total_amount = 0;

      localStorage.removeItem("order");
    },
  },
});

export const { addOrder, removeOrder } = orderSlice.actions;

export default orderSlice.reducer;
