const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existUser = await User.exists({ email });

        if (existUser) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        
        const userInfo = { ...req.body, password: hash, isAdmin: true }; 
        
        const newUser =  new User(userInfo);
        const savedUser = await newUser.save();

        const token = jwt.sign({ id: savedUser._id, isAdmin: savedUser.isAdmin }, process.env.SECRET_KEY, { expiresIn: '1h' });

        return res.status(200).json({ success: true, data: savedUser, token });
    }
    catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
}

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const foundUser = await User.findOne({ email, isAdmin: true });


        if (!foundUser) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, foundUser.password);


        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        // Generate a token and send it back to the user
        const token = jwt.sign({ id: foundUser._id, isAdmin: foundUser.isAdmin }, process.env.SECRET_KEY, { expiresIn: '1h' });

        return res.status(200).json({ success: true, data: foundUser, token: token });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = {  createAdmin, loginAdmin };