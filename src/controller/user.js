const User = require('../models/user');

exports.getUsers = (req, res) => {
    User.find({}).exec((error, users) => {
        if (error) {
            return res.status(400).json({ error })
        }
        if (users) {
            return res.status(200).json({ users });
        } else {
            return res.status(400).json({ error: "something went wrong" });
        }
    })
}

exports.updateUser = (req, res) => {
    const { user } = req.body;
    User.findOneAndUpdate({ _id: user._id }, { ...user }
    ).exec((error, result) => {
        if (error) return res.status(400).json({ error });
        if (result) {
            res.status(202).json({ message: "updated successfully" });
        }else{
            res.status(400).json({ error: "something went wrong" });
        }
    });
}

exports.deleteUserById = (req, res) => {
    const { _id } = req.body.payload;
    User.findOneAndDelete({ _id }).exec((error, result) => {
        if (error) return res.status(400).json({ error });
        if (result) {
            res.status(204).json({ message: "deleted successfully" });
        }else{
            res.status(400).json({ error: "something went wrong" });
        }
    });
}