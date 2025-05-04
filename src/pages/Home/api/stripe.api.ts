import api from "@/api/baseApi";
import axios from "axios";

export interface CreateCheckoutSessionPayload {
  priceId: string;
  email?: string;
  userId?: string;
}

export interface CreateCheckoutSessionResponse {
  url: string;
}

export const createCheckoutSession = async (
  payload?: CreateCheckoutSessionPayload,
): Promise<CreateCheckoutSessionResponse> => {
  const endpoint = `/api/stripe/create-checkout-session`;
  try {
    const response = await api.post<CreateCheckoutSessionResponse>(
      endpoint,
      payload,
    );
    if (!response.data?.url) {
      throw new Error("Received invalid session data from server.");
    }
    return response.data;
  } catch (error) {
    console.error(`API Error calling ${endpoint}:`, error);
    let errorMessage = "Could not initiate checkout.";
    if (axios.isAxiosError(error)) {
      errorMessage =
        error.response?.data?.message || error.message || errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
};
