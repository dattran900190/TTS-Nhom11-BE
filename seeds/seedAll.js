// seeds/seedAll.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import User from "../src/models/User.js";
import Product from "../src/models/Product.js"; // giả sử đã có Product
import Order from "../src/models/Order.js";
import Brand from "../src/models/Brand.js";
import Category from "../src/models/Category.js";
import OrderDetail from "../src/models/OrderDetail.js";
import OrderStatusHistory from "../src/models/OrderStatusHistory.js";
import Payment from "../src/models/Payment.js";
import Discount from "../src/models/Discount.js"; // giả sử đã có Discount

dotenv.config();
const MONGO_URI = process.env.DB_URI;

async function seedData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Đã kết nối MongoDB");

    // // XÓA DỮ LIỆU CŨ
    await Product.deleteMany({});
    await Discount.deleteMany({});
    await Order.deleteMany({});
    await OrderDetail.deleteMany({});
    await OrderStatusHistory.deleteMany({});
    // await User.deleteMany({}); // nếu có User
    // console.log("🗑️ Đã xóa dữ liệu cũ");

    // 1. Fake User
    const users = [];
    for (let i = 0; i < 5; i++) {
      users.push({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        phone: faker.phone.number("0#########"),
        address: faker.location.streetAddress(),
        role: "user",
        isEmailConfirmed: faker.datatype.boolean(),
      });
    }
    const createdUsers = await User.insertMany(users);
    console.log("✅ Đã tạo Users");

    // Tạo Brand và Category giả
    const brand = await Brand.create({ name: "Brand 1" });
    const category = await Category.create({ name: "Category 1" });

    // Tạo Product giả
    const product = await Product.create({
      name: "Sản phẩm demo",
      description: "Mô tả demo",
      brand_id: brand._id,
      category_id: category._id,
      price: 100000,
      total_stock: 50,
      image_url: "https://via.placeholder.com/150",
    });

    console.log("✅ Đã tạo sản phẩm giả");

    // 2. Fake Orders
    const products = await Product.find();
    const usedProducts = faker.helpers.shuffle(products).slice(0, faker.number.int({ min: 1, max: 3 }));
    const discounts = await Discount.find();

    if (!products.length) {
      console.log("❌ Chưa có sản phẩm nào.");
      return;
    }

    const orders = [];
    const orderDetails = [];

    for (let i = 0; i < 10; i++) {
  const user = faker.helpers.arrayElement(createdUsers);
  const discount = discounts.length > 0
    ? faker.helpers.arrayElement(discounts)
    : null;

  const order = new Order({
    user_id: user._id,
    order_date: faker.date.recent(),
    status: faker.helpers.arrayElement(["pending", "shipped", "delivered"]),
    shipping_address: user.address,
    note: faker.lorem.sentence(),
    total_price: 0, // sẽ gán sau
    discount_id: discount?._id ?? null,
  });

  // Tạo 1-3 orderDetail cho mỗi order
  let totalPrice = 0;
  const usedProducts = faker.helpers.shuffle(products).slice(0, faker.number.int({ min: 1, max: 3 }));
  for (const prod of usedProducts) {
    const quantity = faker.number.int({ min: 1, max: 5 });
    const price = prod.price;

    orderDetails.push({
      order_id: order._id,
      product_id: prod._id,
      quantity,
      price_at_order_time: price,
    });

    totalPrice += price * quantity;
  }

  order.total_price = totalPrice;
  await order.save(); // ✅ Lưu đơn hàng với tổng tiền sau khi tính

  // ✅ Tạo Payment gắn với order sau khi đã có total_price
  const isPaid = faker.datatype.boolean();
  await Payment.create({
    order_id: order._id,
    payment_method: isPaid ? "Momo" : "COD",
    payment_status: isPaid ? "paid" : "unpaid",
    transaction_id: isPaid ? faker.string.alphanumeric(12).toUpperCase() : null,
    paid_at: isPaid ? faker.date.recent() : null,
    amount: isPaid ? totalPrice : 0,
  });

  // ✅ Sinh OrderStatusHistory
  const statusSteps = ["pending", "shipped", "delivered"];
  const currentIndex = statusSteps.indexOf(order.status);

  for (let j = currentIndex + 1; j < statusSteps.length; j++) {
    const newStatus = statusSteps[j];

    await Order.findOneAndUpdate(
      { _id: order._id },
      { status: newStatus },
      {
        new: true,
        runValidators: true,
        context: "query"
      }
    ).setOptions({ changedBy: user.name || "Seeder" });
  }

      order.total_price = totalPrice;
      await order.save();
    }

    await OrderDetail.insertMany(orderDetails);
    console.log("✅ Đã tạo Orders và OrderDetails");
  } catch (error) {
    console.error("❌ Lỗi:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Ngắt kết nối MongoDB");
  }
}

seedData();
