<<<<<<< HEAD
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import React from "react";
=======
import React from "react";
import "./App.css";
import UploadMedia from "@/features/upload-media/UploadMedia.tsx";
>>>>>>> f64b4f5 (feat(upload-art): finish details)

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
import Explore from "@/pages/Explore";
import Blogs from "@/pages/Blogs";
import Shop from "@/pages/Shop";
import SubmitMedia from "@/pages/SubmitMedia";
import ArtGeneration from "@/pages/ArtGeneration";
import Portfolio from "@/pages/Portfolio";

// Context/Provider
import { ThemeProvider } from "@/context/ThemeProvider";
import { LanguageProvider } from "@/context/LanguageProvider";
import { UserProvider } from "@/context/UserProvider";
import UploadMedia from "./features/upload-media/UploadMedia";

const authRoutes = [
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/activate-account/:token", element: <AccountActivation /> },
];

const InAppPublicRoutes = [
  { path: "/explore", element: <Explore /> },
  { path: "/blogs", element: <Blogs /> },
  { path: "/shop", element: <Shop /> },
];

const InAppPrivateRoutes = [
  { path: "/submit-media", element: <SubmitMedia /> },
  { path: "/posts/new", element: <UploadMedia /> },
  { path: "/portfolio", element: <Portfolio /> },
];

const App: React.FC = () => {
  return (
<<<<<<< HEAD
    <UserProvider>
      <ThemeProvider>
        <LanguageProvider>
          <Router>
            <RootLayout>
              <Routes>
                {authRoutes.map(({ path, element }) => (
                  <Route
                    key={path}
                    path={path}
                    element={<AuthenLayout>{element}</AuthenLayout>}
                  />
                ))}
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
                <Route path="*" element={<Navigate to="/explore" />} />
              </Routes>
            </RootLayout>
          </Router>
        </LanguageProvider>
      </ThemeProvider>
    </UserProvider>
=======
    <div className="App bg-mountain-950">
      <UploadMedia />
    </div>
>>>>>>> f64b4f5 (feat(upload-art): finish details)
  );
};

export default App;
