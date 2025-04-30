import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";

// Components
import ProtectedAuthRoute from "@/components/ProtectedItems/ProtectedAuthRoute";
import ProtectedInAppRoute from "@/components/ProtectedItems/ProtectedInAppRoute";

// Layout
import RootLayout from "@/layouts";
import InAppLayout from "@/layouts/InAppLayout";
import AuthenLayout from "@/layouts/AuthenLayout";

// Pages / Features
import LandingPage from "@/pages/Home";
import Login from "@/pages/Authentication/Login";
import SignUp from "@/pages/Authentication/SignUp";
import ForgotPassword from "@/pages/Authentication/ForgotPassword";
import AccountActivation from "@/pages/Authentication/Activation";
import Explore from "./features/explore";
import Blogs from "./pages/Blogs";
import Collection from "./features/collection";

// import SubmitMedia from "@/pages/SubmitMedia";
import ArtGeneration from "@/pages/ArtGen";
import Portfolio from "@/pages/Portfolio";
import AuthAction from "@/pages/Authentication/HandleCallback";
import Post from "@/features/post";
import UploadMedia from "@/features/upload-media/UploadMedia";
import UserProfile from "@/pages/UserManagement/UserProfile";
import Search from "@/pages/Search";

// Context/Provider
import { LanguageProvider } from "@/contexts/LanguageProvider";
import { UserProvider } from "@/contexts/UserProvider";
import ImageEditor from "./pages/EditImage";
import { GlobalSearchProvider } from "./contexts/SearchProvider";
import AILayout from "./layouts/AILayout";

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
  { path: "/explore", element: <Explore /> },
  { path: "/posts/:postId", element: <Post /> },
  { path: "/blogs", element: <Blogs /> },
  { path: "/search", element: <Search /> },
  { path: "/collections", element: <Collection /> },
];

const InAppPrivateRoutes = [
  { path: "/posts/new", element: <UploadMedia /> },
  { path: "/portfolio", element: <Portfolio /> },
  { path: "/u/:username", element: <UserProfile /> },
];

const AIPrivateRoutes = [
  { path: "/image/tool/text-to-image", element: <ArtGeneration /> },
  { path: "/image/tool/editor", element: <ImageEditor /> },
];

const App: React.FC = () => {
  return (
    <UserProvider>
      <LanguageProvider>
        <GlobalSearchProvider>
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
                        <AuthenLayout>{element}</AuthenLayout>
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
                {AIPrivateRoutes.map(({ path, element }) => (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <ProtectedInAppRoute>
                        <AILayout>{element}</AILayout>
                      </ProtectedInAppRoute>
                    }
                  />
                ))}
                {/* Fallback Route (catch-all for non-existent routes) */}
                <Route path="/" element={<LandingPage />} />
              </Routes>
            </RootLayout>
          </Router>
        </GlobalSearchProvider>
      </LanguageProvider>
    </UserProvider>
  );
};

export default App;
