const { getIdsOfRecommendedProducts } = require("../services/recomService")
const Product = require('../models/product');

exports.getRecommendedProductsById = async (req, res) => {
  const { id } = req.body
  if (!id) {
    res.status(400).json({ error: "Id is required" })
  }
  try {
    const ids = await getIdsOfRecommendedProducts(id, "product")
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
