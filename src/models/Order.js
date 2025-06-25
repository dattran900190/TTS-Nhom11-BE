import mongoose from "mongoose";
import OrderStatusHistory from "../models/OrderStatusHistory.js"

const orderSchema = new mongoose.Schema({
  user_id: { type: String, ref: "User" },
  order_date: Date,
  status: { type: String, required: true },
  shipping_address: String,
  note: String,
  total_price: Number,
  discount_id: { type: String, ref: "Discount" }
}, { timestamps: true });


orderSchema.pre('findOneAndUpdate', async function (next) {
  const doc = await this.model.findOne(this.getQuery()).lean();
  this._oldStatus = doc?.status;
  this._changedBy = this.getOptions()?.changedBy || 'System';
  next();
});

// POST: Ghi lịch sử nếu status thay đổi
orderSchema.post('findOneAndUpdate', async function (doc, next) {
  try {
    // console.log("✅ Đã vào middleware post update");

    if (!doc) return next();

    const update = this.getUpdate();
    const oldStatus = this._oldStatus;
    const newStatus = update.status || (update.$set && update.$set.status);

    console.log("Old:", oldStatus, "New:", newStatus);

    if (!newStatus || oldStatus === newStatus) return next();

    await OrderStatusHistory.create({
      order_id: doc._id.toString(),
      old_status: oldStatus,
      new_status: newStatus,
      changed_by: this.options.changedBy || 'System',
      changed_at: new Date(),
      note: `Trạng thái thay đổi từ ${oldStatus} sang ${newStatus}`,
    });

    // console.log("✅ Đã ghi lịch sử thành công");

    next();
  } catch (err) {
    console.error("❌ Lỗi post hook:", err);
    next(err);
  }
});


const Order = mongoose.model("Order", orderSchema);
export default Order;
// try {
  //   if (!doc) return next();

  //   const oldDoc = await this.model.findById(doc._id).lean(); // Lấy lại dữ liệu cũ trước khi update
  //   const update = this.getUpdate();

  //   // Nếu không có status mới hoặc không thay đổi, bỏ qua
  //   if (!update.status || oldDoc.status === update.status) return next();

  //   await OrderStatusHistory.create({
  //     order_id: doc._id.toString(),
  //     old_status: oldDoc.status,
  //     new_status: update.status,
  //     changed_by: this.options.changedBy || 'System',
  //     changed_at: new Date(),
  //     note: `Trạng thái thay đổi từ ${oldDoc.status} sang ${update.status}`
  //   });

  //   next();
  // } catch (err) {
  //   console.error("Lỗi ghi lịch sử trạng thái:", err);
  //   next(err);
  // }


  // Middleware: lưu trạng thái cũ trước khi cập nhật
// orderSchema.pre('findOneAndUpdate', async function (next) {
//   try {
//     const docToUpdate = await this.model.findOne(this.getQuery()).lean();
//     this._oldStatus = docToUpdate?.status;
//     next();
//   } catch (err) {
//     console.error("Lỗi pre hook:", err);
//     next(err);
//   }
// });
// PRE: Ghi lại status cũ và changed_by