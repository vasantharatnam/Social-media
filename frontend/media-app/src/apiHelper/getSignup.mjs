import axios from "axios";


const getSignup = async (datai) => {
    let response
    try {
        const REACT_APP_BACKEND_URL = "http://127.0.0.1:8800";
        const backend_url = REACT_APP_BACKEND_URL + "/signup";
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