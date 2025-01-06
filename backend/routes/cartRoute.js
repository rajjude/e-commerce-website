import express from 'express'

import { protectRoute } from '../middleware/authMiddleware.js'
import { addToCart, getCartProducts, removeAllFromCart, updateQuantity } from '../controllers/cartController.js'

const router = express.Router()

router.post('/', protectRoute, addToCart)
router.get('/', protectRoute, getCartProducts)
router.delete('/', protectRoute, removeAllFromCart)
router.put('/:id', protectRoute, updateQuantity)

export default router