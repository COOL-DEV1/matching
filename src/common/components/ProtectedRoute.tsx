import { useAuth } from "../hooks/useAuth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0a0a0a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <div style={{ color: "#C084FC", fontSize: "24px" }}>✦</div>
      </div>
    );
  }

  if (!user) {
    window.location.href = "/login";
    return null;
  }

  return <>{children}</>;
}
