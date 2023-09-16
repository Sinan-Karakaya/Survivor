import axios from "axios";

export const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    headers: {
        'X-Group-Authorization': process.env.EXPO_PUBLIC_GROUP_TOKEN
    }
})

export const backend = axios.create({
    baseURL: process.env.EXPO_PUBLIC_BACKEND_URL,
})