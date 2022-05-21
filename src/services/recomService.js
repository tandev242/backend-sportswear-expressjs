const axios = require("axios")
require("dotenv").config()
const URL_API =
  "https://recom.fpt.vn/api/v0.1/recommendation/api/result/getResult/"
const FPT_ID_PRODUCT = process.env.FPT_ID_PRODUCT
const FPT_ID_BEHAVIOR = process.env.FPT_ID_BEHAVIOR
const API_FPT_KEY_RECOMMEND_BY_PRODUCT = process.env.API_FPT_KEY_RECOMMEND_BY_PRODUCT
const API_FPT_KEY_RECOMMEND_BY_BEHAVIOR = process.env.API_FPT_KEY_RECOMMEND_BY_BEHAVIOR

// let productId = "621b15725acef22324f80272"

const getIdsOfRecommendedProducts = async (id, type) => {
  let url;
  if (type == "product") {
    url = `${URL_API}${FPT_ID_PRODUCT}?input=${id}&key=${API_FPT_KEY_RECOMMEND_BY_PRODUCT}`
  } else {
    url = `${URL_API}${FPT_ID_BEHAVIOR}?input=${id}&key=${API_FPT_KEY_RECOMMEND_BY_BEHAVIOR}`
  }
  try {
    let response = await axios.get(url)
    if (response && response.status === 200) {
      let listId = await formatListId(response.data.data)
      return listId
    }
    return null
  } catch (e) {
    return null
  }
}

const formatListId = (arrData) => {
  let Ids = []
  for (let i = 0; i < arrData.length; ++i) {
    let id = arrData[i].id
    Ids.push(id)
  }
  return Ids
}

module.exports = { getIdsOfRecommendedProducts }
