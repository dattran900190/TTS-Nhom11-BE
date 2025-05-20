import Brand from "../models/Brand.js";
import createError from "../utils/createError.js";


export const getBrand = async (req, res, next) => {
    try {
        const brands = await Brand.find();
        res.json({
            message: "Danh sách thương hiệu",
            brands
        });
    } catch (err) {
        next(err);
    }
};

export const createBrand = async (req, res, next) => {
    try {
        const { brand_id, name, origin, description } = req.body; // lấy dữ liệu 

        const existing = await Brand.findOne({ brand_id }); // check id nếu tồn tại thì trả về lỗi 400
        if (existing) {
            throw createError(400, "Brand ID đã tồn tại.");
        }

        const newBrand = new Brand({ brand_id, name, origin, description }); // tạo object mới theo schema
        const savedBrand = await newBrand.save(); // .save() để ghi vào mongodb

        // trả dữ liệu vừa tạo
        res.status(201).json({
            message: "Thêm thương hiệu thành công",
            Brand: savedBrand
        });
    } catch (err) {
        next(err);  // đẩy vào errorHandler chung
    }
};

export const updateBrand = async (req, res, next) => {
    try {
        const { brand_id } = req.params;
        const { name, origin, description } = req.body;

        const updated = await Brand.findOneAndUpdate(
            { brand_id },
            { name, origin, description },
            { new: true } // trả về bản mới sau khi cập nhật
        );

        if (!updated) {
            throw createError(400, "Không tìm thấy thương hiệu để cập nhật.");
        }

        res.json({
            message: "Cập nhật thương hiệu thành công",
            brand: updated
        })
    } catch (err) {
        next(err);
    }
}

export const deleteBrand = async (req, res, next) => {
    try {
        const { brand_id } = req.params;

        const deteled = await Brand.findOneAndDelete({ brand_id });

        if (!deteled) {
            throw createError(400, "Không tìm thấy thương hiệu để xoá.");
        }

        res.json({
            message: "Xoá thương hiệu thành công",
        })
    } catch (err) {
        next(err);
    }
}