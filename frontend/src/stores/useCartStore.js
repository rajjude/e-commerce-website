import { create } from "zustand";
import axiosInstanse from "../lib/axios";
import { toast } from "react-hot-toast";
import { updateQuantity } from "../../../backend/controllers/cartController";

export const useCartStore = create((set, get) => ({
    cart: [],
    coupon: null,
    total: 0,
    subtotal: 0,
    isCouponApplied: false,

    getCartItems: async () => {
        try {
            const res = await axiosInstanse.get('/cart')
            set({ cart: res.data.cartItems })
            get().calculateTotals()
        } catch (error) {
            set({ cart: [] })
            console.log(error)
            toast.error(error.response?.data?.message || 'Error in getCartItemes')
        }
    },
    addToCart: async (product) => {
        try {
            const res = await axiosInstanse.post("/cart/", { productId: product._id })
            set((prevState) => {
                const existingItem = prevState.cart.find((item) => item?._id === product._id)
                const newCart = existingItem ? prevState.cart.map((item) => { item?._id === product._id ? { ...item, quantity: item.quantity + 1 } : item }) :
                    [...prevState.cart, { ...product, quantity: 1 }]

                return { cart: newCart }
            })

            get().calculateTotals()
            toast.success('Added to cart')
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || 'Error in add to cart')
        }
    },
    calculateTotals: () => {
        const { cart, coupon } = get()
        const subtotal = cart.reduce((sum, item) => sum + item?.price * item?.quantity, 0)
        let total = subtotal

        if (coupon) {
            const discount = subtotal * (coupon.discountPercentage / 100)
            total = subtotal - discount
        }

        set({ subtotal, total })
    },
    removeFromCart: async (productId) => {
        await axiosInstanse.delete("/cart", { productId: productId })
        set(prevState => ({ cart: prevState.cart.filter((item) => item._id !== productId) }))
        get().calculateTotals()
    },
    updateQuantity: async (productId, quantity) => {
        if (quantity === 0) {
            get().removeFromCart(productId);
            return;
        }

        await axiosInstanse.put(`/cart/${productId}`, { quantity });
        set((prevState) => ({
            cart: prevState.cart.map((item) => (item._id === productId ? { ...item, quantity } : item)),
        }));
        get().calculateTotals();
    },

    getMyCoupon: async () => {
        try {
            const res = await axiosInstanse.get('/coupons')
            set({ coupon: res.data })
        } catch (error) {
            console.log("Error fetching coupon", error)
        }
    },

    applyCoupon: async (code) => {
        try {
            const res = await axiosInstanse.post('/coupons/validate', { code })
            set({ coupon: res.data, isCouponApplied: true })
            get().calculateTotals()
            toast.success('Coupon applied successfully!')
        } catch (error) {
            console.log("Error in applying coupon ", error)
        }
    },

    removeCoupon: () => {
        set({ coupon: null, isCouponApplied: false })
        get().calculateTotals()
        toast.success('Coupon removed')
    },
    clearCart: async () => {
        set({ cart: [], coupon: null, total: 0, subtotal: 0 });

    }
}))
