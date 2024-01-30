const WatchList = require('../models/watchListSchema')

exports.getWatchLater = async(req, res)=>{
    try{
        const userId = req.user._id;

        const response = await WatchList.find({
            userId
        }).populate('videoId').exec()

        res.status(200).json({
            success: true,
            msg: "watch later fetched",
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

exports.watchLaterController = async(req, res) => {
    try {
        const videoId = req.params.videoId;
        const userId = req.user._id

        if(!videoId || !userId){
            return res.status(400).json({
                success: false,
                msg: "userId and videoId must be passed",
                data: undefined
            })
        }

        const ifExist = await WatchList.findOne({
            videoId, userId
        })

        if(ifExist){
            return res.status(400).json({
                success: false,
                msg: "already added",
                data: ifExist
            })
        }

        const response = await WatchList.create({
            videoId, userId
        })

        res.status(200).json({
            success: true,
            msg: "added successfully",
            data: response
        })

    } catch (e) {
        res.status(500).json({
            success: false,
            msg: "internal server error",
            data: undefined
        })
    }
}

exports.removeWatchLater = async(req, res)=>{
    try{
        const videoId = req.params.videoId;
        const userId = req.user._id;

        if(!videoId || !userId){
            return res.status(400).json({
                success: false,
                msg: "userId and videoId must be passed",
                data: undefined
            })
        }

        const ifExist = await WatchList.findOne({
            videoId, userId
        })

        if(!ifExist){
            return res.status(400).json({
                success: false,
                msg: "it does not exist in your watch later",
                data: undefined
            })
        }

        const response = await WatchList.findOneAndDelete({
            videoId, userId
        })

        res.status(200).json({
            success: true,
            msg: "removed successfully",
            data: response
        })

    }catch(e){
        res.status(500).json({
            success: false,
            msg: e,
            data: undefined
        })
    }
}