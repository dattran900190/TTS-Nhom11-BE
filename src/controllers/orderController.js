import Order from "../models/Order.js";
import createError from "../utils/createError.js";
import messages from "../constants/index.js";

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
      message: messages.ORDER.CREATE_SUCCESS,
      order: saved,
    });
  } catch (err) {
    next(err);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const { user_id, status, page = 1, limit = 5 } = req.query;

    const filter = {};
    if (user_id) filter.user_id = user_id;
    if (status) filter.status = status;

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate({ path: "user_id" })          // lấy thông tin người dùng
        // .populate({ path: "discount_id" })      // lấy thông tin mã giảm giá
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
    if (!order) throw createError({ message: messages.ORDER.NOT_FOUND });
    res.json({
      message: messages.ORDER.DETAIL_SUCCESS,
      order
    });
  } catch (err) {
    next(err);
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const current = await Order.findById(id);
    if (!current) throw createError({ message: messages.ORDER.NOT_FOUND });

    const updated = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      context: 'query',
      changedBy: req.user?.name || 'Admin', // Truyền thông tin người thay đổi
    }).setOptions({ _oldStatus: current.status }); // Truyền old status

    if (!updated) throw createError({ message: messages.ORDER.NOT_FOUND });

    res.json({
      message: messages.ORDER.UPDATE_SUCCESS,
      data: updated
    });
  } catch (err) {
    next(err);
  }
};

// export const deleteOrder = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const deleted = await Order.findByIdAndDelete(id);
//     if (!deleted) throw createError(404, "Không tìm thấy đơn hàng để xóa.");
//     // Optional: delete related OrderDetails
//     await OrderDetail.deleteMany({ id });
//     res.json({ message: "Xóa đơn hàng thành công" });
//   } catch (err) {
//     next(err);
//   }
// };
