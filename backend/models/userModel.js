import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, "Email is required."],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: [6, "Password must be atlest 6 characters."]
    },
    cartItems: [{
        quantity: {
            type: Number,
            default: 1
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'

        }
    }],
    role: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer'
    },
    profile: {
        type: String,
        default: 'https://avatar.iran.liara.run/public/'
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    }

}, { timestamps: true })

const User = mongoose.model('User', userSchema)

export default User