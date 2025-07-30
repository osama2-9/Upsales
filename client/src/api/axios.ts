import axios from "axios";
const axiosInstance = axios.create({
    baseURL: "https://upsales-api.vercel.app/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,

});
export { axiosInstance };
