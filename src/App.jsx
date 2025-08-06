import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import HomeNew from "./pages/home/HomeNew";
import ChatPage from "./pages/chat/ChatPage.jsx";
import SubComponentPreview from "./pages/SubComponentPreview.jsx";
import { ThemeProvider } from "./components/ThemeContext";

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter basename='/'>
        <Routes>
          <Route path='/' element={<HomeNew />} />
          <Route path='/chat' element={<ChatPage />} />
          <Route path='/sub-preview' element={<SubComponentPreview />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
