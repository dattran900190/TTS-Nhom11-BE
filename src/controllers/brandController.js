import Brand from "../models/Brand.js";
import createError from "../utils/createError.js";
import messages from "../constants/index.js";
import { pickFields } from "../utils/pickFields.js";


export const getBrand = async (req, res, next) => {
    try {
        // Lấy query params Lấy các tham số trên URL, ví dụ: ?search=admin&page=1&limit=10
        const { search = "", page = 1, limit = 5, include_deleted, only_deleted } = req.query;

        const query = {
            name: { $regex: search, $options: "i" }, // tìm kiếm không phân biệt hoa thường
        };


        // Chỉ lấy brand bị xoá mềm
        if (only_deleted === "true") {
            query.is_deleted = true;
        } else if (include_deleted !== "true") { // Nếu không include, mặc định là chưa xoá
            query.is_deleted = false;
        }

        const skip = (page - 1) * limit;

        const [brands, total] = await Promise.all([
            Brand.find(query).skip(skip).limit(Number(limit)),
            Brand.countDocuments(query)
        ]);

        res.json({
            page: Number(page),
            total,
            data: brands,
        });
    } catch (err) {
        next(err);
    }
};

export const createBrand = async (req, res, next) => {
    try {
        const data = pickFields(req.body, ["name", "origin", "description"]);
        const newBrand = new Brand(data); // tạo object mới theo schema
        const savedBrand = await newBrand.save(); // .save() để ghi vào mongodb

        // trả dữ liệu vừa tạo
        res.status(201).json({
            message: messages.BRAND.CREATE_SUCCESS,
            Brand: savedBrand
        });
    } catch (err) {
        next(err);  // đẩy vào errorHandler chung
    }
};

export const updateBrand = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = pickFields(req.body, ["name", "origin", "description"]);

        const updated = await Brand.findByIdAndUpdate(
            id,
            data, 
            { new: true } // trả về bản mới sau khi cập nhật
        );

        if (!updated) {
            throw createError({ message: messages.BRAND.NOT_FOUND });
        }

        res.json({
            message: messages.BRAND.UPDATE_SUCCESS,
            brand: updated
        })
    } catch (err) {
        next(err);
    }
}

export const deleteBrand = async (req, res, next) => {
    try {
        const { id } = req.params;

        const deteled = await Brand.findByIdAndUpdate(id);

        if (!deteled) {
            throw createError({ messages: messages.BRAND.NOT_FOUND });
        }

        res.json({
            message: messages.BRAND.HARD_DELETE_SUCCESS,
        })
    } catch (err) {
        next(err);
    }
}

export const softDeleteBrand = async (req, res, next) => {
    try {
        const { id } = req.params;

        const brand = await Brand.findByIdAndUpdate(
            id,
            { is_deleted: true },
            { new: true }
        );

        if (!brand) {
            throw createError({ message: messages.BRAND.NOT_FOUND });
        }

        res.json({
            message: messages.BRAND.SOFT_DELETE_SUCCESS,
            brand
        });
    } catch (err) {
        next(err);
    }
};


export const restoreBrand = async (req, res, next) => {
    try {
        const { id } = req.params;

        const brand = await Brand.findByIdAndUpdate(
            id,
            { is_deleted: false },
            { new: true }
        );

        if (!brand) {
            throw createError({ message: messages.BRAND.NOT_FOUND });
        }

        res.json({
            message: messages.BRAND.REGISTER_SUCCESS,
            brand
        });
    } catch (err) {
        next(err);
    }
};
