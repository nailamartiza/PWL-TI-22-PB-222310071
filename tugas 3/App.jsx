import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Authentications from "./pages/Authentications";
import ChapterOne from "./pages/ChapterOne"; 
import ChapterTwo from "./pages/ChapterTwo"; 
import ErrorPage from "./pages/ErrorPage";   

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-in" element={<Authentications />} />
        <Route path="/sign-out" element={<Authentications />} />
        <Route path="/chapter-1" element={<ChapterOne />} />
        <Route path="/chapter-2" element={<ChapterTwo />} />
        <Route path="/home" element={<ChapterTwo />} />
        <Route path="/" element={<Navigate to="/chapter-1" />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
