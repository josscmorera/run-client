const jwt = require('jsonwebtoken');


const jwtValidate = (req, res, next) => {
    try {
        if(req.header && req.headers.authorization){
            const token = req.headers.authorization
            const slicedToken = token.split(" ")[1]
            const decodedToken = jwt.verify(slicedToken, process.env.SECRET_KEY)

            if(decodedToken){
                console.log('Decoded Token:', decodedToken);
                res.locals.decodedToken = decodedToken
                next()
            }
        }

        return res.status(400).json({success: false, message: "Invalid token"})
    } catch (error) {
        return res.status(400).json({success: false, message: "Invalid token", error: error})
    }
}

const jwtValidateAdmin = (req, res, next) => {
    try {
        if(req.header && req.headers.authorization){
            const token = req.headers.authorization
            const slicedToken = token.split(" ")[1]
            const decodedToken = jwt.verify(slicedToken, process.env.SECRET_KEY)

            if(decodedToken){
                if (!decodedToken.isAdmin) {
                    return res.status(400).json({ success: false, message: "You are not authorized to access this route" });
                }
                console.log('Decoded Token:', decodedToken);
                res.locals.decodedToken = decodedToken
                return next()
            }
        }

        return res.status(400).json({success: false, message: "Invalid token"})
    } catch (error) {
        return res.status(400).json({success: false, message: "Invalid token", error: error})
    }
}




module.exports = {jwtValidate, jwtValidateAdmin}

