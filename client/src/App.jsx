import React from "react";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Job from "./pages/Job";
import Test from "./pages/Test";
import Result from "./pages/Result";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Community from "./pages/Community";

function App() {
  return (
    <div className="overflow-hidden font-sans">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Job />} />
        <Route path="/community" element={<Community />} />
        <Route path="/test" element={<Test />} />
        <Route path="/result" element={<Result />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
