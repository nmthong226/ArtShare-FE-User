import { create } from 'zustand';
import { auth } from '@/firebase';  // Assuming Firebase auth is set up
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  sendEmailVerification,
} from 'firebase/auth';
import { login, signup } from '@/api/authentication/auth'; // Import API calls for backend

interface AuthState {
  user: any | null;
  error: string | null;
  token: string | null; // Added token to the state
  setUser: (user: any) => void;
  clearUser: () => void;
  setError: (error: string) => void;
  setToken: (token: string) => void; // Set token in the state
  signUpWithEmail: (email: string, password: string) => void;
  loginWithEmail: (email: string, password: string) => void;
  logout: () => void;
  signUpWithGoogle: () => void;
  loginWithGoogle: () => void;  // Added loginWithGoogle for login functionality
  signUpWithFacebook: () => void;
  loginWithFacebook: () => void; // Added loginWithFacebook for login functionality
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,  // Store the token
  error: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null, token: null }),  // Clear user and token
  setError: (error) => set({ error }),
  setToken: (token) => set({ token }),  // Set the token

  // Sign Up with Email
  signUpWithEmail: async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Send email verification
      await sendEmailVerification(user);
      set({ user });
      // Redirect user to the verify email page
      window.location.href = '/verify-email'; // Redirect to /verify-email after successful sign-up
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  // Login with Email
  loginWithEmail: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if the user's email is verified
      if (!user.emailVerified) {
        set({ error: "Please verify your email before proceeding." });
        return;
      }

      const token = await user.getIdToken();
      set({ user, token });  // Set both user and token in the state
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  // Google Sign-Up (for users not existing in the backend)
  signUpWithGoogle: async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      const token = await user.getIdToken();  // Get Firebase token
      set({ user, token });

      // Optionally send the token to the backend to check if the user exists
      const response = await login(token);

      if (response.uid) {
        // If user exists, proceed to home
        set({ user });
      } else {
        // If user doesn't exist, sign them up
        const signupResponse = await signup(user.email!, "", user.displayName || "");
        console.log("User registered in backend:", signupResponse);
        set({ user });
      }
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  // Google Login (Check if the user exists or not)
  loginWithGoogle: async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      const token = await user.getIdToken();  // Get Firebase token

      // Send the Firebase token to the backend for verification
      const response = await login(token);

      if (response.uid) {
        // If user exists, proceed to home
        set({ user });
      } else {
        // If user doesn't exist, sign them up
        const signupResponse = await signup(user.email!, "", user.displayName || "");
        console.log("User registered in backend:", signupResponse);
        set({ user });
      }
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  // Facebook Sign-Up (for users not existing in the backend)
  signUpWithFacebook: async () => {
    const provider = new FacebookAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      const token = await user.getIdToken();  // Get Firebase token
      set({ user, token });

      // Optionally send the token to the backend to check if the user exists
      const response = await login(token);

      if (response.uid) {
        // If user exists, proceed to home
        set({ user });
      } else {
        // If user doesn't exist, sign them up
        const signupResponse = await signup(user.email!, "", user.displayName || "");
        console.log("User registered in backend:", signupResponse);
        set({ user });
      }
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  // Facebook Login (Check if the user exists or not)
  loginWithFacebook: async () => {
    const provider = new FacebookAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      const token = await user.getIdToken();  // Get Firebase token

      // Send the Firebase token to the backend for verification
      const response = await login(token);

      if (response.uid) {
        // If user exists, proceed to home
        set({ user });
      } else {
        // If user doesn't exist, sign them up
        const signupResponse = await signup(user.email!, "", user.displayName || "");
        console.log("User registered in backend:", signupResponse);
        set({ user });
      }
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  // Sign Out
  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null, token: null });
    } catch (error: any) {
      set({ error: error.message });
    }
  },
}));