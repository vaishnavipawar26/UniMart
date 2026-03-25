import uploadOnCloudinary from "../utils/cloudinary.js";
import Shop from "../models/shop.model.js";

export const EditShop = async (req, res) => {
  try {
    const { name, city, state, address } = req.body;
    const ownerId = req.userId;

    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    const shopType = req.body.shopType ; // fallback to default

    let shop = await Shop.findOne({ owner: ownerId });

    if (!shop) {
      shop = await Shop.create({
        name,
        city,
        state,
        address,
        image,
        shopType,  
        owner: ownerId,
      });
    } else {
      shop = await Shop.findByIdAndUpdate(
        shop._id,
        {
          name,
          city,
          state,
          address,
          image,
          shopType,  
        },
        { new: true }
      );
    }

   await shop.populate("owner");
    await shop.populate("items");

    return res.status(201).json(shop);
  } catch (error) {
    console.error("EditShop Error:", error);
    return res.status(500).json({ message: `create shop error ${error}` });
  }
};


export const getMyShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner:req.userId }).populate("owner").populate({
      path:"items",
      options:{sort:{updatedAt:-1}}
    })

    if (!shop) {
      return null
    }

    return res.status(200).json(shop);
  } catch (error) {
    return res.status(500).json({ message: `Get my shop error: ${error.message}` });
  }
};

export const getPrintShops = async (req, res) => {
  try {
    //getPrintShops fetches from Shops collection.It does NOT fetch users so if shopdata exit then only it featch
    const printShops = await Shop.find({ shopType: "print" }).select("name _id");

    if (!printShops || printShops.length === 0) {
      return res.status(404).json({ message: "No print shops found" });
    }

    return res.status(200).json(printShops);
  } catch (error) {
    console.error("getPrintShops error:", error);
    return res.status(500).json({ message: `Server error: ${error.message}` });
  }
};
