import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignUp } from "./pages/auth/SignUp";
import { Login } from "./pages/auth/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <div
              style={{
                background: "#0a0a0a",
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
              <h1 style={{ color: "#fff" }}>Spark 홈 (준비 중)</h1>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
