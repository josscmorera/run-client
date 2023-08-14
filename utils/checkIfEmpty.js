const { isEmpty } = require("validator");

const checkIfEmpty = (req, res, next) => {
    try {
        const errObj = {};

        for (let key in req.body) {
            if (typeof req.body[key] === "string") {
                if (isEmpty(req.body[key])) {
                    errObj[key] = `${key} cannot be empty`;
                }
            }
            
        }
        if (Object.keys(errObj).length > 0) {
            return res.status(400).json({ success: false, message: "error", errors: errObj });
        } else {
            return next();
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, message: "error", errors: error });
    }
}

module.exports = { checkIfEmpty };

