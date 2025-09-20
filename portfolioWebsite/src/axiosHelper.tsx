import axios from "axios"

const axiosHelper = axios.create({
    baseURL: "https://liamportfolioweb.onrender.com/api/v1",     // backend url
    // baseURL: "https://localhost:8080/api/v1",                       // dev bacakend
    headers: {
        "Content-Type": "application/json"                          // headers for rest, asking for json
    },                                                          
    timeout: 5000,                                                  // timeout for caching
})

// if auth token, use it
axiosHelper.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default axiosHelper
