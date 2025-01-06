import { create } from 'zustand'
import axiosInstance from '../lib/axios.js'
import { toast } from 'react-hot-toast'


const useProductStore = create((set, get) => ({
    products: [],
    loading: false,

    setProducts: (products) => get({ products }),

    createProduct: async (productData) => {
        set({ loading: true })
        try {
            const res = await axiosInstance.post('/products', productData)
            set((prevState) => ({
                products: [...prevState.products, res.data],
                loading: false
            }))
        } catch (error) {
            console.log(error)
            set({ loading: false })
            toast.error(error.response.data.message)
        }
    },
    deleteProduct: async (id) => {
        set({ loading: true })
        try {
            await axiosInstance.delete(`/products/${id}`)
            set((prevProducts => ({
                products: prevProducts.products.filter(product => product._id !== id),
                loading: false
            })))
        } catch (error) {
            set({ loading: false })
            console.log(error)
            toast.error(error.response?.data?.message || "Error in deleting project")
        }

    },
    toggleFeaturedProduct: async (id) => {
        set({ loading: true })
        try {
            const res = await axiosInstance.put(`/products/${id}`)
            set((prevProducts) => ({
                products: prevProducts.products.map((product) =>
                    product._id === id ? { ...product, isFeatured: res.data.isFeatured } : product),
                loading: false
            }))
        }
        catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || 'Error in toggling featured product')
        }
    },
    fetchAllProducts: async () => {
        set({ loading: true })
        try {
            const res = await axiosInstance.get('/products')
            set({ products: res.data.products, loading: false })
        } catch (error) {
            set({ error: "Failed to fetch products", loading: false })
            toast.error(error.response.data.message || 'Error in fetching all products')
            console.log((error))
        }
    },
    fetchProductsByCategory: async (category) => {
        set({ loading: true })
        try {
            const res = await axiosInstance.get(`products/category/${category}`)
            set({ products: res.data.products, loading: false })
        } catch (error) {
            console.log(error)
            set({ loading: false })
            toast.error(error.response?.data?.message || 'Error in fetchProductsByCategory')
        }
    },

    fetchFeaturedProducts: async () => {
        set({ loading: true })
        try {
            const res = await axiosInstance.get('/products/featured')
            set({ products: res.data, loading: false })
        } catch (error) {
            console.log(error)
        }
    }

}))

export default useProductStore