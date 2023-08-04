const User = require('../model/user');

const createUser = async (req, res) => {
    try {
        const newUser =  new User(req.body)
        const saveUser = await newUser.save();
        res.status(200).json({ success: true, data: saveUser });
    }
    catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}


module.exports = { createUser };