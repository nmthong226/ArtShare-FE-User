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
import Explore from "@/features/explore";
import BrowseBlogs from "@/features/browse-blogs/BrowseBlogs";
import Collection from "@/features/collection";
// import SubmitMedia from "@/pages/SubmitMedia";
import ArtGeneration from "@/features/gen-art/ArtGenAI";
import AuthAction from "@/pages/Authentication/HandleCallback";
import Post from "@/features/post";
import UploadPost from "@/features/post-management/UploadPost";
import UserProfile from "@/features/UserProfile/UserProfile";
import Search from "@/pages/Search";

// Context/Provider
import { LanguageProvider } from "@/contexts/LanguageProvider";
import { UserProvider } from "@/contexts/UserProvider";
import ImageEditor from "@/features/edit-image/EditImage";
import { GlobalSearchProvider } from "./contexts/SearchProvider";
import AILayout from "./layouts/AILayout";
import BlogDetails from "./features/blog-details/BlogDetails";
import WriteBlog from "./features/write-blog/WriteBlog";
import EditPost from "./features/post-management/EditPost";

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
  { path: "/blogs", element: <BrowseBlogs /> },
  { path: "/blogs/:blogId", element: <BlogDetails /> },
  { path: "/search", element: <Search /> },
  { path: "/collections", element: <Collection /> },
  { path: "/:username", element: <UserProfile /> },
];

const InAppPrivateRoutes = [
  { path: "/blogs/new", element: <WriteBlog /> },
  { path: "/u/:username", element: <UserProfile /> },
  { path: "/post/:postId/edit", element: <EditPost /> },
  { path: "/posts/new", element: <UploadPost /> },
];

const AIPrivateRoutes = [
  { path: "/image/tool/text-to-image", element: <ArtGeneration /> },
  { path: "/image/tool/editor", element: <ImageEditor /> },
  { path: "/create-art", element: <ArtGeneration /> },
  { path: "/artgen", element: <ArtGeneration /> },
];

const App: React.FC = () => {
  return (
    <Router>
      <UserProvider>
        <LanguageProvider>
          <GlobalSearchProvider>
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
          </GlobalSearchProvider>
        </LanguageProvider>
      </UserProvider>
    </Router>
  );
};

export default App;
