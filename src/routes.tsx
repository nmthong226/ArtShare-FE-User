// src/routes.tsx
import { lazy } from "react";
import { Navigate, RouteObject, useRoutes, Outlet } from "react-router-dom";

// Layouts & Wrappers
import RootLayout from "@/layouts";
import AuthenLayout from "@/layouts/AuthenLayout";
import InAppLayout from "@/layouts/InAppLayout";
import AILayout from "@/layouts/AILayout";
import ProtectedAuthRoute from "@/components/ProtectedItems/ProtectedAuthRoute";
import ProtectedInAppRoute from "@/components/ProtectedItems/ProtectedInAppRoute";
import GuestRoute from "@/components/routes/guest-route";
import EditUser from "./features/edit-user/EditUserPage";
import OnboardingProfile from "./pages/Onboarding";
import { useUser } from "./contexts/UserProvider"; 
import Dashboard from "./features/dashboard/Dashboard";


// Lazy imports for pages/features
const LandingPage = lazy(() => import("@/pages/Home"));
const Login = lazy(() => import("@/pages/Authentication/Login"));
const SignUp = lazy(() => import("@/pages/Authentication/SignUp"));
const ForgotPassword = lazy(
  () => import("@/pages/Authentication/ForgotPassword"),
);
const AccountActivation = lazy(
  () => import("@/pages/Authentication/Activation"),
);
const AuthAction = lazy(() => import("@/pages/Authentication/HandleCallback"));
const Explore = lazy(() => import("@/features/explore"));
const BrowseBlogs = lazy(() => import("@/features/browse-blogs/BrowseBlogs"));
const BlogDetails = lazy(() => import("@/features/blog-details/BlogDetails"));
const Search = lazy(() => import("@/pages/Search"));
const Post = lazy(() => import("@/features/post"));
const EditPost = lazy(() => import("@/features/post-management/EditPost"));
const UploadPost = lazy(() => import("@/features/post-management/UploadPost"));
const Collection = lazy(() => import("@/features/collection"));
const UserProfile = lazy(
  () => import("@/features/user-profile-private/UserProfile"),
);
const WriteBlog = lazy(() => import("@/features/write-blog/WriteBlog"));
const ArtGeneration = lazy(() => import("@/features/gen-art/ArtGenAI"));
const ImageEditor = lazy(() => import("@/features/edit-image/EditImage"));

// OnboardingRoute: Restrict users who are onboarded from accessing the onboarding page
const OnboardingRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading, isOnboard } = useUser();

  if (loading) return <div>Checking authentication...</div>;
  console.log("@@ isauthenticated", isAuthenticated);
  // 👇 block guests first
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 👇 block users who already finished onboarding
  if (isOnboard) {
    return <Navigate to="/explore" replace />;
  }

  return <>{children}</>;
};

/**
 * Flat route tree using useRoutes
 */
const routeConfig: RouteObject[] = [
  {
    element: (
      <RootLayout>
        <Outlet />
      </RootLayout>
    ),
    children: [
      // Landing
      { index: true, element: <LandingPage /> },
      // Public Auth
      {
        element: (
          <AuthenLayout>
            <Outlet />
          </AuthenLayout>
        ),
        children: [
          {
            path: "/login",
            element: (
              <GuestRoute>
                <Login />
              </GuestRoute>
            ),
          },
          { path: "/signup", element: <SignUp /> },
          { path: "/forgot-password", element: <ForgotPassword /> },
          { path: "/auth", element: <AuthAction /> },
        ],
      },
      {
        element: (
          <ProtectedAuthRoute>
            <AuthenLayout>
              <Outlet />
            </AuthenLayout>
          </ProtectedAuthRoute>
        ),
        children: [
          { path: "/activate-account/:token", element: <AccountActivation /> },
        ],
      },
      {
        path: "/onboarding",
        element: (
          <ProtectedAuthRoute>
            <OnboardingRoute>
              <InAppLayout>
                <OnboardingProfile />
              </InAppLayout>
            </OnboardingRoute>
          </ProtectedAuthRoute>
        ),
      },
      {
        element: (
          <InAppLayout>
            <Outlet />
          </InAppLayout>
        ),
        children: [
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/explore", element: <Explore /> },
          { path: "/posts/:postId", element: <Post /> },
          { path: "/blogs", element: <BrowseBlogs /> },
          { path: "/blogs/:blogId", element: <BlogDetails /> },
          { path: "/search", element: <Search /> },
        ],
      },
      {
        element: (
          <ProtectedInAppRoute>
            <InAppLayout>
              <Outlet />
            </InAppLayout>
          </ProtectedInAppRoute>
        ),
        children: [
          { path: "/:username", element: <UserProfile /> },
          { path: "/edit-user", element: <EditUser /> },
          { path: "/post/:postId/edit", element: <EditPost /> },
          { path: "/posts/new", element: <UploadPost /> },
          { path: "/collections", element: <Collection /> },
          { path: "/blogs/new", element: <WriteBlog /> },
        ]
      },
      {
        element: (
          <ProtectedInAppRoute>
            <AILayout>
              <Outlet />
            </AILayout>
          </ProtectedInAppRoute>
        ),
        children: [
          { path: "/image/tool/editor", element: <ImageEditor /> },
          { path: "/image/tool/text-to-image", element: <ArtGeneration /> },
        ]
      },
      // Catch-all -> redirect
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
];

/**
 * Hook to render the routes
 */
export function AppRoutes() {
  return useRoutes(routeConfig);
}
