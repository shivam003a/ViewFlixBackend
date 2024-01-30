const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const dbConnect = () => {
    mongoose.connect(process.env.DB_URL).then(() => {
        console.log("connected!")
        
    }).catch((e) => {
        console.log(e.message);
    })
}

module.exports = dbConnect;