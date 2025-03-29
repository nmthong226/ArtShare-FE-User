import api from "@/api/baseApi";

const createPost = async (formData: FormData) => {
  // Sending POST request
  try {
    const response = await api.post("/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Response:", response.data);
  } catch (error) {
    console.error("Error:", error);
  }
};
