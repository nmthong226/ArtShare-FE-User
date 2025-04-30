import axios from "axios";

export const getCategories = async () => {
  try {
    const response = await axios.get("http://localhost:1337/api/categories", {
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
