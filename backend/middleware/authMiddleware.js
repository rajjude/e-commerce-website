import jwt from 'jsonwebtoken'

import User from '../models/userModel.js'

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken
        if (!token) return res.status(401).json({ message: 'No token provided' })

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decoded.userId).select('-password')

        if (!user) return res.status(401).json({ message: "User not found" })

        req.user = user

        next()
    } catch (error) {
        console.log("Error in protectRoute", error.message)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const adminRoute = async (req, res, next) => {
    if (req.user && req.user.role === 'admin') next()

    else return res.status(403).json({ message: 'Access denied - Admin Only' })
}