import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../hooks/useAuth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) return;

    const checkProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      setHasProfile(!!data);
    };

    checkProfile();
  }, [user]);

  if (loading || (user && hasProfile === null)) {
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

  // 프로필 없으면 온보딩으로
  if (hasProfile === false && window.location.pathname !== "/onboarding") {
    window.location.href = "/onboarding";
    return null;
  }

  return <>{children}</>;
}
