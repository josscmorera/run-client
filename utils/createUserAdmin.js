const User = require('../model/user');
const bcrypt = require('bcrypt');

const createUserAdmin = async () => {
    try {
        const user = await User.findOne();
        if(!user){

          const salt = await bcrypt.genSalt(10);
          const hash =  await bcrypt.hash(process.env.USER_ADMIN_PASS, salt);
          
            const newUser = new User({
                firstName: "Admin",
                lastName: "Movies",
                email: process.env.USER_ADMIN_EMAIL,
                password: hash,
                isAdmin: true,
            });
            await newUser.save();
            console.log("Admin user was created");
        }
return 
   } catch (error) {
        console.log(error);
        throw new Error("Error creating admin user");
    }
}

module.exports = {createUserAdmin};