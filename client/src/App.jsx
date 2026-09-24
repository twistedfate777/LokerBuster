import React from "react";
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

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-[#070a13] text-foreground font-sans selection:bg-[#1ecfc1]/20 selection:text-[#1ecfc1]">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/community" element={<Community />} />
          <Route path="/test" element={<Test />} />
          <Route path="/result" element={<Result />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
