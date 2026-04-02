import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignUp } from "./pages/auth/SignUp";
import { Login } from "./pages/auth/Login";
import { Home } from "./pages/home/Home";
import { Onboarding } from "./pages/onboarding/Onboarding";
import { ProtectedRoute } from "./common/components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
