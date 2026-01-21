import { createContext, useState, useEffect } from "react";
import axios from 'axios'
import toast from 'react-hot-toast'
import {io} from 'socket.io-client'

const backendUrl = import.meta.env.VITE_BACKEND_URL
axios.defaults.baseURL = backendUrl

export const AuthContext = createContext()

export const AuthProvider = ({children})=>{

    const [token, setToken] = useState(localStorage.getItem("token"))
    const [authUser, setAuthUser] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])
    const [socket, setSocket] = useState(null)

    // check if user is authenticated and if so, set the user data and connect the socket
    const checkAuth = async () => {
        try {
            const {data} = await axios.get("/api/auth/check", {
                headers: {
                    token: token
                }
            })
            
            if (data.success) { 
                setAuthUser(data.user)
                connectSocket(data.user)
            } else {
                toast.error("Authentication failed")
                setAuthUser(null)
            }
        } catch (error) {
            toast.error(error.message)
            if (error.response?.status === 401) {
               localStorage.removeItem("token");   // 👈 clear bad token
               setAuthUser(null);
            } else {
               toast.error(error.message);
            }
        }
    }

    // login function to handle user auth and socket connection
    const login = async (state, credentials) => {
        try {
            const {data} = await axios.post(`/api/auth/${state}`, credentials)
            if (data.success) { 
                setAuthUser(data.userData)
                connectSocket(data.userData)
                axios.defaults.headers.common["token"] = data.token
                setToken(data.token)
                localStorage.setItem("token", data.token)
                toast.success(data.message)
            } else {
                toast.error(data.message)
                setAuthUser(null)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // logout function to handle user logout and socket disconnection
    const logout = async () => {
        localStorage.removeItem("token")
        setToken(null)
        setAuthUser(null)
        setOnlineUsers([])
        axios.defaults.headers.common["token"] = null
        toast.success("Logged out successfully")
        socket.disconnect()
    }

    // update profile function to handle user profile updates
    const updateProfile = async (body) =>  {
        try {

            let config = {}

            if (body instanceof FormData) {
                config.headers = {
                    'Content-Type': 'multipart/form-data'
                }
            }

            const {data} = await axios.put("/api/auth/update-profile", body, config)
            if (data.success) {
                setAuthUser(data.user)
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Connect user to socket server and track online users
    const connectSocket = (userData) => {
        
        if (!userData || socket) return // skip if no user or socket instance already exists

        // create socket with userId
        const newSocket = io(backendUrl, { query: { userId: userData._id } })
        
        // save socket instance for later use
        setSocket(newSocket)

        // listen for online users updates from server
        newSocket.on("getOnlineUsers", (userIds) => setOnlineUsers(userIds))
    }

    useEffect(()=>{
        if (token) {
            axios.defaults.headers.common["token"] = token;
            checkAuth()
        } else {
            setAuthUser(null)
        }
    },[token])

    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}