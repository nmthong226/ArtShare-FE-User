import axios from "axios";
import qs from "qs";

export const getCategories = async () => {
  try {
    const queryParams = {
      populate: "*",
    }

    const queryString = qs.stringify(queryParams, { addQueryPrefix: true, arrayFormat: 'brackets' }) ?? ''

    const response = await axios.get(`https://artshare-admin.onrender.com/api/categories${queryString}` , {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_CMS_TOKEN}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
