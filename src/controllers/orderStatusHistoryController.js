import mongoose from "mongoose";
import OrderStatusHistory from "../models/OrderStatusHistory.js";
import createError from "../utils/createError.js";

export const getOrderStatusHistory = async (req, res, next) => {
  try {
    const { order_id, search = "", page = 1, limit = 5 } = req.query;

    const query = {};

    // Nếu có order_id, kiểm tra và thêm vào điều kiện
    if (order_id) {
      if (!mongoose.Types.ObjectId.isValid(order_id)) {
        return res.status(400).json({ message: "order_id không hợp lệ" });
      }
      query.order_id = new mongoose.Types.ObjectId(order_id);
    }

    // Tìm theo tên người thay đổi
    if (search) {
      query.changed_by = { $regex: search, $options: "i" };
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      OrderStatusHistory.find(query)
        .sort({ changed_at: -1 })
        .skip(skip)
        .limit(Number(limit)),
      OrderStatusHistory.countDocuments(query),
    ]);

    res.status(200).json({
      page: Number(page),
      total,
      data,
    });
  } catch (err) {
    next(err);
  }
};



export const updateOrderStatusNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { note } = req.body;
    const history = await OrderStatusHistory.findByIdAndUpdate(id, { note }, { new: true });
    res.status(200).json(history);
  } catch (err) {
    next(err);
  }
};