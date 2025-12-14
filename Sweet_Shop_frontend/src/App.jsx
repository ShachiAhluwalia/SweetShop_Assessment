import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Sweets from "./Sweets";

function App() {
  const token = localStorage.getItem("access_token");

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />

      <Route
        path="/sweets"
        element={token ? <Sweets /> : <Navigate to="/login" replace />}
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
