import React from "react";
import { MotionConfig } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

import Test from "./pages/Test";
import Result from "./pages/Result";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Community from "./pages/Community";
import GuestRoute from "./components/GuestRoute";

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-screen flex-col bg-[#070a13] text-foreground font-sans selection:bg-[#1ecfc1]/20 selection:text-[#1ecfc1]">
        <ScrollToTop />
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/community" element={<Community />} />
            <Route path="/test" element={<Test />} />
            <Route path="/result" element={<Result />} />
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <Login />
                </GuestRoute>
              }
            />
            <Route
              path="/register"
              element={
                <GuestRoute>
                  <Register />
                </GuestRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}

export default App;
