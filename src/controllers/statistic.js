const Product = require("../models/product");
const Order = require("../models/order");

exports.statisticRevenue = async (req, res) => {
    const { type } = req.body;
    const dateFrom = new Date(req.body.dateFrom);
    const dateTo = new Date(req.body.dateTo);
    try {
        if (type == "day") {
            const revenue = await Order.aggregate(
                [
                    {
                        "$match": {
                            "createdAt": { "$gte": dateFrom, "$lte": dateTo }
                        }
                    },
                    {
                        "$group": {
                            "_id": {
                                $substr: ['$createdAt', 0, 10]
                            },
                            "total": {
                                "$sum": "$totalAmount"
                            }
                        }
                    },
                    {
                        "$project": {
                            "_id": 0,
                            "date": "$_id",
                            "totalAmount": "$total",
                        }
                    },
                    {
                        "$sort": {
                            "date": 1
                        }
                    }
                ]
            )
            if (revenue) {
                return res.status(200).json({ revenue })
            }
            res.status(400).json({ error: "something went wrong" })
        } else if (type == "month") {
            const revenue = await Order.aggregate(
                [
                    {
                        "$match": {
                            "createdAt": { "$gte": dateFrom, "$lte": dateTo }
                        }
                    },
                    {
                        "$group": {
                            "_id": {
                                $substr: ['$createdAt', 0, 7]
                            },
                            "total": {
                                "$sum": "$totalAmount"
                            }
                        }
                    },
                    {
                        "$project": {
                            "_id": 0,
                            "date": "$_id",
                            "totalAmount": "$total",
                        }
                    },
                    {
                        "$sort": {
                            "date": 1
                        }
                    }
                ]
            )
            if (revenue) {
                return res.status(200).json({ revenue })
            }
            res.status(400).json({ error: "something went wrong" })
        } else if (type == "year") {
            const revenue = await Order.aggregate(
                [
                    {
                        "$match": {
                            "createdAt": { "$gte": dateFrom, "$lte": dateTo }
                        }
                    },
                    {
                        "$group": {
                            "_id": {
                                $substr: ['$createdAt', 0, 4]
                            },
                            "total": {
                                "$sum": "$totalAmount"
                            }
                        }
                    },
                    {
                        "$project": {
                            "_id": 0,
                            "date": "$_id",
                            "totalAmount": "$total",
                        }
                    },
                    {
                        "$sort": {
                            "date": 1
                        }
                    }
                ]
            )
            if (revenue) {
                return res.status(200).json({ revenue })
            }
            res.status(400).json({ error: "something went wrong" })
        } else {
            res.status(400).json({ error: "Syntax is wrong" })
        }

    } catch (error) {
        res.status(400).json({ error })
    }
}