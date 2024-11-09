import Home from "./components/home/home";
import Login from "./components/login/login";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google"; 

const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID";
function App() {
  return (
    <BrowserRouter>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <Toaster />
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/register" element={<Register />}></Route>
        </Routes>
      </GoogleOAuthProvider>
    </BrowserRouter>
  );
}

export default App;
