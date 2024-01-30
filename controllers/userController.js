const User = require('../models/userSchema')
const bcrypt = require('bcrypt')
const Video = require('../models/videoSchema')

exports.updateUsers = async (req, res) => {
    if (req.params.id === req.user._id) {
        try {
            let response = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, { new: true }).select('-password')

            const { password } = req.body
            if (password) {
                let hashedPassword
                const salt = await bcrypt.genSalt(10)
                hashedPassword = await bcrypt.hash(password, salt)
                response = await User.findByIdAndUpdate(req.params.id, {
                    $set: { password: hashedPassword }
                }, { new: true }).select('-password')
            }

            res.status(200).json({
                success: true,
                msg: "user updated",
                data: response
            })

        } catch (e) {
            res.status(500).json({
                success: false,
                msg: e.message || "internal server error",
                data: undefined
            })
        }
    }
    else {
        res.status(400).json({
            success: false,
            msg: "you can update only your account",
            data: undefined
        })
    }
}

exports.deleteUser = async (req, res) => {
    if (req.params.id === req.user._id) {
        try {
            const response = await User.findByIdAndDelete(req.params.id)
            res.status(200).json({
                success: true,
                msg: "user deleted",
                data: response
            })

        } catch (e) {
            res.status(500).json({
                success: false,
                msg: e.message || "internal server error",
                data: undefined
            })
        }
    }
    else {
        res.status(400).json({
            success: false,
            msg: "you can delete only your account",
            data: undefined
        })
    }
}

exports.getUser = async (req, res) => {
    try {
        const response = await User.findById(req.params.id).select('-password').select('-token')
        res.status(200).json({
            success: true,
            msg: "fetched user",
            data: response
        })

    } catch (e) {
        res.status(500).json({
            success: false,
            msg: e.message || "internal server error",
            data: undefined
        })
    }
}

exports.getMe = async (req, res) => {
    try {
        const response = await User.findById(req.user._id).select('-password').select('-token')
        res.status(200).json({
            success: true,
            msg: "fetched me user",
            data: response
        })

    } catch (e) {
        res.status(500).json({
            success: false,
            msg: e.message || "internal server error",
            data: undefined
        })
    }
}

exports.subscribeUser = async (req, res) => {
    try {
        if (req.user._id === req.params.id) {
            return res.status(400).json({
                success: false,
                msg: "you can't subscribe yourself",
                data: undefined
            })
        }
        const response = await User.findOne({_id: req.params.id})
        if(!response){
            return res.status(400).json({
                success: false,
                msg: "user does not exist",
                data: undefined
            })
        }

        const responseUser = await User.findByIdAndUpdate(req.user._id, {
            $push: { subscribedUsers: req.params.id }
        }, { new: true })

        await User.findByIdAndUpdate(req.params.id, {
            $inc: { subscribers: 1 }
        }, { new: true })
        res.status(200).json({
            success: true,
            msg: "subscribed",
            data: responseUser
        })

    } catch (e) {
        res.status(500).json({
            success: false,
            msg: e.message || "internal server error",
            data: undefined
        })
    }
}

exports.unsubscribeUser = async (req, res) => {
    try {
        const responseUser = await User.findByIdAndUpdate(req.user._id, {
            $pull: { subscribedUsers: req.params.id }
        }, { new: true })

        await User.findByIdAndUpdate(req.params.id, {
            $inc: { subscribers: -1 }
        }, { new: true })
        res.status(200).json({
            success: true,
            msg: "unsubscribed",
            data: responseUser
        })

    } catch (e) {
        res.status(500).json({
            success: false,
            msg: e.message || "internal server error",
            data: undefined
        })
    }
}

exports.likeVideo = async(req, res)=>{
    try{
        const videoId = req.params.videoId
        const id = req.user._id

        const response = await Video.findByIdAndUpdate(videoId, {
            $addToSet: {likes: id},
            $pull: {dislikes: id}
        }, {new: true})

        res.status(200).json({
            success: true,
            msg: "likes added",
            data: response
        })

    }catch(e){
        res.status(500).json({
            success: false,
            msg: e.message || "internal server error",
            data: undefined
        })
    }
}

exports.dislikeVideo = async(req, res)=>{
    try{
        const videoId = req.params.videoId
        const id = req.user._id

        const response = await Video.findByIdAndUpdate(videoId, {
            $addToSet: {dislikes: id},
            $pull: {likes: id}
        }, {new: true})

        res.status(200).json({
            success: true,
            msg: "likes removed",
            data: response
        })
        
    }catch(e){
        res.status(500).json({
            success: false,
            msg: e.message || "internal server error",
            data: undefined
        })
    }
}