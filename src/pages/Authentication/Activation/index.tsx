import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth } from "@/firebase"; // Import Firebase auth
import { sendEmailVerification } from "firebase/auth"; // Import Firebase method for sending verification email

const AccountActivation = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Redirect to home after successful email verification
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 3000); // Redirect after 3 seconds
      return () => clearTimeout(timer); // Cleanup timeout
    }
  }, [success, navigate]);

  const handleVerifyEmail = async () => {
    const user = auth.currentUser;

    if (user) {
      try {
        // Send the verification email
        await sendEmailVerification(user);
        setSuccess(true); // Mark the verification as successful
        setError(null); // Clear any previous errors
      } catch (error: any) {
        setError("Failed to send verification email. Please try again later.");
        setSuccess(false); // Mark as failure if error occurs
      }
    } else {
      setError("No user is logged in.");
    }
  };

  // Display success message after email verification
  if (success) {
    return (
      <div className="flex justify-center items-center min-h-screen font-bold text-green-600 text-lg">
        ✅ Email successfully sent! Please check your inbox.
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 px-10 md:px-0 lg:px-10 xl:px-20 py-8">
      <div className="flex flex-col space-x-3">
        <h1 className="font-bold text-mountain-800 dark:text-mountain-50 text-2xl xl:text-3xl leading-6">
          Email Verification
        </h1>
        <p className="mt-4 text-mountain-500 dark:text-mountain-300 text-xs xl:text-sm">
          Thank you for registering with Art Share!
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="username"
            className="block font-semibold text-mountain-600 dark:text-mountain-50 text-sm"
          >
            Your Email Is:
          </label>
          <Input
            value={auth.currentUser?.email || "No email"}
            className="dark:bg-mountain-900 shadow-sm mt-1 p-3 border border-mountain-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-10 disabled:font-bold disabled:text-mountain-950 dark:disabled:text-mountain-100"
            disabled
          />
          <p className="text-mountain-500 dark:text-mountain-300 text-xs lg:text-sm">
            In order to start using Art Share, you need to confirm your email
            address by clicking the button below.
          </p>
          <Button
            onClick={handleVerifyEmail}
            type="button"
            className="bg-mountain-800 hover:bg-mountain-700 dark:bg-gradient-to-r dark:from-blue-800 dark:via-purple-700 dark:to-pink-900 hover:brightness-110 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full h-10 font-bold text-white dark:text-mountain-50 hover:cursor-pointer"
          >
            <a href="https://mail.google.com/mail/" target="_blank">Verify My Email</a>
          </Button>
        </div>

        {/* Error message */}
        {error && (
          <p className="mt-4 text-red-600 dark:text-red-400 text-sm">{error}</p>
        )}

        {/* Success message */}
        {success && (
          <p className="mt-4 text-green-600 dark:text-green-400 text-sm">
            ✅ Email successfully sent! Please check your inbox.
          </p>
        )}

        <p className="text-indigo-600 dark:text-indigo-300 text-sm">
          If you need any help, don't hesitate to go to the{" "}
          <span className="ml-1 font-bold">Help Center</span>
        </p>
      </div>
    </div>
  );
};

export default AccountActivation;
