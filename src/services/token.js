const jwt = require("jsonwebtoken")

const generateAccessToken = ({ _id, email, role }) => {
    return jwt.sign({ _id, email, role }, process.env.JWT_SECRET)
}

module.exports = {
    generateAccessToken
}
