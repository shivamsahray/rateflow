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

export const verifyEmail = async (data: any) => {
    const response = await axios.post(`${API}/verify-email`, data);
    return response.data;
};

export const resendVerification = async (data: any) => {
    const response = await axios.post(`${API}/resend-verification`, data);
    return response.data;
};

export const forgotPassword = async (data: any) => {
    const response = await axios.post(`${API}/forgot-password`, data);
    return response.data;
};

export const verifyResetOTP = async (data: any) => {
    const response = await axios.post(`${API}/verify-reset-otp`, data);
    return response.data;
};

export const resetPassword = async (data: any) => {
    const response = await axios.post(`${API}/reset-password`, data);
    return response.data;
};

export const changePassword = async (data: any, token: string) => {
    const response = await axios.post(`${API}/change-password`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};