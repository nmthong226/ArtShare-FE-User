import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import React from "react";

// Components
import ProtectedRoute from "@/components/routeManagement/ProtectedRoute"; // Import ProtectedRoute

// Layout
import RootLayout from "@/layouts";
import InAppLayout from "@/layouts/public/InAppLayout";
import AuthenLayout from "@/layouts/public/AuthenLayout";

// Pages
import LandingPage from '@/pages/Home';
import Login from '@/pages/Authentication/Login';
import SignUp from '@/pages/Authentication/SignUp';
import ForgotPassword from '@/pages/Authentication/ForgotPassword';
import AccountActivation from '@/pages/Authentication/Activation';
import Explore from '@/pages/Explore';
import Blogs from '@/pages/Blogs';
import Shop from '@/pages/Shop';
import SubmitMedia from '@/pages/SubmitMedia';
import ArtGeneration from '@/pages/ArtGeneration';
import Portfolio from '@/pages/Portfolio';

// Context/Provider
import { ThemeProvider } from "@/context/ThemeProvider";
import { LanguageProvider } from "@/context/LanguageProvider";
import { UserProvider } from "@/context/UserProvider";
import AuthAction from "./pages/Authentication/HandleCallback";

const authRoutes = [
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/activate-account/:token", element: <AccountActivation /> },
  { path: "/auth", element: <AuthAction /> }, // This handles the auth action URL with query parameters
];

const InAppPublicRoutes = [
  { path: "/explore", element: <Explore /> },
  { path: "/blogs", element: <Blogs /> },
  { path: "/shop", element: <Shop /> },
];

const InAppPrivateRoutes = [
  { path: "/submit-media", element: <SubmitMedia /> },
  { path: "/create-art", element: <ArtGeneration /> },
  { path: "/portfolio", element: <Portfolio /> },
];

const App: React.FC = () => {
  return (
    <UserProvider>
      <ThemeProvider>
        <LanguageProvider>
          <Router>
            <RootLayout>
              <Routes>
                {/* Public Auth Routes */}
                {authRoutes.map(({ path, element }) => (
                  <Route
                    key={path}
                    path={path}
                    element={<AuthenLayout>{element}</AuthenLayout>}
                  />
                ))}

                {/* Public In-App Routes (Accessible by anyone) */}
                {InAppPublicRoutes.map(({ path, element }) => (
                  <Route
                    key={path}
                    path={path}
                    element={<InAppLayout>{element}</InAppLayout>}
                  />
                ))}

                {/* Private In-App Routes (Only accessible by logged-in users) */}
                {InAppPrivateRoutes.map(({ path, element }) => (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <ProtectedRoute>
                        <InAppLayout>{element}</InAppLayout>
                      </ProtectedRoute>
                    }
                  />
                ))}

                {/* Fallback Route (catch-all for non-existent routes) */}
                <Route path="*" element={<Navigate to="/explore" />} />
              </Routes>
            </RootLayout>
          </Router>
        </LanguageProvider>
      </ThemeProvider>
    </UserProvider>
  );
};

export default App;
