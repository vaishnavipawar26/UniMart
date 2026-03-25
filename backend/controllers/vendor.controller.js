import User from "../models/user.model.js";

export const updateShopType = async (req, res) => {
  try {
    const { shopType } = req.body;
    const userId = req.userId; // coming from isAuth middleware

    if (!shopType) return res.status(400).json({ message: "Shop type required" });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { shopType },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
