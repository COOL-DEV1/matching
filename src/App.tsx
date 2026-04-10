import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { supabase } from "./lib/supabase";
import { SignUp } from "./pages/auth/SignUp";
import { Login } from "./pages/auth/Login";
import { Home } from "./pages/home/Home";
import { Onboarding } from "./pages/onboarding/Onboarding";
import { Chat } from "./pages/chat/Chat";
import { ChatList } from "./pages/chat/ChatList";
import { MyPage } from "./pages/mypage/MyPage";
import { ProtectedRoute } from "./common/components/ProtectedRoute";
import { Landing } from "./pages/landing/Landing";

function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const token_hash = searchParams.get("token_hash");
      const type = searchParams.get("type");

      if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash,
          type: type as "email",
        });
        if (!error) {
          navigate("/home", { replace: true });
          return;
        }
      }
      navigate("/login", { replace: true });
    };
    handleCallback();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "16px",
      }}>
      <div style={{ color: "#C084FC", fontSize: "32px" }}>✦</div>
      <p style={{ color: "#666", fontSize: "14px" }}>인증 확인 중...</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Landing />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:matchId"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mypage"
          element={
            <ProtectedRoute>
              <MyPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
