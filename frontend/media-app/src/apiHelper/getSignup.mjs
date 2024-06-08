import axios from "axios";

const REACT_APP_BACKEND_URL = "http://127.0.0.1:8800";

const getSignup = async (datai) => {
    // Replace the 127.0.0.1:3000 with the deployed URL
    let response
    try {
        const backend_url = REACT_APP_BACKEND_URL + "/auth/signup";
        response = await axios.post(backend_url, datai);
        const { status, data } = await response;
        return ({ status: status, message: data.message });
    }
    catch (error) {
        console.error("Login failed:", error.response.data.message);
        return ({ status: 405, message: error.response.data.message });
    }
};

export { getSignup };