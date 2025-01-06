import { create } from 'zustand'
import { toast } from 'react-hot-toast'
import axiosInstanse from '../lib/axios.js'



export const useUserStore = create((set, get) => ({
    user: null,
    loading: null,
    checkingAuth: true,

    signup: async ({ name, email, password, confirmPassword, gender }) => {
        set({ loading: true })

        if (password !== confirmPassword) {
            set({ loading: false })
            return toast.error("Passwords don not match")
        }

        try {
            const res = await axiosInstanse.post('/auth/signup', { name, email, password, gender }, { withCredentials: true })
            set({ user: res.data, loading: false })
        } catch (error) {
            set({ loading: false })
            console.log(error)
            toast.error(error.response?.data?.message || "An error occurred !")
        }
    },
    login: async (email, password) => {
        set({ loading: true })
        try {
            const res = await axiosInstanse.post('/auth/login', { email, password })
            set({ user: res.data, loading: false })
        } catch (error) {
            set({ loading: false })
            console.log(error)
            toast.error(error.response?.data?.message || "An error occurred !")
        }
    },
    checkAuth: async () => {
        set({ checkingAuth: true })
        try {
            const response = await axiosInstanse.get('/auth/profile', { withCredentials: true })
            set({ user: response.data, checkingAuth: false })
        } catch (error) {
            set({ checkingAuth: false, user: null })
        }
    },
    logout: async () => {
        try {
            await axiosInstanse.post('/auth/logout')
            set({ user: null })

        } catch (error) {
            toast.error(error.response?.data?.message || "An error occured during logout ")
        }
    },

}))
