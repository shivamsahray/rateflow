import axios from "axios";

const API = "http://localhost:5000/api/auth";

export const registerUser = async (data: any) => {
    const response = await axios.post(
        `${API}/register`,
        data
    );

    return response.data;
};

export const loginUser = async(data: any) => {
    const response = await axios.post(
        `${API}/login`,
        data
    );

    return response.data;
}