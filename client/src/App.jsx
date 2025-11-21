import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import Courses from "./pages/Courses.jsx";
import Jasa from "./pages/Jasa.jsx";
import Pesan from "./pages/Pesan.jsx";
import Login from "./components/Login";
import Register from "./components/Register";
import "./index.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/jasa" element={<Jasa />} />
      <Route path="/pesan" element={<Pesan />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
