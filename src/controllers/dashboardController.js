
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import mongoose from "mongoose";

export const getDashboardSummary = async (req, res, next) => {
  try {
    const [totalOrders, totalUsers, totalRevenue, todayOrders, ordersByStatus] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments(),
      Order.aggregate([
        { $match: { status: "delivered" } },
        { $group: { _id: null, total: { $sum: "$total_price" } } }
      ]),
      Order.countDocuments({
        order_date: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lte: new Date(new Date().setHours(23, 59, 59, 999))
        }
      }),
      Order.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    res.json({
      totalOrders,
      totalUsers,
      totalRevenue: totalRevenue[0]?.total || 0,
      todayOrders,
      ordersByStatus: ordersByStatus.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {})
    });
  } catch (err) {
    next(err);
  }
};


export const getMonthlyRevenue = async (req, res, next) => {
  try {
    const currentYear = new Date().getFullYear();
    const revenue = await Order.aggregate([
      { $match: {
        status: "delivered",
        createdAt: {
          $gte: new Date(`${currentYear}-01-01`),
          $lte: new Date(`${currentYear}-12-31`)
        }
      } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$total_price" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const monthly = Array(12).fill(0);
    revenue.forEach(r => {
      monthly[r._id - 1] = r.total;
    });

    res.json({ year: currentYear, monthly });
  } catch (err) {
    next(err);
  }
};

export const getTopProducts = async (req, res, next) => {
  try {
    const topProducts = await Order.aggregate([
      { $match: { status: "delivered" } },
      { $lookup: {
          from: "orderdetails",
          localField: "_id",
          foreignField: "order_id",
          as: "items"
      }},
      { $unwind: "$items" },
      { $group: {
        _id: "$items.product_id",
        totalQuantity: { $sum: "$items.quantity" }
      }},
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
      { $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product"
      }},
      { $unwind: "$product" },
      { $project: {
        name: "$product.name",
        totalQuantity: 1
      }}
    ]);

    res.json({ topProducts });
  } catch (err) {
    next(err);
  }
};

export const getOrdersByCategory = async (req, res, next) => {
  try {
    const ordersByCategory = await Order.aggregate([
      { $match: { status: "delivered" } },
      { $lookup: {
          from: "orderdetails",
          localField: "_id",
          foreignField: "order_id",
          as: "items"
      }},
      { $unwind: "$items" },
      { $lookup: {
        from: "products",
        localField: "items.product_id",
        foreignField: "_id",
        as: "product"
      }},
      { $unwind: "$product" },
      { $group: {
        _id: "$product.category_id",
        totalOrders: { $sum: 1 }
      }},
      { $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "category"
      }},
      { $unwind: "$category" },
      { $project: {
        categoryName: "$category.name",
        totalOrders: 1
      }}
    ]);

    res.json({ ordersByCategory });
  } catch (err) {
    next(err);
  }
};

export const getUserCount = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    res.json({ totalUsers });
  } catch (err) {
    next(err);
  }
};
