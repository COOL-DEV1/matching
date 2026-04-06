import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../common/hooks/useAuth";

type Profile = {
  nickname: string;
  birth_date: string;
  gender: string;
  location: string;
  bio: string;
  mbti: string;
  height: number;
  smoking: string;
  drinking: string;
  relationship_style: string;
};

const styleMap: Record<string, string> = {
  serious: "진지한 연애",
  casual: "캐주얼한 만남",
  thumb: "썸",
  open: "오픈 릴레이션십",
};
const smokingMap: Record<string, string> = {
  yes: "흡연",
  no: "비흡연",
  sometimes: "가끔",
};
const drinkingMap: Record<string, string> = {
  yes: "즐김",
  no: "안 마심",
  sometimes: "가끔",
};

export function MyPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [matchCount, setMatchCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchMatchCount();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user?.id)
      .single();
    setProfile(data);
    setLoading(false);
  };

  const fetchMatchCount = async () => {
    const { count } = await supabase
      .from("matches")
      .select("*", { count: "exact", head: true })
      .or(`user1.eq.${user?.id},user2.eq.${user?.id}`);
    setMatchCount(count || 0);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "회원 탈퇴를 하면 즉시 회원 정보가 삭제됩니다.\n괜찮으십니까?",
    );
    if (!confirmed) return;

    // 민감정보 먼저 삭제
    await supabase.from("user_preferences").delete().eq("user_id", user?.id);
    await supabase.from("profiles").delete().eq("id", user?.id);
    await supabase.auth.signOut();
    window.location.href = "/signup";
  };

  const getAge = (birth: string) =>
    new Date().getFullYear() - new Date(birth).getFullYear();

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

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        maxWidth: "430px",
        margin: "0 auto",
      }}>
      {/* 헤더 */}
      <div
        style={{
          padding: "16px 20px 12px",
          borderBottom: "1px solid #1a1a1a",
          position: "sticky",
          top: 0,
          background: "#0a0a0a",
          zIndex: 10,
        }}>
        <h1
          style={{
            color: "#fff",
            fontSize: "20px",
            fontWeight: 700,
            margin: 0,
          }}>
          마이페이지
        </h1>
      </div>

      <div style={{ padding: "20px 20px 100px" }}>
        {/* 프로필 카드 */}
        <div
          style={{
            background: "#111",
            border: "1px solid #1e1e1e",
            borderRadius: "20px",
            padding: "24px",
            marginBottom: "16px",
            textAlign: "center",
          }}>
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              margin: "0 auto 14px",
              background: "linear-gradient(135deg, #5b21b6, #C084FC)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              color: "#fff",
              fontWeight: 700,
            }}>
            {profile?.nickname[0]}
          </div>
          <h2
            style={{
              color: "#fff",
              fontSize: "20px",
              fontWeight: 700,
              margin: "0 0 4px",
            }}>
            {profile?.nickname}
          </h2>
          <p style={{ color: "#666", fontSize: "14px", margin: "0 0 12px" }}>
            {profile?.birth_date && getAge(profile.birth_date)}세 ·{" "}
            {profile?.location}
          </p>
          {profile?.mbti && (
            <span
              style={{
                display: "inline-block",
                fontSize: "13px",
                padding: "4px 14px",
                borderRadius: "20px",
                background: "#2d1f4e",
                border: "1px solid #5b21b6",
                color: "#C084FC",
              }}>
              {profile.mbti}
            </span>
          )}
          {profile?.bio && (
            <p
              style={{
                color: "#888",
                fontSize: "13px",
                marginTop: "12px",
                lineHeight: 1.6,
              }}>
              {profile.bio}
            </p>
          )}
        </div>

        {/* 통계 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            marginBottom: "16px",
          }}>
          <div
            style={{
              background: "#111",
              border: "1px solid #1e1e1e",
              borderRadius: "14px",
              padding: "16px",
              textAlign: "center",
            }}>
            <div
              style={{ color: "#C084FC", fontSize: "24px", fontWeight: 700 }}>
              {matchCount}
            </div>
            <div style={{ color: "#666", fontSize: "12px", marginTop: "4px" }}>
              매칭
            </div>
          </div>
          <div
            style={{
              background: "#111",
              border: "1px solid #1e1e1e",
              borderRadius: "14px",
              padding: "16px",
              textAlign: "center",
            }}>
            <div
              style={{ color: "#C084FC", fontSize: "24px", fontWeight: 700 }}>
              {profile?.height || "-"}
            </div>
            <div style={{ color: "#666", fontSize: "12px", marginTop: "4px" }}>
              키 (cm)
            </div>
          </div>
        </div>

        {/* 내 정보 */}
        <div
          style={{
            background: "#111",
            border: "1px solid #1e1e1e",
            borderRadius: "16px",
            padding: "16px",
            marginBottom: "16px",
          }}>
          <h3
            style={{
              color: "#888",
              fontSize: "12px",
              marginBottom: "14px",
              letterSpacing: "0.05em",
            }}>
            내 정보
          </h3>
          {[
            {
              label: "연애 스타일",
              value: profile?.relationship_style
                ? styleMap[profile.relationship_style]
                : "-",
            },
            {
              label: "흡연",
              value: profile?.smoking ? smokingMap[profile.smoking] : "-",
            },
            {
              label: "음주",
              value: profile?.drinking ? drinkingMap[profile.drinking] : "-",
            },
            {
              label: "성별",
              value: profile?.gender === "male" ? "남성" : "여성",
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 0",
                borderBottom: "1px solid #1a1a1a",
              }}>
              <span style={{ color: "#666", fontSize: "14px", flexShrink: 0 }}>
                {label}
              </span>
              <span
                style={{ color: "#fff", fontSize: "14px", textAlign: "right" }}>
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* 버튼들 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button
            onClick={() => navigate("/onboarding")}
            style={{
              width: "100%",
              padding: "14px",
              background: "#1a1a1a",
              border: "1px solid #2a2a2a",
              borderRadius: "12px",
              color: "#aaa",
              fontSize: "14px",
              cursor: "pointer",
            }}>
            ✏️ 프로필 수정
          </button>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "14px",
              background: "#1a1a1a",
              border: "1px solid #2a2a2a",
              borderRadius: "12px",
              color: "#888",
              fontSize: "14px",
              cursor: "pointer",
            }}>
            로그아웃
          </button>
          <button
            onClick={handleDeleteAccount}
            style={{
              width: "100%",
              padding: "14px",
              background: "transparent",
              border: "none",
              color: "#444",
              fontSize: "13px",
              cursor: "pointer",
            }}>
            회원 탈퇴
          </button>
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: "430px",
          background: "#0d0d0d",
          borderTop: "1px solid #1e1e1e",
          display: "flex",
          justifyContent: "space-around",
          padding: "12px 0 24px",
        }}>
        {[
          { icon: "🏠", label: "홈", path: "/" },
          { icon: "💬", label: "채팅", path: "/chat" },
          { icon: "👤", label: "MY", path: "/mypage" },
        ].map(({ icon, label, path }) => (
          <div
            key={label}
            onClick={() => navigate(path)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "3px",
              cursor: "pointer",
            }}>
            <span style={{ fontSize: "22px" }}>{icon}</span>
            <span
              style={{
                fontSize: "10px",
                color: label === "MY" ? "#C084FC" : "#555",
              }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
