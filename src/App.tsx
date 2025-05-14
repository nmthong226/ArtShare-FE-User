import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { lazy, Suspense } from "react";

// Components
import ProtectedAuthRoute from "@/components/ProtectedItems/ProtectedAuthRoute";
import ProtectedInAppRoute from "@/components/ProtectedItems/ProtectedInAppRoute";

// Layout
import RootLayout from "@/layouts";
import InAppLayout from "@/layouts/InAppLayout";
import AuthenLayout from "@/layouts/AuthenLayout";
import AILayout from "./layouts/AILayout";

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
import AuthAction from "@/pages/Authentication/HandleCallback";
import Post from "@/features/post";
import UploadPost from "@/features/post-management/UploadPost";
import Search from "@/pages/Search";
import BlogDetails from "./features/blog-details/BlogDetails";
import EditPost from "./features/post-management/EditPost";
import UserProfile from "@/features/UserProfile/UserProfile";
import Loading from "@/pages/Loading";

//Significant Features
const WriteBlog = lazy(() => import("@/features/write-blog/WriteBlog"));
const ImageEditor = lazy(() => import("@/features/edit-image/EditImage"));
const ArtGeneration = lazy(() => import("@/features/gen-art/ArtGenAI"));

// Context/Provider
import { LanguageProvider } from "@/contexts/LanguageProvider";
import { UserProvider } from "@/contexts/UserProvider";
import { GlobalSearchProvider } from "@/contexts/SearchProvider";


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
];

const InAppPrivateRoutes = [
  { path: "/u/:username", element: <UserProfile /> },
  { path: "/post/:postId/edit", element: <EditPost /> },
  { path: "/posts/new", element: <UploadPost /> },
  { path: "/collections", element: <Collection /> },
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
                {/* Fallback Route (catch-all for non-existent routes) */}
                <Route path="/" element={<LandingPage />} />
                {/* Significant route need for special loading */}
                <Route
                  path="/blogs/new"
                  element={
                    <ProtectedInAppRoute>
                      <InAppLayout>
                        <Suspense fallback={<Loading />}>
                          <WriteBlog />
                        </Suspense>
                      </InAppLayout>
                    </ProtectedInAppRoute>
                  }
                />
                <Route
                  path="/image/tool/text-to-image"
                  element={
                    <ProtectedInAppRoute>
                      <AILayout>
                        <Suspense fallback={<Loading />}>
                          <ArtGeneration />
                        </Suspense>
                      </AILayout>
                    </ProtectedInAppRoute>
                  }
                />
                <Route
                  path="/image/tool/editor"
                  element={
                    <ProtectedInAppRoute>
                      <AILayout>
                        <Suspense fallback={<Loading />}>
                          <ImageEditor />
                        </Suspense>
                      </AILayout>
                    </ProtectedInAppRoute>
                  }
                />
              </Routes>
            </RootLayout>
          </GlobalSearchProvider>
        </LanguageProvider>
      </UserProvider>
    </Router>
  );
};

export default App;
