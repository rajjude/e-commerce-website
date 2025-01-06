import Product from "../models/productModel.js"
import { redis } from "../lib/redis.js"
import cloudinary from '../lib/cloudinary.js'

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({})
        res.json({ products })
    } catch (error) {
        console.log("Error in getAllProducts controller", error.message)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const getFeaturedProducts = async (req, res) => {
    try {
        const featuredProducts = await Product.find({ isFeatured: true }).lean()
        if (!featuredProducts) return res.status(404).json({ message: "No featured products found" })

        await redis.set('featured_products', JSON.stringify(featuredProducts))
        res.json(featuredProducts)

    } catch (error) {
        console.log("Error in getFeaturedProducts controller", error.message)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, image, category } = req.body

        let cloudinaryResponse = null

        if (image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: 'products' })
        }

        const product = new Product({
            name,
            description,
            price,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : '',
            category
        })

        await product.save()

        res.status(201).json(product)
    } catch (error) {
        console.log("Error in create Product controller", error)
        return res.status(500).json({ message: 'Internal Server Error' })

    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findById(id)
        if (!product) return res.status(404).json({ message: 'Product not found' })

        if (product.image) {
            const publicId = product.image.split('/').pop().split('.')[0] //this will get id of the image in cloudinary
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`)
            }
            catch (error) {
                console.log("Error deleting image from cloudinary", error.message)
            }
        }

        await Product.findByIdAndDelete(id)

        res.json({ message: 'Product deleted successfully.' })
    } catch (error) {
        console.log("Error in delete product controller", error.message)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export const getRecommendedProdcuts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            {
                $sample: { size: 3 }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    image: 1,
                    price: 1
                }
            }
        ])

        res.json(products)
    } catch (error) {
        console.log("Error in getRecommende controller", error.message)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params
        const products = await Product.find({ category })
        res.json({ products })
    } catch (error) {
        console.log(("Error in getProductsByCategory controller", error.message))
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const toggleFeaturedProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (product) {
            product.isFeatured = !product.isFeatured
            const updatedProduct = await product.save()
            await updateFeaturedProductsCache()
            res.json(updatedProduct)
        } else {
            return res.status(400).json({ message: "Product not found" })
        }
    } catch (error) {
        console.log("Error in toggleFeaturedProduct controller", error.message)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

async function updateFeaturedProductsCache() {
    try {
        const featuredProducts = await Product.find({ isFeatured: true }).lean()
        await redis.set('featured_products', JSON.stringify(featuredProducts))

    } catch (error) {
        console.log("Error in update cache function")
    }
}