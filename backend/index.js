import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import path from 'path'

import authRoutes from './routes/authRoute.js'
import productRoutes from './routes/productRoute.js'
import cartRoutes from './routes/cartRoute.js'
import couponRoutes from './routes/couponRoute.js'
import paymentRoutes from './routes/paymentRoute.js'
import analyticRoutes from './routes/analyticRoute.js'


const app = express()

const __dirname = path.resolve()

//useful middlewares
app.use(cors({
    origin: 'http://localhost:5173', // Allow only your frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
    credentials: true, // Include cookies or authentication headers if needed
}));
app.options('*', cors());
dotenv.config()
app.use(express.json({ limit: '10mb' }))
app.use(cookieParser())

//routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/coupons', couponRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/analytics', analyticRoutes)

//database connection
const MONGO_URI = process.env.MONGO_URI
mongoose.connect(MONGO_URI)
    .then(() => { console.log("Connected to MONGO DB") })
    .catch((error) => { console.log(error) })

//server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => { console.log(`Connected to Port ${PORT}`) })



if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, "/frontend/dist")))

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
    })
}