import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendPasswordResetEmail } from "firebase/auth"; // Import the Firebase method for sending password reset email
import { auth } from "@/firebase"; // Firebase auth instance

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null); // To display success/error messages
  const [loading, setLoading] = useState(false); // For loading state during API call
  const [error, setError] = useState<string | null>(null); // For storing error message

  // Handle form submission for password reset
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(
        "Password reset email sent successfully! Please check your inbox."
      );
      setError(null); // Clear any previous error messages
    } catch (error: any) {
      setMessage(null); // Clear any success message if an error occurs
      setError(error.message); // Handle Firebase error (invalid email, etc.)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 px-10 md:px-0 lg:px-10 xl:px-20 py-8">
      <div className="flex flex-col space-x-3">
        <h1 className="font-bold text-mountain-800 dark:text-mountain-50 text-2xl xl:text-3xl leading-6">
          Account Recovery
        </h1>
        <p className="mt-4 text-mountain-500 dark:text-mountain-300 text-xs xl:text-sm">
          Return your account by email
        </p>
      </div>
      <div className="space-y-4">
        {/* Step 1: Enter Email */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block font-semibold text-mountain-600 dark:text-mountain-50 text-sm"
          >
            Step 1: Enter Your Email
          </label>
          <Input
            placeholder="Input Your Email"
            id="email"
            className="dark:bg-mountain-900 shadow-sm mt-1 p-3 border border-mountain-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-10"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type="submit"
            className="bg-mountain-800 hover:bg-mountain-700 disabled:bg-mountain-800 dark:bg-gradient-to-r dark:from-blue-800 dark:via-purple-700 dark:to-pink-900 hover:brightness-110 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full h-10 font-bold text-white dark:text-mountain-50 hover:cursor-pointer"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send My Verification Code"}
          </Button>
        </div>

        {/* Error or success message */}
        {error && (
          <p className="text-red-600 dark:text-red-400 text-sm mt-4">{error}</p>
        )}
        {message && (
          <p className="text-green-600 dark:text-green-400 text-sm mt-4">
            {message}
          </p>
        )}

        {/* OTP Step (for later implementation) */}
        <hr className="border-0.5 border-mountain-200 dark:border-mountain-700 w-full" />
        <div className="space-y-2">
          <label
            htmlFor="otp"
            className="block font-semibold text-mountain-600 dark:text-mountain-50 text-sm"
          >
            Step 2: Input The OTP
          </label>
          <div className="flex justify-between mt-1 w-full">
            {/* You can implement OTP component here */}
          </div>
        </div>

        {/* New Password Step */}
        <hr className="border-0.5 border-mountain-200 dark:border-mountain-700 w-full" />
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block font-semibold text-mountain-600 dark:text-mountain-50 text-sm"
          >
            Step 3: Choose New Password
          </label>
          <Input
            placeholder="Input Your New Password"
            id="password"
            className="dark:bg-mountain-900 shadow-sm mt-1 p-3 border border-mountain-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-10"
            disabled
          />
          <p className="text-muted-foreground text-xs lg:text-sm">
            Min 6 characters, numbers & letters
          </p>
          <Button
            disabled
            type="submit"
            className="bg-mountain-800 hover:bg-mountain-700 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-10 font-bold text-white"
          >
            Recover My Account
          </Button>
        </div>

        <p className="text-indigo-600 dark:text-indigo-300 text-sm">
          If you need any help, don't hesitate to go to the
          <span className="ml-1 font-bold">Help Center</span>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
