import Cart from "../models/Cart.js";
import CartItem from "../models/CartItem.js";
import Product from "../models/Product.js";
import Variant from "../models/ProductVariant.js";
import messages from "../constants/index.js";

// Thêm sản phẩm (có thể kèm biến thể) vào giỏ hàng
export const addItemToCart = async (req, res) => {
  try {
    const user_id = req.user._id; // Lấy user_id từ token
    const { product_id, variant_id, quantity } = req.body;

    if (!product_id || !quantity) {
      return res
        .status(400)
        .json({ message: messages.CART.PRODUCT_AND_QUANTITY_REQUIRED });
    }

    let cart = await Cart.findOne({ user_id });
    if (!cart) {
      cart = new Cart({ user_id, total_price: 0 });
      await cart.save();
    }

    const product = await Product.findById(product_id);
    if (!product)
      return res.status(404).json({ message: messages.CART.PRODUCT_NOT_FOUND });

    let variant = null;
    let price = product.price;

    if (variant_id) {
      variant = await Variant.findById(variant_id);
      if (!variant)
        return res
          .status(404)
          .json({ message: messages.CART.VARIANT_NOT_FOUND });
      price = variant.price;
    }

    let existingItem = await CartItem.findOne({
      cart_id: cart._id,
      product_id,
      variant_id: variant_id || null,
    });

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.total_price = existingItem.quantity * existingItem.price;
      await existingItem.save();

      cart.total_price += price * quantity;
      await cart.save();

      return res
        .status(200)
        .json({
          message: messages.CART.UPDATE_ITEM_SUCCESS,
          item: existingItem,
        });
    }

    const cartItem = new CartItem({
      cart_id: cart._id,
      product_id,
      variant_id: variant_id || null,
      quantity,
      price,
      total_price: price * quantity,
    });
    await cartItem.save();

    cart.total_price += price * quantity;
    await cart.save();

    res
      .status(201)
      .json({ message: messages.CART.ADD_ITEM_SUCCESS, item: cartItem });
  } catch (error) {
    res.status(500).json({ message: messages.CART.ADD_ITEM_FAILED, error });
  }
};
// Hàm cập nhật giá trong giỏ hàng khi giá sản phẩm hoặc biến thể thay đổi
export const updateCartPricesByProductOrVariant = async ({
  product_id,
  variant_id,
  newPrice,
}) => {
  try {
    const filter = { product_id };
    if (variant_id !== undefined) {
      filter.variant_id = variant_id;
    }

    const cartItems = await CartItem.find(filter);
    if (!cartItems.length) return;

    for (const item of cartItems) {
      const oldTotalPrice = item.total_price;
      item.price = newPrice;
      item.total_price = item.quantity * newPrice;
      await item.save();

      const cart = await Cart.findById(item.cart_id);
      if (!cart) continue;

      cart.total_price = cart.total_price - oldTotalPrice + item.total_price;
      if (cart.total_price < 0) cart.total_price = 0;
      await cart.save();
    }
  } catch (error) {
    console.error("Error updating cart prices:", error);
  }
};

// Lấy giỏ hàng và danh sách sản phẩm (có biến thể) theo user_id
export const getCartByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ user_id: userId });
    if (!cart)
      return res.status(404).json({ message: messages.CART.NOT_FOUND });

    const items = await CartItem.find({ cart_id: cart._id })
      .populate("product_id")
      .populate("variant_id");

    res.status(200).json({ message: messages.CART.GET_SUCCESS, cart, items });
  } catch (error) {
    res.status(500).json({ message: messages.CART.CREATE_FAILED, error });
  }
};

// Cập nhật số lượng sản phẩm (biến thể) trong giỏ hàng
export const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: messages.CART.QUANTITY_MINIMUM });
    }

    const item = await CartItem.findById(id);
    if (!item)
      return res.status(404).json({ message: messages.CART.ITEM_NOT_FOUND });

    const cart = await Cart.findById(item.cart_id);
    if (!cart)
      return res.status(404).json({ message: messages.CART.NOT_FOUND });

    // 👉 Lấy giá mới nhất
    let latestPrice = 0;
    if (item.variant_id) {
      const variant = await Variant.findById(item.variant_id);
      if (!variant)
        return res
          .status(404)
          .json({ message: messages.CART.VARIANT_NOT_FOUND });
      latestPrice = variant.price;
    } else {
      const product = await Product.findById(item.product_id);
      if (!product)
        return res
          .status(404)
          .json({ message: messages.CART.PRODUCT_NOT_FOUND });
      latestPrice = product.price;
    }

    // Tìm item khác cùng product_id + variant_id trong cùng cart (khác item hiện tại)
    const existingItem = await CartItem.findOne({
      cart_id: item.cart_id,
      product_id: item.product_id,
      variant_id: item.variant_id,
      _id: { $ne: item._id },
    });

    if (existingItem) {
      // Nếu đã có item trùng, gộp lại
      existingItem.quantity += quantity;
      existingItem.price = latestPrice;
      existingItem.total_price = existingItem.quantity * latestPrice;
      await existingItem.save();

      const oldAmount = item.price * item.quantity;
      const newAmount = existingItem.total_price;

      cart.total_price = cart.total_price - oldAmount + newAmount;
      if (cart.total_price < 0) cart.total_price = 0;
      await cart.save();

      await item.deleteOne();

      return res
        .status(200)
        .json({
          message: messages.CART.UPDATE_ITEM_SUCCESS,
          item: existingItem,
        });
    } else {
      // Cập nhật lại giá và tổng
      const oldTotal = item.total_price;
      item.quantity = quantity;
      item.price = latestPrice;
      item.total_price = quantity * latestPrice;
      await item.save();

      cart.total_price = cart.total_price - oldTotal + item.total_price;
      if (cart.total_price < 0) cart.total_price = 0;
      await cart.save();

      return res
        .status(200)
        .json({ message: messages.CART.UPDATE_ITEM_SUCCESS, item });
    }
  } catch (error) {
    res.status(500).json({ message: messages.CART.UPDATE_FAILED, error });
  }
};

// Xóa sản phẩm (biến thể) khỏi giỏ hàng
export const deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await CartItem.findById(id);
    if (!item)
      return res.status(404).json({ message: messages.CART.ITEM_NOT_FOUND });

    const amount = item.total_price;
    await item.deleteOne();

    const cart = await Cart.findById(item.cart_id);
    if (cart) {
      cart.total_price -= amount;
      if (cart.total_price < 0) cart.total_price = 0;
      await cart.save();
    }

    res.status(200).json({ message: messages.CART.DELETE_ITEM_SUCCESS });
  } catch (error) {
    res.status(500).json({ message: messages.CART.DELETE_FAILED, error });
  }
};
