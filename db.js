const mongoose = require('mongoose');

const moongoseConect = async () => {
    try {
        await mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('connected to mongodb');
    } catch (error) {
        console.log(error);
    }
}

module.exports = {moongoseConect};