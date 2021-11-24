const Product = require("../models/product");
const Order = require("../models/order");

exports.statisticRevenue = async (req, res) => {
    const { type } = req.body;
    const dateFrom = new Date(req.body.dateFrom);
    const dateTo = new Date(req.body.dateTo);
    try {
        if (type === "month") {
            const revenueMonthly = await Order.aggregate([
                {
                    "$match": {
                        "createdAt": { "$gt": dateFrom, "$lt": dateTo }
                    }
                },
                {
                    "$group": {
                        "_id": type,
                        "revenueMonthly": {
                            "Jan": { $sum: { $cond: { if: { $eq: [{ $month: "$createdAt" }, 1] }, then: "$totalAmount", else: 0 } } },
                            "Feb": { $sum: { $cond: { if: { $eq: [{ $month: "$createdAt" }, 2] }, then: "$totalAmount", else: 0 } } },
                            "Mar": { $sum: { $cond: { if: { $eq: [{ $month: "$createdAt" }, 3] }, then: "$totalAmount", else: 0 } } },
                            "Apr": { $sum: { $cond: { if: { $eq: [{ $month: "$createdAt" }, 4] }, then: "$totalAmount", else: 0 } } },
                            "May": { $sum: { $cond: { if: { $eq: [{ $month: "$createdAt" }, 5] }, then: "$totalAmount", else: 0 } } },
                            "June": { $sum: { $cond: { if: { $eq: [{ $month: "$createdAt" }, 6] }, then: "$totalAmount", else: 0 } } },
                            "July": { $sum: { $cond: { if: { $eq: [{ $month: "$createdAt" }, 7] }, then: "$totalAmount", else: 0 } } },
                            "Aug": { $sum: { $cond: { if: { $eq: [{ $month: "$createdAt" }, 8] }, then: "$totalAmount", else: 0 } } },
                            "Sep": { $sum: { $cond: { if: { $eq: [{ $month: "$createdAt" }, 9] }, then: "$totalAmount", else: 0 } } },
                            "Oct": { $sum: { $cond: { if: { $eq: [{ $month: "$createdAt" }, 10] }, then: "$totalAmount", else: 0 } } },
                            "Nov": { $sum: { $cond: { if: { $eq: [{ $month: "$createdAt" }, 11] }, then: "$totalAmount", else: 0 } } },
                            "Dec": { $sum: { $cond: { if: { $eq: [{ $month: "$createdAt" }, 12] }, then: "$totalAmount", else: 0 } } },
                        }
                    }
                }
            ]);
            if (revenueMonthly) {
                return res.status(200).json({ revenue })
            }
            res.status(400).json({ error: "something went wrong" })
        }
    } catch (error) {
        res.status(400).json({ error })
    }
}