
import Item from "../models/item.model.js";
import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

// Add new item
export const addItem = async (req, res) => {
  try {
    const { name, foodType, price } = req.body;
    let image;

    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    const shop = await Shop.findOne({ owner: req.userId });
    if (!shop) return res.status(400).json({ message: "Shop not found" });

    const item = await Item.create({
      name,
      foodType,
      price,
      image,
      shopType: shop.shopType,
      shop: shop._id,
    });

    shop.items.push(item._id);
    await shop.save();

    // Populate owner and items (sorted)
    await shop.populate([
      { path: "owner" },
      { path: "items", options: { sort: { updatedAt: -1 } } },
    ]);

    return res.status(201).json(shop);
  } catch (error) {
    return res.status(500).json({ message: `Add item error: ${error.message}` });
  }
};

// Edit existing item
export const editItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const { name, category, foodType, price } = req.body;
    let image;

    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    const item = await Item.findByIdAndUpdate(
      itemId,
      { name, category, foodType, price, image },
      { new: true }
    );

    if (!item) {
      return res.status(400).json({ message: "Item not found" });
    }

    const shop = await Shop.findOne({ owner: req.userId }).populate({
      path: "items",
      options: { sort: { updatedAt: -1 } },
    });

    return res.status(200).json(shop);
  } catch (error) {
    return res.status(500).json({ message: `Edit item error: ${error.message}` });
  }
};

// Get item by ID
export const getItemById = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const item = await Item.findById(itemId).populate("shop", "_id name shopType");

    if (!item) {
      return res.status(400).json({ message: "Item not found" });
    }

    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({ message: `Get item by ID error: ${error.message}` });
  }
};

// Delete item
export const deleteItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;

    const item = await Item.findByIdAndDelete(itemId);
    if (!item) return res.status(400).json({ message: "Item not found" });

    const shop = await Shop.findOne({ owner: req.userId });
    if (!shop) return res.status(400).json({ message: "Shop not found" });

    shop.items = shop.items.filter((i) => i.toString() !== item._id.toString());
    await shop.save();

    await shop.populate({ path: "items", options: { sort: { updatedAt: -1 } } });

    return res.status(200).json(shop);
  } catch (error) {
    return res.status(500).json({ message: `Delete item error: ${error.message}` });
  }
};

// Get items by shop type (permanent fix)
export const getItemByShopType = async (req, res) => {
  try {
    const { shopType } = req.params;

    if (!shopType) return res.status(400).json({ message: "Shop type is required" });

    const shops = await Shop.find({ shopType });
    if (!shops || shops.length === 0)
      return res.status(404).json({ message: "No shops found for this type" });

    const shopIds = shops.map((shop) => shop._id);

    //  Populate shop field for each item to avoid CastError
    const items = await Item.find({ shop: { $in: shopIds } }).populate(
      "shop",
      "_id name shopType"
    );

    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ message: `Get items by shop type error: ${error.message}` });
  }
};

export const searchItems = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return null;
    }

    //  Normal item search (by item name)
    const items = await Item.find({
      name: { $regex:query,$options:"i"}
    }).populate("shop");

    if (!items || items.length === 0) {
      return res.status(404).json({ message: "Items not found" });
    }

    return res.status(200).json(items);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Search item error" });
  }
};


export const rating=async (req,res) => {
  try {
    const {itemId,rating}=req.body

    if(!itemId || !rating){
      return res.status(400).json({message:"itemId and rating is required"})
    }

    if(rating<1 || rating>5){
      return res.status(400).json({message:"rating must be between 1 to 5"})
    }

    const item = await Item.findById(itemId)
if(!item){
  return res.status(400).json({message:"item not found"})
}

const newCount = item.rating.count + 1
const newAverage = (item.rating.average * item.rating.count + rating) / newCount

item.rating.count = newCount
item.rating.average = newAverage
await item.save()

return res.status(200).json({rating:item.rating})

  } catch (error) {
    return res.status(500).json({ message: " rating error" });
  }
}

