const mongoose = require('mongoose');

const watchListSchema = new mongoose.Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        videoId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video",
            required: true
        },
        createdAt: {
            type: Date,
            default: new Date(Date.now())
        }
})

const WatchList = mongoose.model('WatchList', watchListSchema);

module.exports = WatchList;