import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Test from "./pages/Test";
import Result from "./pages/Result";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Community from "./pages/Community";

function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#07090e] text-slate-100 selection:bg-[#1ecfc1]/30 selection:text-[#1ecfc1]">
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
