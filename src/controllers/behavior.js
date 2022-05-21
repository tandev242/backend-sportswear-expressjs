const Behavior = require("../models/behavior")
const { getIdsOfRecommendedProducts } = require("../services/recomService")
const Product = require('../models/product');

exports.addBehavior = async (req, res) => {
    const { product, type } = req.body
    try {
        const behavior = await Behavior.findOne({ user: req.user._id, product })
        if (behavior) {
            let condition, update
            condition = {
                "user": req.user._id, product
            }
            if (type == "buy") {
                update = {
                    "$inc": { "buy": 1, "score": 5 }
                }
            }
            else if (type == "addToCart") {
                update = {
                    "$inc": { "addToCart": 1, "score": 3 }
                }
            } else if (type == "rate") {
                update = {
                    "$inc": { "rate": 1, "score": 3 }
                }
            }
            else {
                update = {
                    "$inc": { "view": 1, "score": 1 }
                }
            }
            const updatedBehavior = await Behavior.findOneAndUpdate(condition, update)
            if (updatedBehavior) {
                res.status(201).json({ message: "add behavior successfully" })
            } else {
                res.status(400).json({ error })
            }
        }
        else {
            const view = type == "view" ? 1 : 0
            const buy = type == "buy" ? 1 : 0
            const addToCart = type == "addToCart" ? 1 : 0
            const rate = type == "rate" ? 1 : 0
            const score = view * 1 + buy * 5 + addToCart * 3 + rate * 3

            const newBehavior = new Behavior({
                user: req.user._id,
                product,
                view,
                buy,
                addToCart,
                rate,
                score
            })
            newBehavior.save((error, behavior) => {
                if (error) return res.status(400).json({ error })
                if (behavior) {
                    res.status(201).json({ message: "add new behavior successfully" })
                }
            })
        }
    } catch (error) {
        return res.status(400).json({ error })
    }
}

exports.getRecommendedProductsByBehavior = async (req, res) => {
    const { _id } = req.user
    try {
      const ids = await getIdsOfRecommendedProducts( _id, "behavior")
      let products = await Product.find({
        '_id': { $in: ids }
      })
      if (products) {
        res.status(200).json({ products })
      } else {
        res.status(400).json({ error: "Something went wrong" })
      }
    } catch (error) {
      res.status(400).json({ error })
    }
  }
  