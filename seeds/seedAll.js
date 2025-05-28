// seeds/seedAll.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import User from "../src/models/User.js";
import Order from "../src/models/Order.js";
import OrderDetail from "../src/models/OrderDetail.js";
import Product from "../src/models/Product.js"; // giả sử đã có Product
import Discount from "../src/models/Discount.js"; // giả sử đã có Discount

dotenv.config();
const MONGO_URI = process.env.DB_URI;

async function seedData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Kết nối MongoDB thành công");

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

    // 2. Fake Orders
    const products = await Product.find();
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
        total_price: 0, // sẽ tính sau từ orderDetail
        discount_id: discount?._id ?? null,
      });

      await order.save();

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
