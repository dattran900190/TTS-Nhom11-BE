import Brand from "../models/Brand.js";
import createError from "../utils/createError.js";


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
        }
        // Nếu không include, mặc định là chưa xoá
        else if (include_deleted !== "true") {
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
        const { name, origin, description } = req.body; // lấy dữ liệu 

        const newBrand = new Brand({ name, origin, description }); // tạo object mới theo schema
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
        const { id } = req.params;
        const { name, origin, description } = req.body;

        const updated = await Brand.findByIdAndUpdate(
            id,
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
        const { id } = req.params;

        const deteled = await Brand.findByIdAndUpdate(id);

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

export const softDeleteBrand = async (req, res, next) => {
    try {
        const { id } = req.params;

        const brand = await Brand.findByIdAndUpdate(
            id,
            { is_deleted: true },
            { new: true }
        );

        if (!brand) {
            return res.status(404).json({ message: "Không tìm thấy thương hiệu" });
        }

        res.json({ message: "Đã xoá mềm thương hiệu", brand });
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
            return res.status(404).json({ message: "Không tìm thấy thương hiệu" });
        }

        res.json({ message: "Khôi phục thương hiệu thành công", brand });
    } catch (err) {
        next(err);
    }
};
