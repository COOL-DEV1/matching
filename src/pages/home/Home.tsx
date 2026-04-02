import { useState } from "react";
import { useAuth } from "../../common/hooks/useAuth";
import { supabase } from "../../lib/supabase";

const mockProfiles = [
  {
    id: "1",
    nickname: "김지우",
    age: 24,
    location: "서울 마포구",
    mbti: "ENFJ",
    tags: ["카페 투어", "영화", "산책"],
    relationship_style: "casual",
    bio: "같이 맛있는 거 먹고 얘기 많이 나눌 수 있는 사람이면 좋겠어요 :)",
  },
  {
    id: "2",
    nickname: "이수연",
    age: 27,
    location: "서울 성동구",
    mbti: "INFP",
    tags: ["독서", "음악", "요리"],
    relationship_style: "serious",
    bio: "진지하게 만날 사람 찾고 있어요. 일상 공유하는 걸 좋아해요.",
  },
  {
    id: "3",
    nickname: "박하은",
    age: 22,
    location: "서울 강남구",
    mbti: "ESFP",
    tags: ["운동", "여행", "사진"],
    relationship_style: "casual",
    bio: "활발하고 긍정적인 편이에요. 같이 여행 다닐 사람 구해요!",
  },
  {
    id: "4",
    nickname: "최민서",
    age: 25,
    location: "서울 용산구",
    mbti: "INTJ",
    tags: ["게임", "코딩", "독서"],
    relationship_style: "serious",
    bio: "조용하지만 깊은 대화 좋아해요. 취향 맞는 분이면 좋겠어요.",
  },
];

const styleMap: Record<string, string> = {
  serious: "진지한 연애",
  casual: "캐주얼한 만남",
};

const gradients = [
  "linear-gradient(160deg, #1e1e2e 0%, #2a1a3e 100%)",
  "linear-gradient(160deg, #0f1e2e 0%, #1a2a3e 100%)",
  "linear-gradient(160deg, #1e2a1e 0%, #1a3e2a 100%)",
  "linear-gradient(160deg, #2e1e1e 0%, #3e1a2a 100%)",
];

const avatarColors = [
  "linear-gradient(135deg, #7C3AED, #C084FC)",
  "linear-gradient(135deg, #0f766e, #2dd4bf)",
  "linear-gradient(135deg, #be185d, #f472b6)",
  "linear-gradient(135deg, #1d4ed8, #60a5fa)",
];

export function Home() {
  const { user } = useAuth();
  const [current, setCurrent] = useState(0);
  const [action, setAction] = useState<"like" | "pass" | null>(null);
  const [exiting, setExiting] = useState(false);
  const [likedCount, setLikedCount] = useState(0);
  const [showMatch, setShowMatch] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const handleAction = (type: "like" | "pass") => {
    if (exiting) return;
    setAction(type);
    setExiting(true);
    if (type === "like") {
      setLikedCount((prev) => prev + 1);
      if (Math.random() > 0.5) {
        setTimeout(() => setShowMatch(true), 600);
      }
    }
    setTimeout(() => {
      setCurrent((prev) => prev + 1);
      setAction(null);
      setExiting(false);
    }, 500);
  };

  const profile = mockProfiles[current % mockProfiles.length];
  const nextProfile = mockProfiles[(current + 1) % mockProfiles.length];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        maxWidth: "430px",
        margin: "0 auto",
        position: "relative",
        overflow: "hidden",
      }}>
      {/* 매칭 팝업 */}
      {showMatch && (
        <div
          onClick={() => setShowMatch(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "fadeIn 0.3s ease",
          }}>
          <div
            style={{
              textAlign: "center",
              padding: "40px 32px",
              background: "#111",
              borderRadius: "24px",
              border: "1px solid #3b1f7a",
              maxWidth: "320px",
              width: "90%",
              animation: "slideUp 0.4s ease",
            }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>💜</div>
            <h2
              style={{
                color: "#C084FC",
                fontSize: "24px",
                fontWeight: 700,
                marginBottom: "8px",
              }}>
              매칭됐어요!
            </h2>
            <p
              style={{ color: "#888", fontSize: "14px", marginBottom: "24px" }}>
              <span style={{ color: "#fff" }}>{profile.nickname}</span>님이 나를
              좋아해요
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setShowMatch(false)}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "12px",
                  color: "#888",
                  fontSize: "14px",
                  cursor: "pointer",
                }}>
                나중에
              </button>
              <button
                onClick={() => setShowMatch(false)}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "#7C3AED",
                  border: "none",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "14px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}>
                채팅하기
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(40px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        @keyframes slideLeft { from { transform: translateX(0) rotate(0deg); opacity: 1 } to { transform: translateX(-120%) rotate(-15deg); opacity: 0 } }
        @keyframes slideRight { from { transform: translateX(0) rotate(0deg); opacity: 1 } to { transform: translateX(120%) rotate(15deg); opacity: 0 } }
        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0.5 } to { transform: scale(1); opacity: 1 } }
        .card-exit-left { animation: slideLeft 0.5s ease forwards; }
        .card-exit-right { animation: slideRight 0.5s ease forwards; }
        .card-enter { animation: scaleIn 0.5s ease forwards; }
        button:active { transform: scale(0.96); }
      `}</style>

      {/* 상단 네비게이션 */}
      <div
        style={{
          padding: "16px 20px 12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #1a1a1a",
          position: "sticky",
          top: 0,
          background: "#0a0a0a",
          zIndex: 10,
        }}>
        <h1
          style={{
            color: "#fff",
            fontSize: "22px",
            fontWeight: 700,
            margin: 0,
          }}>
          Sp<span style={{ color: "#C084FC" }}>a</span>rk
        </h1>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {likedCount > 0 && (
            <div
              style={{
                background: "#2d1f4e",
                border: "1px solid #5b21b6",
                borderRadius: "20px",
                padding: "4px 10px",
                color: "#C084FC",
                fontSize: "12px",
              }}>
              💜 {likedCount}
            </div>
          )}
          <div
            onClick={handleLogout}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "#1a1a1a",
              border: "1px solid #2a2a2a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "14px",
            }}>
            👤
          </div>
        </div>
      </div>

      {/* 카드 영역 */}
      <div style={{ padding: "16px 20px", position: "relative" }}>
        {/* 뒤 카드 (다음 프로필 미리보기) */}
        <div
          style={{
            position: "absolute",
            top: "24px",
            left: "28px",
            right: "28px",
            background: "#111",
            border: "1px solid #1e1e1e",
            borderRadius: "20px",
            height: "420px",
            transform: "scale(0.95)",
            zIndex: 0,
          }}
        />

        {/* 현재 카드 */}
        <div
          className={
            exiting
              ? action === "like"
                ? "card-exit-right"
                : "card-exit-left"
              : ""
          }
          style={{
            background: "#111",
            border: "1px solid #1e1e1e",
            borderRadius: "20px",
            overflow: "hidden",
            position: "relative",
            zIndex: 1,
          }}>
          {/* 좋아요/패스 오버레이 */}
          {action && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  action === "like"
                    ? "rgba(124,58,237,0.15)"
                    : "rgba(239,68,68,0.15)",
                borderRadius: "20px",
              }}>
              <div
                style={{
                  fontSize: "64px",
                  transform: "rotate(-15deg)",
                  filter:
                    "drop-shadow(0 0 20px " +
                    (action === "like" ? "#7C3AED" : "#ef4444") +
                    ")",
                }}>
                {action === "like" ? "💜" : "👎"}
              </div>
            </div>
          )}

          {/* 사진 영역 */}
          <div
            style={{
              height: "280px",
              background: gradients[current % gradients.length],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}>
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background: avatarColors[current % avatarColors.length],
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "36px",
                color: "#fff",
                fontWeight: 700,
              }}>
              {profile.nickname[0]}
            </div>
            <div
              style={{
                position: "absolute",
                top: "14px",
                right: "14px",
                background: "#2d1f4e",
                border: "1px solid #5b21b6",
                borderRadius: "20px",
                padding: "4px 10px",
                color: "#C084FC",
                fontSize: "12px",
                fontWeight: 600,
              }}>
              {profile.mbti}
            </div>
            {/* 거리 뱃지 */}
            <div
              style={{
                position: "absolute",
                bottom: "14px",
                left: "14px",
                background: "rgba(0,0,0,0.6)",
                borderRadius: "20px",
                padding: "4px 10px",
                color: "#ccc",
                fontSize: "12px",
              }}>
              📍 {profile.location}
            </div>
          </div>

          {/* 정보 */}
          <div style={{ padding: "16px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "8px",
                marginBottom: "6px",
              }}>
              <span
                style={{ color: "#fff", fontSize: "20px", fontWeight: 700 }}>
                {profile.nickname}
              </span>
              <span style={{ color: "#666", fontSize: "15px" }}>
                {profile.age}세
              </span>
            </div>
            <p
              style={{
                color: "#777",
                fontSize: "13px",
                margin: "0 0 12px",
                lineHeight: 1.6,
              }}>
              {profile.bio}
            </p>

            {/* 태그 */}
            <div
              style={{
                display: "flex",
                gap: "6px",
                flexWrap: "wrap",
                marginBottom: "12px",
              }}>
              <span
                style={{
                  fontSize: "11px",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  background: "#1a1230",
                  border: "1px solid #3b1f7a",
                  color: "#C084FC",
                }}>
                {styleMap[profile.relationship_style]}
              </span>
              {profile.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: "11px",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    background: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    color: "#777",
                  }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* AI 궁합 */}
            <div
              style={{
                background: "#1a1230",
                border: "1px solid #3b1f7a",
                borderRadius: "12px",
                padding: "10px 12px",
                marginBottom: "16px",
              }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginBottom: "4px",
                }}>
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#C084FC",
                  }}
                />
                <span
                  style={{
                    color: "#C084FC",
                    fontSize: "11px",
                    fontWeight: 600,
                  }}>
                  AI 궁합 분석
                </span>
              </div>
              <p
                style={{
                  color: "#888",
                  fontSize: "12px",
                  margin: 0,
                  lineHeight: 1.5,
                }}>
                {profile.mbti}과의 궁합이 좋아요. 감성적 교류를 중시하는 두 분의
                성향이 잘 맞을 것 같아요.
              </p>
            </div>

            {/* 액션 버튼 */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => handleAction("pass")}
                style={{
                  flex: 1,
                  padding: "14px",
                  background: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "14px",
                  color: "#888",
                  fontSize: "15px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}>
                👎 패스
              </button>
              <button
                onClick={() => handleAction("like")}
                style={{
                  flex: 1,
                  padding: "14px",
                  background: "linear-gradient(135deg, #5b21b6, #7C3AED)",
                  border: "none",
                  borderRadius: "14px",
                  color: "#fff",
                  fontSize: "15px",
                  cursor: "pointer",
                  fontWeight: 600,
                  transition: "all 0.2s",
                }}>
                💜 좋아요
              </button>
            </div>
          </div>
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
          { icon: "🏠", label: "홈", active: true },
          { icon: "💬", label: "채팅", active: false },
          { icon: "❤️", label: "매칭", active: false },
          { icon: "👤", label: "MY", active: false },
        ].map(({ icon, label, active }) => (
          <div
            key={label}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "3px",
              cursor: "pointer",
            }}>
            <span style={{ fontSize: "22px" }}>{icon}</span>
            <span
              style={{ fontSize: "10px", color: active ? "#C084FC" : "#555" }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
