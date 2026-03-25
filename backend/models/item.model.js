import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    shopType: {
      type: String,
      enum: ["canteen", "stationery", "print"], 
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    foodType: {
      type: String,
      enum: ["veg", "non-veg"],
      required: function () {
        return this.shopType === "canteen"; //  only required for canteen
      },
    },
    rating:{
        average:{type:Number,default:0},  
        count:{type:Number,default:0},  
      },
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", itemSchema);
export default Item;
