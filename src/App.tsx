import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes";
import React, { Suspense } from "react";
import Loading from "./pages/Loading";

// Context/Provider
import { LanguageProvider } from "@/contexts/LanguageProvider";
import { UserProvider } from "@/contexts/UserProvider";
import { GlobalSearchProvider } from "@/contexts/SearchProvider";


// const authRoutes = [
//   { path: "/login", element: <Login /> },
//   { path: "/signup", element: <SignUp /> },
//   { path: "/forgot-password", element: <ForgotPassword /> },
//   { path: "/auth", element: <AuthAction /> }, // This handles the auth action URL with query parameters
// ];

// const privateAuthRoute = [
//   { path: "/activate-account/:token", element: <AccountActivation /> },
// ];

// const InAppPublicRoutes = [
//   { path: "/explore", element: <Explore /> },
//   { path: "/posts/:postId", element: <Post /> },
//   { path: "/blogs", element: <BrowseBlogs /> },
//   { path: "/blogs/:blogId", element: <BlogDetails /> },
//   { path: "/search", element: <Search /> },
// ];

// const InAppPrivateRoutes = [
//   { path: "/:username", element: <UserProfile /> },
//   { path: "/post/:postId/edit", element: <EditPost /> },
//   { path: "/posts/new", element: <UploadPost /> },
//   { path: "/collections", element: <Collection /> },
// ];

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <UserProvider>
        <LanguageProvider>
          <GlobalSearchProvider>
            <Suspense fallback={<Loading />}>
              <AppRoutes />
            </Suspense>
          </GlobalSearchProvider>
        </LanguageProvider>
      </UserProvider>
    </BrowserRouter>
  );
};

export default App;
