import mongoose from "mongoose";
import Payment from "../models/Payment.js";
import createError from "../utils/createError.js";
import messages from "../constants/index.js";
import { pickFields } from "../utils/pickFields.js";

export const getPayment = async (req, res, next) => {
    try {
        const { order_id, search = "", page = 1, limit = 5 } = req.query;

        const query = {};

        // Kiểm tra order_id hợp lệ và thêm điều kiện
        if (order_id) {
            if (!mongoose.Types.ObjectId.isValid(order_id)) {
                throw createError({ message: messages.PAYMENT.ORDER_ID_INVALID });
            }
            query.order_id = new mongoose.Types.ObjectId(order_id);
        }

        // Tìm theo phương thức thanh toán hoặc trạng thái thanh toán
        if (search) {
            query.$or = [
                { payment_method: { $regex: search, $options: "i" } },
                { payment_status: { $regex: search, $options: "i" } },
                { transaction_id: { $regex: search, $options: "i" } },
            ];
        }

        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            Payment.find(query)
                .populate("order_id")
                .sort({ paid_at: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Payment.countDocuments(query),
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

export const updatePaymentStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { payment_status } = req.body;

        // Kiểm tra ID hợp lệ
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw createError({ message: messages.PAYMENT.ID_INVALID });
        }

        // Kiểm tra payment_status
        const validStatuses = ["pending", "paid", "failed"];
        if (!validStatuses.includes(payment_status)) {
            throw createError(400, messages.PAYMENT.PAYMETN_STATUS_INVALID);
        }

        // Cập nhật
        const updatedPayment = await Payment.findByIdAndUpdate(
            id,
            { payment_status },
            { new: true, runValidators: true }
        );

        if (!updatedPayment) {
            throw createError({ message: messages.PAYMENT.NOT_FOUND });
        }

        res.status(200).json({
            message: messages.PAYMENT.UPDATE_SUCCESS,
            data: updatedPayment,
        });
    } catch (err) {
        next(err);
    }
};


