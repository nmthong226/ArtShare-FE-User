import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "@/firebase"; // Firebase auth instance
import {
  verifyPasswordResetCode,
  confirmPasswordReset,
  sendEmailVerification,
} from "firebase/auth";
import { Button } from "@/components/ui/button";

const AuthAction = () => {
  const location = useLocation(); // Access the URL parameters (e.g., mode, oobCode)
  const navigate = useNavigate();
  const [mode, setMode] = useState<string | null>(null); // To store the mode from URL (verifyEmail/resetPassword)
  const [oobCode, setOobCode] = useState<string | null>(null); // Store the reset or verification code
  const [email, setEmail] = useState<string | null>(null); // Store the email for password reset or email verification
  const [password, setPassword] = useState(""); // For the new password input (if mode is resetPassword)
  const [message, setMessage] = useState<string | null>(null); // Success message
  const [error, setError] = useState<string | null>(null); // Error message
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const modeFromUrl = params.get("mode");
    const oobCodeFromUrl = params.get("oobCode");

    setMode(modeFromUrl);
    setOobCode(oobCodeFromUrl);

    if (oobCodeFromUrl) {
      if (modeFromUrl === "resetPassword") {
        // Verify the password reset code
        verifyPasswordResetCode(auth, oobCodeFromUrl)
          .then((email) => {
            setEmail(email); // Store the user's email for password reset
          })
          .catch((error) => {
            setError("Invalid or expired reset code.");
          });
      } else if (modeFromUrl === "verifyEmail") {
        // Verify the email verification code
        verifyPasswordResetCode(auth, oobCodeFromUrl)
          .then((email) => {
            setEmail(email); // Store the user's email for email verification
            // Call Firebase method to verify the email
            sendEmailVerification(auth.currentUser!).then(() => {
              setMessage("Email verified successfully!");
              setError(null); // Clear any previous errors
              navigate("/login"); // Redirect to login after email is verified
            });
          })
          .catch((error) => {
            setError("Invalid or expired verification code.");
          });
      }
    }
  }, [location, navigate]);

  // Handle password reset
  const handleSubmitPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (oobCode) {
      setLoading(true);
      try {
        await confirmPasswordReset(auth, oobCode, password);
        setMessage("Password has been reset successfully!");
        setError(null);
        navigate("/login"); // Redirect to login after successful password reset
      } catch (error: any) {
        setMessage(null);
        setError(error.message); // Handle any errors (invalid token, etc.)
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex-1 space-y-4 px-10 md:px-0 lg:px-10 xl:px-20 py-8">
      <div className="flex flex-col space-x-3">
        <h1 className="font-bold text-mountain-800 dark:text-mountain-50 text-2xl xl:text-3xl leading-6">
          {mode === "resetPassword"
            ? "Reset Your Password"
            : "Verify Your Email"}
        </h1>
        <p className="mt-4 text-mountain-500 dark:text-mountain-300 text-xs xl:text-sm">
          {mode === "resetPassword"
            ? "Enter a new password below."
            : "Email successfully verified! Please check your inbox."}
        </p>
      </div>

      {/* Reset Password Form */}
      {mode === "resetPassword" && oobCode && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block font-semibold text-mountain-600 dark:text-mountain-50 text-sm"
            >
              New Password
            </label>
            <input
              type="password"
              id="password"
              className="dark:bg-mountain-900 shadow-sm mt-1 p-3 border border-mountain-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              className="bg-mountain-800 hover:bg-mountain-700 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-10 font-bold text-white"
              onClick={handleSubmitPasswordReset}
              disabled={loading}
            >
              {loading ? "Resetting..." : "Recover My Account"}
            </Button>
          </div>
        </div>
      )}

      {/* Success and Error Messages */}
      {error && (
        <p className="text-red-600 dark:text-red-400 text-sm mt-4">{error}</p>
      )}
      {message && (
        <p className="text-green-600 dark:text-green-400 text-sm mt-4">
          {message}
        </p>
      )}

      {mode === "verifyEmail" && email && (
        <div>
          {message && (
            <p className="text-green-600 dark:text-green-400 text-sm mt-4">
              {message}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AuthAction;
