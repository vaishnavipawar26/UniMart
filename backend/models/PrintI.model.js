import mongoose from "mongoose";

const printItemSchema = new mongoose.Schema({
  name: { type: String, default: "Print Document" },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  printDetails: {
    pdfFile: { type: String, required: true },
    startPage: { type: Number, required: true },
    endPage: { type: Number, required: true },
    copies: { type: Number, required: true },
    color: { type: String, required: true },
    pricePerPage: { type: Number, required: true },
  },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
});

export default mongoose.model("PrintItem", printItemSchema);
