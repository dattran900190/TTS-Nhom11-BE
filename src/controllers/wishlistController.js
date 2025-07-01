import Wishlist from "../models/Wishlist.js";
import { v4 as uuidv4 } from "uuid";


export const getWishlistByUser = async (req, res) => {
  try {
    const wishlists = await Wishlist.find({ user_id: req.params.user_id }).populate("product_id");
    res.status(200).json(wishlists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const addWishlist = async (req, res) => {
  const { product_id } = req.body;
  const user_id = req.user._id; 

  try {
    const exists = await Wishlist.findOne({ user_id, product_id });
    if (exists) {
      return res.status(400).json({ message: "Sản phẩm đã có trong wishlist" });
    }

    const newItem = new Wishlist({
      wishlist_id: uuidv4(),
      user_id,
      product_id,
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteWishlist = async (req, res) => {
  try {
    const deleted = await Wishlist.findOneAndDelete({ wishlist_id: req.params.id });
    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy wishlist để xóa" });
    }
    res.status(200).json({ message: "Xóa thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
