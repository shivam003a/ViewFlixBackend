const Video = require('../models/videoSchema')
const User = require('../models/userSchema')

exports.addVideo = async (req, res) => {
    try {
        const { title, description, imgUrl, videoUrl } = req.body
        const userId = req.user._id

        if (!title || !description || !imgUrl || !videoUrl || !userId) {
            return res.status(400).json({
                success: false,
                msg: "fields can't be empty",
                data: undefined
            })
        }

        try {
            const video = new Video({
                userId, ...req.body
            })
            await video.save()

            res.status(200).json({
                success: true,
                msg: "video added",
                data: video
            })

        } catch (e) {
            res.status(500).json({
                success: false,
                msg: e.message || "internal server error",
                data: undefined
            })
        }

    } catch (e) {
        res.status(500).json({
            success: false,
            msg: e.message || "internal server error",
            data: undefined
        })
    }
}

exports.updateVideo = async (req, res) => {
    try {
        const videoId = req.params.videoId
        const video = await Video.findOne({ _id: videoId })
        if (!video) {
            return res.status(400).json({
                success: false,
                msg: "no video found",
                data: undefined
            })
        }
        if (req.user._id !== video.userId) {
            return res.status(400).json({
                success: false,
                msg: "you can update only your video",
                data: undefined
            })
        }
        const response = await Video.findByIdAndUpdate(videoId, {
            $set: req.body
        }, { new: true })
        res.status(200).json({
            success: true,
            msg: "video updated",
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

exports.deleteVideo = async (req, res) => {
    try {
        const videoId = req.params.videoId
        const video = await Video.findOne({ _id: videoId })
        if (!video) {
            return res.status(400).json({
                success: false,
                msg: "no video found",
                data: undefined
            })
        }
        if (req.user._id !== video.userId) {
            return res.status(400).json({
                success: false,
                msg: "you can delete only your video",
                data: undefined
            })
        }
        const response = await Video.findByIdAndDelete(videoId)
        res.status(200).json({
            success: true,
            msg: "video deleted",
            data: response
        }, { new: true })

    } catch (e) {
        res.status(500).json({
            success: false,
            msg: e.message || "internal server error",
            data: undefined
        })
    }
}

exports.getVideo = async (req, res) => {
    try {
        const videoId = req.params.videoId
        const video = await Video.findById(videoId).populate('userId').exec()

        res.status(200).json({
            success: true,
            msg: "video fetched",
            data: video
        })

    } catch (e) {
        res.status(500).json({
            success: false,
            msg: e.message || "internal server error",
            data: undefined
        })
    }
}

exports.getRandom = async (req, res) => {
    try {
        const videos = await Video.aggregate([{ $sample: { size: 50 } }]);
        res.status(200).json({
            success: true,
            msg: "fetched random",
            data: videos
        })

    } catch (e) {
        res.status(500).json({
            success: false,
            msg: e.message || "internal server error",
            data: undefined
        })
    }
}

exports.addView = async (req, res) => {
    try {
        const response = await Video.findByIdAndUpdate(req.params.videoId, {
            $inc: { views: 1 },
        }, { new: true })

        res.status(200).json({
            success: true,
            msg: "views added",
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

exports.subVideos = async(req, res)=>{
    try{
        const user = await User.findById(req.user._id)
        const subscribedTo = user.subscribedUsers

        const subscribedVideos = await Promise.all(
            subscribedTo.map(async (channel)=>{
                return (
                    await Video.find({userId: channel})
                )
            })
        )
        const subscribedVideosFlat = subscribedVideos.flat()

        res.status(200).json({
            success: true,
            msg: "fetched subs videos",
            data: subscribedVideosFlat
        })

    }catch(e){
        res.status(500).json({
            success: false,
            msg: e.message || "internal server error",
            data: undefined
        })
    }
}

exports.getByTag = async(req, res)=>{
    try{
        const tags = req.query.tags.split(',')
        const videos = await Video.find({tags: {$in: tags}}).limit(40)

        res.status(200).json({
            success: true,
            msg: "found by tags",
            data: videos
        })

    }catch(e){
        res.status(500).json({
            success: false,
            msg: e.message || "internal server error",
            data: undefined
        })
    }
}

exports.getByTitle = async(req, res)=>{
    try{
        const query = req.query.q
        const regexpQuery = new RegExp(query, "i");
        const videos = await Video.find({title: regexpQuery}).limit(40)

        res.status(200).json({
            success: true,
            msg: "found by query",
            data: videos
        })

    }catch(e){
        res.status(500).json({
            success: false,
            msg: e.message || "internal server error",
            data: undefined
        })
    }
}