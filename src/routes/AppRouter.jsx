// import { BrowserRouter, HashRouter, Routes, Route } from "react-router-dom"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import MainLayout from "../layouts/MainLayout"
import Home from "../pages/Home"
import About from "../pages/About"
import Login from "../pages/LoginPhone"
import Logout from "../pages/Logout"
import NoPage from "../pages/NoPage"

import Account from "../pages/Account"
import AccountSetting from "../pages/AccountSetting"
import { AuthProvider } from "../authContext"
import ProtectedRoute from "./ProtectedRoute"

export default function AppRouter() {
  return (
    <Router >
      <AuthProvider>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account-setting"
              element={
                <ProtectedRoute>
                  <AccountSetting />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NoPage />} />
          </Routes>
        </MainLayout>
      </AuthProvider>
    </Router>
  )
}
