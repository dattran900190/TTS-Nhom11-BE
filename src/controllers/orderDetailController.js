import OrderDetail from "../models/OrderDetail.js";
import createError from "../utils/createError.js";

export const createOrderDetail = async (req, res, next) => {
  try {
    const { order_id } = req.params;
    const { product_id, quantity, price_at_order_time } = req.body;
    // Ensure order exists
    const order = await Order.findById(order_id);
    if (!order) throw createError(404, "Không tìm thấy đơn hàng");

    const newDetail = new OrderDetail({ order_id, product_id, quantity, price_at_order_time });
    const saved = await newDetail.save();
    res.status(201).json({ message: "Thêm chi tiết đơn hàng thành công", orderDetail: saved });
  } catch (err) {
    next(err);
  }
};

export const getOrderDetails = async (req, res, next) => {
  try {
    const { order_id, product_id } = req.query;
    const filter = {};
    if (order_id) filter.order_id = order_id;
    if (product_id) filter.product_id = product_id;
    const details = await OrderDetail.find(filter);
    res.json({ data: details });
  } catch (err) {
    next(err);
  }
};

export const updateOrderDetail = async (req, res, next) => {
  try {
    const { order_detail_id } = req.params;
    const updated = await OrderDetail.findByIdAndUpdate(order_detail_id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) throw createError(404, "Không tìm thấy chi tiết đơn hàng để cập nhật.");
    res.json({ message: "Cập nhật chi tiết đơn hàng thành công", orderDetail: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteOrderDetail = async (req, res, next) => {
  try {
    const { order_detail_id } = req.params;
    const deleted = await OrderDetail.findByIdAndDelete(order_detail_id);
    if (!deleted) throw createError(404, "Không tìm thấy chi tiết đơn hàng để xóa.");
    res.json({ message: "Xóa chi tiết đơn hàng thành công" });
  } catch (err) {
    next(err);
  }
};
