// importing dependencies
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const videoRoutes = require('./routes/videoRoutes');
const commentRoutes = require('./routes/commentRoutes')
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// middlewares
dotenv.config();
app.use(express.json());
app.use(cors({
    origin: "https://magical-toffee-b7c191.netlify.app",
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true
}));
app.use(cookieParser({
    httpOnly: true
}));

// default route
app.get('/', (req, res)=>{
    res.status(200).json({
        success: true,
        msg: "at home route",
        data: null
    })
})

// setting up router
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/comment', commentRoutes)

// listening the server
app.listen(PORT, ()=>{
    connectDB();
    console.log(`server running at port ${PORT}`);
})