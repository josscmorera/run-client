const User = require('../model/user');

const createAdmin = async (req, res) => {
    try {
        const newUser =  new User({...req.body, isAdmin: true})
        const saveUser = await newUser.save();
        res.status(200).json({ success: true, data: saveUser });
    }
    catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

module.exports = {  createAdmin };