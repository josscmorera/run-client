const User = require('../model/user');
const Movie = require('../model/movie');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existUser = await User.exists({ email });

        if (existUser) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        
        const userInfo = { ...req.body, password: hash }; 
        
        const newUser =  new User(userInfo);
        const savedUser = await newUser.save();

        const token = jwt.sign({ id: savedUser._id, isAdmin: savedUser.isAdmin }, process.env.SECRET_KEY, { expiresIn: '1d' });

        return res.status(200).json({ success: true, data: savedUser, token });
    }
    catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const foundUser = await User.findOne({ email });


        if (!foundUser) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, foundUser.password);


        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        // Generate a token and send it back to the user
        const token = jwt.sign({ id: foundUser._id, isAdmin: foundUser.isAdmin }, process.env.SECRET_KEY, { expiresIn: '1d' });

        return res.status(200).json({ success: true, data: foundUser, token: token });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

const validateUser = async (req, res, next) => {
    try {
        const decodedToken = res.locals.decodedToken
        const findUser = await User.findOne({_id: decodedToken.id})

        if(!findUser){
            return res.status(400).json({success: false, message: "Invalid token"})
        }
        
        return res.status(200).json({success: true, data: findUser})
    } catch (error) {
        return res.status(400).json({ success: false, message: "Invalid token", error: error });
    }
}

const addMovieFavorite = async (req, res) => {
    try {
        const { movieId } = req.body;

    
        const decodedToken = res.locals.decodedToken
        const findUser = await User.findOne({_id: decodedToken.id})

        console.log(findUser)

        const existFavorite = findUser.favorites.find(favorite => favorite === movieId)

        if(existFavorite){
            return res.status(400).json({ success: false, message: "Movie already exists in favorites" });
        }

        findUser.favorites.push(movieId)

        const savedUser = await findUser.save()

        return res.status(200).json({ success: true, data: savedUser });

    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: "Error adding movie to favorites", error: error });
    }
}

const removeMovieFavorite = async (req, res) => {
    try {
        const { movieId } = req.body;

        const decodedToken = res.locals.decodedToken
        const findUser = await User.findOne({_id: decodedToken.id})
        
        const favoriteIndex = findUser.favorites.findIndex(favorite => favorite === movieId)

        if(favoriteIndex !== -1) {
            findUser.favorites.splice(favoriteIndex, 1)
            
            const savedUser = await findUser.save()
            
            return res.status(200).json({ success: true, data: savedUser });
        }

        return res.status(400).json({ success: false, message: "Movie not exists in favorites" });
    } catch (error) {
        return res.status(400).json({ success: false, message: "Error removing movie from favorites", error: error });
    }
}

const listFavorites = async (req, res) => {
    try {
        const decodedToken = res.locals.decodedToken
        const findUser = await User.findOne({_id: decodedToken.id})

        const favorites = await Movie.find({ _id: { $in: findUser.favorites } })

        return res.status(200).json({ success: true, data: favorites });
    } catch (error) {
        return res.status(400).json({ success: false, message: "Error listing favorites", error: error });
    }
}


module.exports = { createUser, loginUser, validateUser, addMovieFavorite, removeMovieFavorite, listFavorites };