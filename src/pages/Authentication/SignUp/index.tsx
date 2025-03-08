import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import InstagramIcon from "/auth_logo_instagram.svg";
import { FaApple } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { auth } from "@/firebase"; // Import firebase authentication
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
} from "firebase/auth";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null); // For handling error messages
  const navigate = useNavigate(); // To navigate to the home page on successful sign-up

  // Handle Sign-up with email/password
  const handleEmailSignUp = async (e: any) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("User created successfully");
      // Redirect to home after successful sign-up
      navigate("/home");
    } catch (error: any) {
      setError(error.message); // Capture the error message
      console.error("Error signing up with email:", error.message);
    }
  };

  // Handle Google sign-up
  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      console.log("User signed up with Google");
      // Redirect to home after successful sign-up
      navigate("/home");
    } catch (error: any) {
      setError(error.message); // Capture the error message
      console.error("Error signing up with Google:", error.message);
    }
  };

  // Handle Facebook sign-up
  const handleFacebookSignUp = async () => {
    const provider = new FacebookAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      console.log("User signed up with Facebook");
      // Redirect to home after successful sign-up
      navigate("/home");
    } catch (error: any) {
      setError(error.message); // Capture the error message
      console.error("Error signing up with Facebook:", error.message);
    }
  };

  return (
    <div className="flex-1 space-y-4 px-20 py-8">
      <div className="flex flex-col space-x-3">
        <h1 className="font-bold text-gray-800 text-3xl leading-6">Join us!</h1>
        <p className="mt-2 font-bold text-gray-600 text-3xl">
          Create an ArtShare account
        </p>
        <p className="mt-4 text-gray-500">
          Join a thriving community to create, share and celebrate art.
        </p>
      </div>
      <div className="flex flex-col justify-between space-x-4 space-y-4 mt-4">
        <div className="flex w-full">
          <Button
            variant={"outline"}
            onClick={handleGoogleSignUp}
            className="flex justify-center items-center px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 w-full h-10 font-normal text-sm"
          >
            <FcGoogle className="mr-2 size-5" />
            <span>Continue with Google</span>
          </Button>
        </div>
        <div className="flex justify-between w-full">
          <Button
            variant={"outline"}
            onClick={handleFacebookSignUp}
            className="flex justify-center items-center px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 w-[32%] h-10 font-normal text-sm"
          >
            <FaFacebookF className="mr-2 size-5 text-blue-700" />
            <span>Facebook</span>
          </Button>
          <Button
            variant={"outline"}
            className="flex justify-center items-center px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 w-[32%] h-10 font-normal text-sm"
          >
            <img src={InstagramIcon} alt="Instagram" className="mr-2 size-5" />
            <span>Instagram</span>
          </Button>
          <Button
            variant={"outline"}
            className="flex justify-center items-center px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 w-[32%] h-10 font-normal text-sm"
          >
            <FaApple className="mr-2 size-5" />
            <span>Apple</span>
          </Button>
        </div>
      </div>
      <div className="flex items-center space-x-4 mt-6 text-center">
        <hr className="border-gray-900 border-t-1 w-full" />
        <div className="text-gray-600 text-sm">Or</div>
        <hr className="border-gray-900 border-t-1 w-full" />
      </div>
      <form onSubmit={handleEmailSignUp} className="space-y-4">
        <div>
          <label
            htmlFor="username"
            className="block font-semibold text-gray-600 text-sm"
          >
            Username or Email
          </label>
          <Input
            type="text"
            placeholder="Enter your username or email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow-sm mt-1 p-3 border border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-10"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block font-medium text-gray-600 text-sm"
          >
            Password
          </label>
          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow-sm mt-1 p-3 border border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-10"
          />
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}{" "}
        {/* Display error message */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-gray-600 text-sm">
            Your password must be at least 8 characters, numbers and symbols.
          </span>
        </div>
        <Button
          type="submit"
          className="bg-gray-800 hover:bg-gray-700 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-10 font-bold text-white"
        >
          Signup with email
        </Button>
      </form>
      <div className="mt-6 text-left">
        <p className="text-gray-600 text-sm">
          Already have an account?
          <Link to="/login" className="ml-2 text-blue-600">
            Login
          </Link>
        </p>
      </div>
      <div className="mt-4 text-gray-500 text-xs text-left">
        <p>
          By signing up to ArtShare, I confirm that I have read and agree to the
          ArtShare{" "}
          <a href="#" className="text-blue-600">
            Terms of Service
          </a>
          ,{" "}
          <a href="#" className="text-blue-600">
            Privacy Policy
          </a>
          , and to receive emails and updates.
        </p>
      </div>
    </div>
  );
};

export default SignUp;
