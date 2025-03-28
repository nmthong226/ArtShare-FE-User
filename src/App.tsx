import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import React from "react";

// Components
import ProtectedAuthRoute from "@/components/ProtectedItems/ProtectedAuthRoute";
import ProtectedInAppRoute from "@/components/ProtectedItems/ProtectedInAppRoute";

// Layout
import RootLayout from "@/layouts";
import InAppLayout from "@/layouts/public/InAppLayout";
import AuthenLayout from "@/layouts/public/AuthenLayout";

// Pages
import LandingPage from "@/pages/Home";
import Login from "@/pages/Authentication/Login";
import SignUp from "@/pages/Authentication/SignUp";
import ForgotPassword from "@/pages/Authentication/ForgotPassword";
import AccountActivation from "@/pages/Authentication/Activation";
import Gallery from "./pages/Gallery";
import Blogs from "./pages/Blogs";
import Shop from "@/pages/Shop";
// import SubmitMedia from "@/pages/SubmitMedia";
import ArtGeneration from "@/pages/ArtGeneration";
import Portfolio from "@/pages/Portfolio";

// Context/Provider
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageProvider";
import { UserProvider } from "@/contexts/UserProvider";
import AuthAction from "./pages/Authentication/HandleCallback";
import UploadMedia from "./features/upload-media/UploadMedia";
import Post from "./pages/Post";

const authRoutes = [
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/auth", element: <AuthAction /> }, // This handles the auth action URL with query parameters
];

const privateAuthRoute = [
  { path: "/activate-account/:token", element: <AccountActivation /> },
];

const InAppPublicRoutes = [
  { path: "/explore", element: <Gallery /> },
  { path: "/posts/:postId", element: <Post /> },
  { path: "/blogs", element: <Blogs /> },
  { path: "/shop", element: <Shop /> },
];

const InAppPrivateRoutes = [
  { path: "/posts/new", element: <UploadMedia /> },
  { path: "/create-art", element: <ArtGeneration /> },
  { path: "/portfolio", element: <Portfolio /> },
  { path: "/artgen", element: <ArtGeneration /> },
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
                {/* Private Auth Routes */}
                {privateAuthRoute.map(({ path, element }) => (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <ProtectedAuthRoute>
                        <AuthenLayout>
                          {element}
                        </AuthenLayout>
                      </ProtectedAuthRoute>
                    }
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
                      <ProtectedInAppRoute>
                        <InAppLayout>{element}</InAppLayout>
                      </ProtectedInAppRoute>
                    }
                  />
                ))}
                {/* Fallback Route (catch-all for non-existent routes) */}
                <Route path="/" element={<LandingPage />} />
              </Routes>
            </RootLayout>
          </Router>
        </LanguageProvider>
      </ThemeProvider>
    </UserProvider>
  );
};

export default App;
