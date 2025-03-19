import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';

// Layout
import RootLayout from '@/layouts';
import InAppLayout from '@/layouts/public/InAppLayout';
import AuthenLayout from '@/layouts/public/AuthenLayout';

// Pages
import Login from '@/pages/Authentication/Login';
import SignUp from '@/pages/Authentication/SignUp';
import ForgotPassword from '@/pages/Authentication/ForgotPassword';
import AccountActivation from '@/pages/Authentication/Activation';
import Explore from '@/pages/Explore';
import Blogs from '@/pages/Blogs';
import Shop from '@/pages/Shop';

// Context/Provider
import { ThemeProvider } from '@/context/ThemeProvider';
import { LanguageProvider } from '@/context/LanguageProvider';
import SubmitMedia from './pages/SubmitMedia';
import ArtGeneration from './pages/ArtGeneration';
import Portfolio from './pages/Portfolio';
import { UserProvider } from './context/UserProvider';
import ProtectedRoute from './components/routeManagement/ProtectedRoute';

const authRoutes = [
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/activate-account/:token", element: <AccountActivation /> },
];

const publicRoutes = [
  { path: "/explore", element: <Explore /> },
  { path: "/blogs", element: <Blogs /> },
  { path: "/shop", element: <Shop /> },
]

const privateRoutes = [
  { path: "/submit-media", element: <SubmitMedia /> },
  { path: "/create-art", element: <ArtGeneration /> },
  { path: "/portfolio", element: <Portfolio /> },
]

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
                {publicRoutes.map(({ path, element }) => (
                  <Route key={path} path={path} element={<InAppLayout>{element}</InAppLayout>} />
                ))}
                {privateRoutes.map(({ path, element }) => (
                  <Route key={path} path={path}
                    element={
                      <InAppLayout>
                        <ProtectedRoute>
                          {element}
                        </ProtectedRoute>
                      </InAppLayout>
                    } />
                ))}
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
