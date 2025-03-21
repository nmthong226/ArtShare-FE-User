import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import InstagramIcon from "/auth_logo_instagram.svg";
import { FaApple } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserProvider"; // Import the UserProvider hook

const SignUp = () => {
  const { signUpWithEmail, signUpWithGoogle, signUpWithFacebook, setError } =
    useUser(); // Use UserProvider context
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate(); // To navigate after signup

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUpWithEmail(email, password, username); // Call the signUpWithEmail function from UserProvider
      navigate("/verify-email"); // Redirect to email verification page
    } catch (error: any) {
      setError(error.message); // Handle any errors during signup
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signUpWithGoogle(); // Call Google login function from UserProvider
      navigate("/home"); // Redirect after successful login
    } catch (error: any) {
      setError(error.message); // Handle errors from Google login
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await signUpWithFacebook(); // Call Facebook login function from UserProvider
      navigate("/home"); // Redirect after successful login
    } catch (error: any) {
      setError(error.message); // Handle errors from Facebook login
    }
  };

  return (
    <div className="flex-1 space-y-4 px-10 md:px-0 lg:px-20 py-8">
      <div className="flex flex-col space-x-3">
        <h1 className="font-bold text-mountain-800 dark:text-mountain-50 text-2xl xl:text-3xl leading-6">
          Join us!
        </h1>
        <p className="mt-2 font-bold text-mountain-600 dark:text-mountain-300 text-xl lg:text-2xl xl:text-3xl text-nowrap">
          Create an ArtShare account
        </p>
        <p className="mt-4 text-mountain-500 dark:text-mountain-300 text-xs xl:text-sm">
          Join a vibrant community where you can create, share, and celebrate
          art.
        </p>
      </div>
      <div className="flex flex-col justify-between space-x-4 space-y-4 mt-4">
        {/* Google Login */}
        <div className="flex w-full">
          <Button
            variant={"outline"}
            className="flex justify-center items-center hover:brightness-115 px-4 py-3 border border-mountain-950 dark:border-mountain-700 rounded-lg focus:outline-none focus:ring-2 w-full h-10 font-normal text-sm hover:cursor-pointer"
            onClick={handleGoogleLogin}
          >
            <FcGoogle className="size-5" />
            <span>Continue with Google</span>
          </Button>
        </div>

        {/* Facebook, Instagram, Apple Login */}
        <div className="flex justify-between w-full">
          <Button
            variant={"outline"}
            className="flex justify-center items-center hover:brightness-115 px-4 py-3 border border-mountain-950 dark:border-mountain-700 rounded-lg focus:outline-none focus:ring-2 w-[32%] h-10 font-normal text-sm hover:cursor-pointer"
            onClick={handleFacebookLogin}
          >
            <FaFacebookF className="size-5 text-blue-700" />
            <span>Facebook</span>
          </Button>
          <Button
            variant={"outline"}
            className="flex justify-center items-center hover:brightness-115 px-4 py-3 border border-mountain-950 dark:border-mountain-700 rounded-lg focus:outline-none focus:ring-2 w-[32%] h-10 font-normal text-sm hover:cursor-pointer"
          >
            <img src={InstagramIcon} alt="Instagram" className="size-5" />
            <span>Instagram</span>
          </Button>
          <Button
            variant={"outline"}
            className="flex justify-center items-center hover:brightness-115 px-4 py-3 border border-mountain-950 dark:border-mountain-700 rounded-lg focus:outline-none focus:ring-2 w-[32%] h-10 font-normal text-sm hover:cursor-pointer"
          >
            <FaApple className="size-5" />
            <span>Apple</span>
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4 mt-6 text-center">
        <hr className="border-mountain-900 border-t-1 w-full" />
        <div className="text-mountain-600 text-sm">Or</div>
        <hr className="border-mountain-900 border-t-1 w-full" />
      </div>

      {/* Sign-up Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="username"
            className="block font-semibold text-mountain-600 dark:text-mountain-50 text-sm"
          >
            Username
          </label>
          <Input
            type="text"
            placeholder="Enter your username"
            className="dark:bg-mountain-900 shadow-sm mt-1 p-3 border border-mountain-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-10"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block font-semibold text-mountain-600 dark:text-mountain-50 text-sm"
          >
            Email
          </label>
          <Input
            type="email"
            placeholder="Enter your email"
            className="dark:bg-mountain-900 shadow-sm mt-1 p-3 border border-mountain-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-10"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block font-medium text-mountain-600 dark:text-mountain-50 text-sm"
          >
            Password
          </label>
          <Input
            type="password"
            placeholder="Enter your password"
            className="dark:bg-mountain-900 shadow-sm mt-1 p-3 border border-mountain-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex justify-between items-center mt-4">
          <span className="text-mountain-500 text-xs xl:text-sm">
            Your password must be at least 8 characters, numbers, and symbols.
          </span>
        </div>

        <Button
          type="submit"
          className="bg-mountain-800 hover:bg-mountain-700 dark:bg-gradient-to-r dark:from-blue-800 dark:via-purple-700 dark:to-pink-900 hover:brightness-110 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full h-10 font-bold text-white dark:text-mountain-50 hover:cursor-pointer"
        >
          Sign Up with Email
        </Button>
      </form>

      <div className="mt-6 text-left">
        <p className="text-mountain-600 dark:text-mountain-100 text-xs xl:text-sm">
          Already have an account?
          <Link
            to="/login"
            className="ml-2 text-indigo-600 dark:text-indigo-300"
          >
            Login
          </Link>
        </p>
      </div>

      <div className="mt-4 text-[10px] text-mountain-500 dark:text-mountain-300 xl:text-xs lg:text-left text-center">
        <p>
          By signing up for ArtShare, I confirm that I have read and agree to
          the ArtShare{" "}
          <a href="#" className="text-indigo-600 dark:text-indigo-300">
            Terms of Service
          </a>{" "}
          -{" "}
          <a href="#" className="text-indigo-600 dark:text-indigo-300">
            Privacy Policy
          </a>{" "}
          regarding data usage.
        </p>
      </div>
    </div>
  );
};

export default SignUp;
