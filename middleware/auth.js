const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/userSchema');

dotenv.config();

const auth = async(req, res, next)=>{
    try{
        const token = req.cookies.viewflixtoken;
        if(!token){
            return res.status(400).json({
                success: false,
                msg: "unauthorized",
                data: undefined
            })
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if(!payload){
            return res.status(400).json({
                success: false,
                msg: "unauthorized",
                data: undefined
            })
        }

        const emailExist = await User.findOne({
            email: payload.email,
            token: token
        });
        
        if(emailExist){
            req.user = payload;
            next();
        }
        else{
            throw new Error('unauthorized');
        }

    }catch(e){
        res.status(500).json({
            success: false,
            msg: e.message,
            data: undefined
        })
    }
}

module.exports = auth;