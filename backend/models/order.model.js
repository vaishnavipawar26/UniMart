import mongoose from "mongoose";

// Schema for individual items inside an order
const shopOrderItemSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: false,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    printDetails: {
      pdfFile: { type: String },        
      totalPages: { type: Number },
      startPage: { type: Number },
      endPage: { type: Number },
      copies: { type: Number },
      color: {
        type: String,
        enum: ["bw", "color"],
      },
      orientation: {
        type: String,
        enum: ["portrait", "landscape"],
      },
      pricePerPage: { type: Number },
    },
  },
  { timestamps: true }
);

// Schema for each shop’s order
const shopOrderSchema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop", // refers to the Shop model
      required: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // refers to the shop owner
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    shopOrderItems: [shopOrderItemSchema], // array of ordered items
    status:{
      type:String,
      enum:["pending","preparing","out of delivery","delivered"],
      default:"pending",
    },
    assignment:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"DeliveryAssignment",
      default:null
    },
    assignedDeliveryBoy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
}, 
deliveryOtp:{
        type:String,
        default:null
    },
    otpExpires:{
        type:Date,
        default:null
    },
  deliveredAt:{
    type:Date,
    default:null
  } 
  },
  { timestamps: true }
);

// Main order schema (whole order)
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      required: true,
    },
  deliveryAddress: {
  text: { type: String, required: true }
},
    totalAmount: {
      type: Number,
      required: true,
    },
    shopOrder: [shopOrderSchema],
  },
  { timestamps: true }
);

// Create and export model
const Order = mongoose.model("Order", orderSchema);
export default Order;
