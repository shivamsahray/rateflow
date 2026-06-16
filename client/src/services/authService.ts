import axios from "axios";
import API_URL from "../config/api";

const API = `${API_URL}/auth`;

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