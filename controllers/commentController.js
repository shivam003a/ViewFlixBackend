const Comment = require('../models/commentSchema')

exports.addComment = async(req, res)=>{
    try{
        const userId = req.user._id
        const {videoId, desc} = req.body

        const comment = new Comment({
            userId, videoId, desc
        })
        await comment.save()

        res.status(200).json({
            success: true,
            msg: "comment added",
            data: comment
        })
    }catch(e){
        res.status(500).json({
            success: false,
            msg: e.message || "internal server error",
            data: null
        })
    }
}

exports.deleteComment = async(req, res)=>{
    try{
        const comment = await Comment.findById(req.params.commentId)

        if(comment.userId !== req.user._id){
            return res.status(400).json({
                sucess: false,
                msg: "you can only delete your comment",
                data: undefined
            })
        }

        await Comment.findByIdAndDelete(req.params.videoId);
        res.status(200).json({
            success: true,
            msg: "comment deleted",
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

exports.getAllComments = async(req, res)=>{
    try{
        const videoId = req.params.videoId
        const comments = await Comment.find({videoId})

        res.status(200).json({
            success: true,
            msg: "fetched all comments",
            data: comments
        })
        
    }catch(e){
        res.status(500).json({
            success: false,
            msg: e.message || "internal server error",
            data: null
        })
    }
}