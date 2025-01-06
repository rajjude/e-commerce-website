import axios from 'axios'

const axiosInstanse = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true
})

export default axiosInstanse