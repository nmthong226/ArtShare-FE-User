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
      await sendEmailVerification(user); // Send email verification
      setUser({
        id: user.uid,
        name: user.displayName || "Unknown",
        email: user.email || "Unknown",
      });
      const token = await user.getIdToken();
      setToken(token);
      // Call backend signup API
      const backendResponse = await signup(email, password, username);
      if (backendResponse.success) {
        window.location.href = "/verify-email"; // Redirect user after successful sign-up
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
      if (!user.emailVerified) {
        setError("Please verify your email before proceeding.");
        return;
      }
      const token = await user.getIdToken();
      setUser({
        id: user.uid,
        name: user.displayName || "Unknown",
        email: user.email || "Unknown",
      });
      setToken(token);
      // Call backend login API
      const backendResponse = await login(token);
      if (backendResponse.success) {
        // Successfully logged in and backend verified token
        window.location.href = "/home"; // Redirect to home or dashboard
      } else {
        setError("Error during login. Please try again.");
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  // Google Sign-Up or Login
  const signUpWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
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
          setError("Error with Google login.");
        }
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
