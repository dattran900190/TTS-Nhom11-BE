import Order from "../models/Order.js";
import createError from "../utils/createError.js";

export const createOrder = async (req, res, next) => {
  try {
    const { user_id, order_date, status, shipping_address, note, total_price, discount_id } = req.body;
    const newOrder = new Order({
      user_id,
      order_date,
      status,
      shipping_address,
      note,
      total_price,
      discount_id,
    });
    const saved = await newOrder.save();
    res.status(201).json({
      message: "Tạo đơn hàng thành công",
      order: saved,
    });
  } catch (err) {
    next(err);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const { user_id, status, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (user_id) filter.user_id = user_id;
    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .skip(skip)
        .limit(Number(limit))
        .sort({ order_date: -1 }),
      Order.countDocuments(filter),
    ]);

    res.json({
      page: Number(page),
      total,
      data: orders,
    });
  } catch (err) {
    next(err);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) throw createError(404, "Không tìm thấy đơn hàng");
    res.json({ message: "Chi tiết đơn hàng", order });
  } catch (err) {
    next(err);
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) throw createError(404, "Không tìm thấy đơn hàng để cập nhật.");
    res.json({ message: "Cập nhật đơn hàng thành công", order: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Order.findByIdAndDelete(id);
    if (!deleted) throw createError(404, "Không tìm thấy đơn hàng để xóa.");
    // Optional: delete related OrderDetails
    await OrderDetail.deleteMany({ id });
    res.json({ message: "Xóa đơn hàng thành công" });
  } catch (err) {
    next(err);
  }
};
