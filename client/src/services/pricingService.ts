import axios from "axios";
import API_URL from "../config/api";

const API =
  `${API_URL}/pricing`;

const getToken = () =>
  localStorage.getItem("token");

export const getLastPrice =
  async (
    customerId: string,
    productId: string
  ) => {

    const response =
      await axios.get(
        `${API}/last-price`,
        {
          params: {
            customerId,
            productId,
          },

          headers: {
            Authorization:
              `Bearer ${getToken()}`
          }
        }
      );

    return response.data;
  };