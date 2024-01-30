const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    img: {
        type: String,
        default: ""
    },
    subscribers: {
        type: Number,
        default: 0
    },
    subscribedUsers: {
        type: [String]
    },
    token: {
        type: String
    }
}, {timestamps: true})

userSchema.methods.genAuthToken = async function(){
    const payload = {
        _id: this._id,
        email: this.email
    }
    const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: "168h"
    })
    this.token = token;
    await this.save();

    return token;
}

const User = mongoose.model("User", userSchema);
module.exports = User;