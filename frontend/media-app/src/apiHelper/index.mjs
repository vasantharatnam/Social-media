import axios from 'axios';
import dotenv from 'dotenv';
// import { v2 as cloudinary } from 'cloudinary';
import { SetPosts } from "../redux/postSlice";

const API_URL = import.meta.env.VITE_APP_BACKEND_URL;
// const API_URL = "http://localhost:8800";
// dotenv.config();
// const CLOUDINARY_NAME = "dzpr1bfbm";
const CLOUDINARY_NAME = import.meta.env.VITE_APP_CLOUDINARY_NAME;
// const CLOUDINARY_KEY = process.env.REACT_APP_CLOUDINARY_URL;
// const CLOUDINARY_SEC = process.env.REACT_APP_CLOUDINARY_URL;


// cloudinary.config({
//     cloud_name: CLOUDINARY_NAME,
//     api_key: CLOUDINARY_KEY,
//     api_secret: CLOUDINARY_SEC
// });

const API = axios.create({
    baseURL: API_URL,
    responseType: "json"
});

const apiRequest = async ({ url, token, data, method }) => {
    try {
        const result = await API(url, {
            method: method || "GET",
            data: data,
            headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : "",
            },
        });
        return { status: result?.status, message: result?.data };
        // return result?.data;
    } catch (error) {
        const err = error.response.data;
        console.log(err);
        return { status: error.response.status, message: err.message };
    }
}

const handleFileUpload = async (uploadFile) => {
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("upload_preset", "socialmedia");

    try {
        const response = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/image/upload`, formData);
        console.log(response, "index.mjs");
        return response.data.secure_url;
    } catch (error) {
        console.log(error);
    }
};

const fetchPosts = async (token, dispatch, uri, data) => {
    try {
        const res = await apiRequest({
            url: uri || '/posts',
            token: token,
            method: "POST",
            data: data || {},
        });

        console.log(res);

        dispatch(SetPosts(res?.message?.data));
        return;
    } catch (error) {
        console.log(error);
    }
}

const likePost = async ({ uri, token }) => {
    try {
        const res = await apiRequest({
            url: uri,
            token: token,
            method: "POST",
        });

        return res;
    } catch (error) {
        console.log(error);
    }
}

const deletePost = async (id, token) => {
    try {
        const res = await apiRequest({
            url: "/posts/" + id,
            token: token,
            method: "DELETE",
        });
        return;
    } catch (error) {
        console.log(error);
    }
}

const getUserInfo = async (token, id) => {
    try {
        const uri = id === undefined ? "/users/get-user" : "/users/get-user/" + id;

        const res = await apiRequest({
            url: uri,
            token: token,
            method: "POST",
        })

        if (res?.message === "Authentication failed") {
            localStorage.removeItem("user");
            window.alert("User session expired. Login again");
            window.location.replace("/login");
        }
        // console.log(res, "get user info");
        return res?.message?.user;

    } catch (error) {
        console.log(error);
    }
}

const sendFriendRequest = async (token, id) => {
    try {
        const res = await apiRequest({
            url: "/users/friend-request/",
            token: token,
            method: "POST",
            data: { requestTo: id },
        })

        return res;
    } catch (error) {
        console.log(error);
    }
}

const viewUserProfile = async (token, id) => {
    try {
        const res = await apiRequest({
            url: "/users/profile-view",
            token: token,
            method: "POST",
            data: { id },
        });

        return;
    } catch (error) {
        console.log(error);
    }
}

export { API, apiRequest, handleFileUpload, fetchPosts, likePost, deletePost, getUserInfo, sendFriendRequest, viewUserProfile };
// export { API, apiRequest };