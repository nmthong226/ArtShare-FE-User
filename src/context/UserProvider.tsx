import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { auth } from "@/firebase"; // Import Firebase auth
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  sendEmailVerification,
} from "firebase/auth";
import { login, signup } from "@/api/authentication/auth"; // Import your backend login and signup functions
import { useNavigate } from "react-router-dom";

// Sample User Interface
interface User {
  id: string;
  name: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  token: string | null;
  error: string | null;
  loginWithEmail: (email: string, password: string) => void;
  signUpWithEmail: (email: string, password: string, username: string) => void;
  logout: () => void;
  signUpWithGoogle: () => void;
  loginWithGoogle: () => void;
  signUpWithFacebook: () => void;
  loginWithFacebook: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setError: (error: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        const userData: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || "Unknown",
          email: firebaseUser.email || "Unknown",
        };
        setUser(userData);
        firebaseUser.getIdToken().then((idToken) => {
          setToken(idToken);
        });
      } else {
        setUser(null);
        setToken(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Signup with Email and Password
  const signUpWithEmail = async (
    email: string,
    password: string,
    username: string
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log(user);
      await sendEmailVerification(user); // Send email verification
      setUser({
        id: user.uid,
        name: user.displayName || "User" + user.uid.slice(0, 5),
        email: user.email || "Unknown",
      });
      const token = await user.getIdToken();

      setToken(token);
      // Call backend signup API
      const backendResponse = await signup(email, password, username);
      return token;
      if (backendResponse.success) {
        window.location.href = "/activate-account"; // Redirect user after successful sign-up
      } else {
        setError("Error during registration. Please try again.");
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  // Login with Email and Password
  const loginWithEmail = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log(user);
      // Check if the email is verified
      if (!user?.emailVerified) {
        setError("Please verify your email before logging in.");
        return; // Prevent further execution, stay on the login page
      }

      // If email is verified, get the token
      const token = await user.getIdToken();
      setUser({
        id: user.uid,
        name: user.displayName || "Unknown",
        email: user.email || "Unknown",
      });
      setToken(token);

      // Call backend login API with the token
      const backendResponse = await login(token);
      if (backendResponse.success) {
      } else {
        setError("Error during login. Please try again.");
      }
    } catch (error: any) {
      // Handle errors from Firebase
      if (error.code === "auth/user-not-found") {
        setError("No user found with this email address.");
      } else if (error.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else {
        setError("An error occurred during login. Please try again.");
      }
    }
  };
  // Google Sign-Up or Login
  const signUpWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      // call api to check if not exist by email, create user with email
      // signup nestjs
      const user = userCredential.user;
      const signupResponse = await signup(
        user.email!,
        "",
        user.displayName || ""
      );
      console.log("signupResopnse: ", signupResponse);
      const token = await user.getIdToken();
      let loginResponse = null;
      if (signupResponse.success) {
        loginResponse = await login(token);
      }
      setUser({
        id: user.uid,
        name: user.displayName || "Unknown",
        email: user.email || "Unknown",
      });
      setToken(token);
      console.log("token from google: ", token);
      // Call backend login API after Firebase authentication
      if (loginResponse && loginResponse.success) {
        window.location.href = "/home"; // Redirect to home
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  // Facebook Sign-Up or Login
  const signUpWithFacebook = async () => {
    const provider = new FacebookAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      const token = await user.getIdToken();
      setUser({
        id: user.uid,
        name: user.displayName || "Unknown",
        email: user.email || "Unknown",
      });
      setToken(token);
      // Call backend login API after Firebase authentication
      const backendResponse = await login(token);
      if (backendResponse.success) {
        window.location.href = "/home"; // Redirect to home
      } else {
        // Handle new user registration
        const signupResponse = await signup(
          user.email!,
          "",
          user.displayName || ""
        );
        if (signupResponse.success) {
          window.location.href = "/home"; // Redirect to home after registration
        } else {
          setError("Error with Facebook login.");
        }
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setToken(null);
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        error,
        loginWithEmail,
        signUpWithEmail,
        logout,
        signUpWithGoogle,
        loginWithGoogle: signUpWithGoogle, // Reusing the same function for Google login
        signUpWithFacebook,
        loginWithFacebook: signUpWithFacebook, // Reusing the same function for Facebook login
        setUser,
        setToken,
        setError,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
