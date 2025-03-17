import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/layouts';
import React from 'react';
import Login from '@/pages/Authentication/Login';
import SignUp from '@/pages/Authentication/SignUp';
import { AuthenLayout } from '@/layouts/public/AuthenLayout';
import ForgotPassword from '@/pages/Authentication/ForgotPassword';
import { ThemeProvider } from '@/context/ThemeProvider';
import { LanguageProvider } from '@/context/LanguageProvider';
import AccountActivation from '@/pages/Authentication/Activation';
import DummyPage from '@/pages/Dummy';
import InAppLayout from './layouts/public/InAppLayout';

const authRoutes = [
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/account-activation", element: <AccountActivation /> },
];

const inAppRoutes = [
  { path: "/explore", element: <DummyPage /> }
]

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
          <Layout>
            <Routes>
              {authRoutes.map(({ path, element }) => (
                <Route key={path} path={path} element={<AuthenLayout>{element}</AuthenLayout>} />
              ))}
              {inAppRoutes.map(({ path, element }) => (
                <Route key={path} path={path} element={<InAppLayout>{element}</InAppLayout>} />
              ))}
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </Layout>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
