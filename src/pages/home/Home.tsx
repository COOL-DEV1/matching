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
];

const styleMap: Record<string, string> = {
  serious: "진지한 연애",
  casual: "캐주얼한 만남",
};

export function Home() {
  const { user } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        maxWidth: "430px",
        margin: "0 auto",
        position: "relative",
      }}>
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
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div
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
              fontSize: "16px",
            }}>
            🔔
          </div>
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

      {/* 환영 메시지 */}
      <div style={{ padding: "20px 20px 8px" }}>
        <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>
          오늘의 추천 ✦
        </p>
      </div>

      {/* 프로필 카드 목록 */}
      <div style={{ padding: "0 20px 100px" }}>
        {mockProfiles.map((profile) => (
          <div
            key={profile.id}
            style={{
              background: "#111",
              border: "1px solid #1e1e1e",
              borderRadius: "20px",
              marginBottom: "16px",
              overflow: "hidden",
            }}>
            {/* 사진 영역 */}
            <div
              style={{
                height: "260px",
                background: "linear-gradient(160deg, #1e1e2e 0%, #2a1a3e 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}>
              <div
                style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #7C3AED, #C084FC)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "32px",
                  color: "#fff",
                  fontWeight: 700,
                }}>
                {profile.nickname[0]}
              </div>
              {/* MBTI 뱃지 */}
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
            </div>

            {/* 프로필 정보 */}
            <div style={{ padding: "16px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "8px",
                  marginBottom: "4px",
                }}>
                <span
                  style={{ color: "#fff", fontSize: "18px", fontWeight: 700 }}>
                  {profile.nickname}
                </span>
                <span style={{ color: "#666", fontSize: "14px" }}>
                  {profile.age}세
                </span>
                <span style={{ color: "#555", fontSize: "13px" }}>
                  · {profile.location}
                </span>
              </div>

              <p
                style={{
                  color: "#888",
                  fontSize: "13px",
                  margin: "0 0 12px",
                  lineHeight: 1.5,
                }}>
                {profile.bio}
              </p>

              {/* 태그 */}
              <div
                style={{
                  display: "flex",
                  gap: "6px",
                  flexWrap: "wrap",
                  marginBottom: "14px",
                }}>
                <span
                  style={{
                    fontSize: "11px",
                    padding: "3px 10px",
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
                      padding: "3px 10px",
                      borderRadius: "20px",
                      background: "#1a1a1a",
                      border: "1px solid #2a2a2a",
                      color: "#888",
                    }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* AI 궁합 분석 */}
              <div
                style={{
                  background: "#1a1230",
                  border: "1px solid #3b1f7a",
                  borderRadius: "12px",
                  padding: "10px 12px",
                  marginBottom: "14px",
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
                    color: "#999",
                    fontSize: "12px",
                    margin: 0,
                    lineHeight: 1.5,
                  }}>
                  감성적 교류를 중시하는 두 분의 성향이 잘 맞아요. 대화가 끊이지
                  않을 것 같아요.
                </p>
              </div>

              {/* 액션 버튼 */}
              <div style={{ display: "flex", gap: "10px" }}>
                <button
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
                  👎 패스
                </button>
                <button
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: "#2d1f4e",
                    border: "1px solid #7C3AED",
                    borderRadius: "12px",
                    color: "#C084FC",
                    fontSize: "14px",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}>
                  💜 좋아요
                </button>
              </div>
            </div>
          </div>
        ))}
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
          padding: "12px 0 20px",
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
            <span style={{ fontSize: "20px" }}>{icon}</span>
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
