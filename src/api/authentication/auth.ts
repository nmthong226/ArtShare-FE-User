import axios from "axios";

// Base URL of your NestJS backend API
const API_BASE_URL = "http://localhost:3000/auth"; // Change this to your backend URL if necessary

// Function to handle user sign up
export const signup = async (email: string | '', password: string, username: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, {
      email,
      password,
      username,
    });
    return response.data;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error; // Handle error accordingly
  }
};

// Function to handle user login (send Firebase token to backend)
export const login = async (token: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      token,
    });
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error; // Handle error accordingly
  }
};

// Function to handle user sign out
export const signout = async (uid: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/signout`, {
      uid,
    });
    return response.data;
  } catch (error) {
    console.error("Error signing out:", error);
    throw error; // Handle error accordingly
  }
};

// Function to verify token (if you want to check token validity)
export const verifyToken = async (token: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/verify-token`, {
      token,
    });
    return response.data;
  } catch (error) {
    console.error("Error verifying token:", error);
    throw error; // Handle error accordingly
  }
};

// Function to handle password reset
export const forgotPassword = async (email: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/forgot-password`, {
      email,
    });
    return response.data;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error; // Handle error accordingly
  }
};