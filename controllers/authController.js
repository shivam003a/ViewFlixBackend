const User = require('../models/userSchema')
const bcrypt = require('bcrypt')

exports.registerController = async(req, res)=>{
    try{
        const {name, username, email, password} = req.body;

        if(!name || !email || !password || !username){
            return res.status(400).json({
                success: false,
                msg: "input fields should not be empty",
                data: null
            })
        }
        const emailExist = await User.findOne({email});

        if(emailExist){
            return res.status(400).json({
                success: false,
                msg: "email already registered",
                data: null
            })
        }
        let hashedPassword = "";
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(password, salt);

        const data = await User.create({
            name,
            username,
            email,
            password: hashedPassword
        });
        data.password = undefined;

        res.status(200).json({
            success: true,
            msg: "account created successfully",
            data: data
        })

    }catch(e){
        res.status(500).json({
            success: false,
            msg: e.message || "internal server error",
            data: null
        })
    }
}

exports.loginController = async(req, res)=>{
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success: false,
                msg: "input fields should not be empty",
                data: null
            })
        };
        const emailExist = await User.findOne({email});

        if(!emailExist){
            return res.status(400).json({
                success: false,
                msg: "user does not exist",
                data: null
            })
        };
        const matchPassword = await bcrypt.compare(password, emailExist.password);

        if(!matchPassword){
            return res.status(400).json({
                success: false,
                msg: "password incorrect",
                data: null
            })
        }
        const token = await emailExist.genAuthToken();
        res.cookie("viewflixtoken", token, {
            expires : new Date(Date.now() + 604800000),
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        })

        emailExist.password = undefined;
        res.status(200).json({
            success: true,
            msg: "logged in successfully",
            data: emailExist
        })

    }catch(e){
        res.status(500).json({
            success: false,
            msg: e.message || "internal server error",
            data: null
        })
    }
}

exports.logout = async(req, res)=>{
    try{
        res.clearCookie('viewflixtoken').status(200).json({
            success: true,
            msg: "logged out",
            data: undefined
        })
        
    }catch(e){
        res.status(500).json({
            success: false,
            msg: e.message || "internal server error",
            data: null
        })
    }
}