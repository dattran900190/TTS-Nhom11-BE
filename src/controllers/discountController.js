import mongoose from "mongoose";
import Discount from "../models/Discount.js";
import createError from "../utils/createError.js";
import messages from "../constants/index.js";
import { pickFields } from "../utils/pickFields.js";

export const getDiscounts = async (req, res, next) => {
    try {
        const { search = "", page = 1, limit = 5, include_deleted, only_deleted } = req.query;

        const query = {};

        // ⚠️ Xử lý lọc theo trạng thái is_deleted
        if (only_deleted === "true") {
            query.is_deleted = true;
        } else if (include_deleted !== "true") {
            query.is_deleted = false; // Mặc định: chỉ lấy chưa bị xoá mềm
        }

        // ⚙️ Tìm kiếm theo mã giảm giá
        if (search) {
            query.code = { $regex: search, $options: "i" };
        }

        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            Discount.find(query)
                .sort({ start_date: -1 }) // sắp xếp theo ngày bắt đầu
                .skip(skip)
                .limit(Number(limit)),
            Discount.countDocuments(query),
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


// CREATE new discount
export const createDiscount = async (req, res, next) => {
    try {
        const discount = new Discount(req.body);
        await discount.save();
        res.status(201).json({
            messages: messages.DISCOUNT.CREATE_SUCCESS,
            data: discount
        });
    } catch (err) {
        next(err);
    }
};

export const updateDiscount = async (req, res, next) => {
    try {
        const discount = await Discount.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(201).json({
            messages: messages.DISCOUNT.UPDATE_SUCCESS,
            data: discount
        });
    } catch (err) {
        next(err);
    }
};


export const deleteDiscount = async (req, res, next) => {
    try {
        const discount = await Discount.findByIdAndDelete(req.params.id);

        if (!discount) {
            return res.status(404).json({ message: "Không tìm thấy mã giảm giá để xoá." });
        }

        res.status(200).json({
            message: messages.DISCOUNT.HARD_DELETE_SUCCESS,
            dataL: discount
        });
    } catch (err) {
        next(err);
    }
};


export const softDeleteDiscount = async (req, res, next) => {
    try {
        const discount = await Discount.findByIdAndUpdate(
            req.params.id,
            { is_deleted: true },
            { new: true }
        );
        res.status(200).json({
            message: messages.DISCOUNT.SOFT_DELETE_SUCCESS,
            data: discount
        });
    } catch (err) {
        next(err);
    }
};

export const restoreDiscount = async (req, res, next) => {
    try {
        const discount = await Discount.findByIdAndUpdate(
            req.params.id,
            { is_deleted: false },
            { new: true }
        );
        res.status(200).json({
            message: messages.DISCOUNT.REGISTER_SUCCESS,
            data: discount
        });
    } catch (err) {
        next(err);
    }
};



