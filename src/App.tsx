import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React from "react";

// Components
// import ProtectedRoute from '@/components/routeManagement/ProtectedRoute';

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
import Post from "./pages/Post";
import Shop from "@/pages/Shop";
import SubmitMedia from "@/pages/SubmitMedia";
import ArtGeneration from "@/pages/ArtGeneration";
import Portfolio from "@/pages/Portfolio";

// Context/Provider
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageProvider";
import { UserProvider } from "@/contexts/UserProvider";

const authRoutes = [
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/activate-account/:token", element: <AccountActivation /> },
];

const InAppPublicRoutes = [
  { path: "/gallery", element: <Gallery /> },
  { path: "/blogs", element: <Blogs /> },
  { path: "/posts/:postId", element: <Post /> },
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
                {authRoutes.map(({ path, element }) => (
                  <Route key={path} path={path} element={<AuthenLayout>{element}</AuthenLayout>} />
                ))}
                {InAppPublicRoutes.map(({ path, element }) => (
                  <Route key={path} path={path} element={<InAppLayout>{element}</InAppLayout>} />
                ))}
                {InAppPrivateRoutes.map(({ path, element }) => (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <InAppLayout>
                        {/* <ProtectedRoute>
                          {element}
                        </ProtectedRoute> */}
                        {element}
                      </InAppLayout>
                    }
                  />
                ))}
                <Route path="/" element={<LandingPage />} />
                <Route path="*" element={<Navigate to="/gallery" />} />
              </Routes>
            </RootLayout>
          </Router>
        </LanguageProvider>
      </ThemeProvider>
    </UserProvider>
  );
};

export default App;
