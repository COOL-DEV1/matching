import { useState, useEffect } from "react";
import { useAuth } from "../../common/hooks/useAuth";
import { supabase } from "../../lib/supabase";

type MatchedProfile = {
  profile: {
    id: string;
    nickname: string;
    birth_date: string;
    gender: string;
    location: string;
    mbti: string;
    bio: string;
    relationship_style: string;
  };
  score: number;
  matchId?: string;
};

const styleMap: Record<string, string> = {
  serious: "진지한 연애",
  casual: "캐주얼한 만남",
  thumb: "썸",
  open: "오픈 릴레이션십",
};

export function Home() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<MatchedProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoMatchedCount, setAutoMatchedCount] = useState(0);
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    if (user) runMatching();
  }, [user]);

  const runMatching = async () => {
    setLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/auto-match`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
        },
      );

      const data = await res.json();
      setMatches(data.matches || []);
      setAutoMatchedCount(data.autoMatchedCount || 0);
      if (data.autoMatchedCount > 0) setShowNotice(true);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const getAge = (birth: string) => {
    return new Date().getFullYear() - new Date(birth).getFullYear();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const scoreColor = (score: number) => {
    if (score >= 80) return "#22c55e";
    if (score >= 60) return "#C084FC";
    return "#888";
  };

  const scoreLabel = (score: number) => {
    if (score >= 80) return "최상 궁합";
    if (score >= 60) return "좋은 궁합";
    return "보통 궁합";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        maxWidth: "430px",
        margin: "0 auto",
      }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-20px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>

      {/* 매칭 알림 배너 */}
      {showNotice && (
        <div
          onClick={() => setShowNotice(false)}
          style={{
            position: "fixed",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: "430px",
            zIndex: 50,
            background: "linear-gradient(135deg, #5b21b6, #7C3AED)",
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            animation: "slideDown 0.4s ease",
            cursor: "pointer",
          }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "20px" }}>💜</span>
            <div>
              <p
                style={{
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 600,
                  margin: 0,
                }}>
                {autoMatchedCount}명과 자동 매칭됐어요!
              </p>
              <p style={{ color: "#e9d5ff", fontSize: "12px", margin: 0 }}>
                바로 채팅을 시작해보세요
              </p>
            </div>
          </div>
          <span style={{ color: "#e9d5ff", fontSize: "18px" }}>✕</span>
        </div>
      )}

      {/* 상단 네비게이션 */}
      <div
        style={{
          padding: `${showNotice ? "60px" : "16px"} 20px 12px`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #1a1a1a",
          position: "sticky",
          top: 0,
          background: "#0a0a0a",
          zIndex: 10,
          transition: "padding 0.3s",
        }}>
        <div>
          <h1
            style={{
              color: "#fff",
              fontSize: "22px",
              fontWeight: 700,
              margin: 0,
            }}>
            Sp<span style={{ color: "#C084FC" }}>a</span>rk
          </h1>
          <p style={{ color: "#555", fontSize: "12px", margin: 0 }}>
            {loading ? "매칭 중..." : `${matches.length}명 매칭됨`}
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={runMatching}
            style={{
              padding: "8px 14px",
              background: "#1a1a1a",
              border: "1px solid #2a2a2a",
              borderRadius: "20px",
              color: "#888",
              fontSize: "12px",
              cursor: "pointer",
            }}>
            🔄 새로고침
          </button>
          <div
            onClick={() => (window.location.href = "/mypage")}
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

      {/* 로딩 */}
      {loading && (
        <div style={{ padding: "60px 20px", textAlign: "center" }}>
          <div
            style={{
              color: "#C084FC",
              fontSize: "32px",
              marginBottom: "16px",
            }}>
            ✦
          </div>
          <p style={{ color: "#666", fontSize: "14px" }}>
            조건에 맞는 상대를 찾고 있어요...
          </p>
        </div>
      )}

      {/* 매칭 없음 */}
      {!loading && matches.length === 0 && (
        <div style={{ padding: "60px 20px", textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
          <p
            style={{
              color: "#fff",
              fontSize: "16px",
              fontWeight: 600,
              marginBottom: "8px",
            }}>
            아직 매칭된 상대가 없어요
          </p>
          <p style={{ color: "#666", fontSize: "14px", marginBottom: "24px" }}>
            더 많은 유저가 가입하면 자동으로 매칭돼요
          </p>
          <button
            onClick={runMatching}
            style={{
              padding: "12px 24px",
              background: "linear-gradient(135deg, #5b21b6, #7C3AED)",
              border: "none",
              borderRadius: "12px",
              color: "#fff",
              fontSize: "14px",
              cursor: "pointer",
            }}>
            다시 찾기
          </button>
        </div>
      )}

      {/* 매칭 목록 */}
      {!loading && matches.length > 0 && (
        <div style={{ padding: "16px 20px 100px" }}>
          {/* 자동 매칭된 사람들 */}
          {matches.filter((m) => m.matchId).length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "12px",
                }}>
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#22c55e",
                  }}
                />
                <span
                  style={{
                    color: "#22c55e",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}>
                  매칭 완료
                </span>
                <span style={{ color: "#444", fontSize: "12px" }}>
                  · 바로 채팅 가능
                </span>
              </div>
              {matches
                .filter((m) => m.matchId)
                .map((item, i) => (
                  <MatchCard
                    key={i}
                    item={item}
                    getAge={getAge}
                    scoreColor={scoreColor}
                    scoreLabel={scoreLabel}
                    isMatched={true}
                  />
                ))}
            </div>
          )}

          {/* 추천 목록 */}
          {matches.filter((m) => !m.matchId).length > 0 && (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "12px",
                }}>
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#C084FC",
                  }}
                />
                <span
                  style={{
                    color: "#C084FC",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}>
                  추천
                </span>
                <span style={{ color: "#444", fontSize: "12px" }}>
                  · 조건이 비슷한 상대
                </span>
              </div>
              {matches
                .filter((m) => !m.matchId)
                .map((item, i) => (
                  <MatchCard
                    key={i}
                    item={item}
                    getAge={getAge}
                    scoreColor={scoreColor}
                    scoreLabel={scoreLabel}
                    isMatched={false}
                  />
                ))}
            </div>
          )}
        </div>
      )}

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
            onClick={() => (window.location.href = path)}
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
                color: label === "홈" ? "#C084FC" : "#555",
              }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MatchCard({
  item,
  getAge,
  scoreColor,
  scoreLabel,
  isMatched,
}: {
  item: MatchedProfile;
  getAge: (b: string) => number;
  scoreColor: (s: number) => string;
  scoreLabel: (s: number) => string;
  isMatched: boolean;
}) {
  const p = item.profile;

  return (
    <div
      style={{
        background: "#111",
        border: `1px solid ${isMatched ? "#1a3a1a" : "#1e1e1e"}`,
        borderRadius: "18px",
        padding: "16px",
        marginBottom: "12px",
        animation: "fadeIn 0.4s ease",
      }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          marginBottom: "12px",
        }}>
        {/* 아바타 */}
        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            flexShrink: 0,
            background: isMatched
              ? "linear-gradient(135deg, #14532d, #22c55e)"
              : "linear-gradient(135deg, #5b21b6, #C084FC)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            color: "#fff",
            fontWeight: 700,
          }}>
          {p.nickname[0]}
        </div>

        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "3px",
            }}>
            <span style={{ color: "#fff", fontSize: "16px", fontWeight: 700 }}>
              {p.nickname}
            </span>
            <span style={{ color: "#666", fontSize: "13px" }}>
              {getAge(p.birth_date)}세
            </span>
            {p.mbti && (
              <span
                style={{
                  fontSize: "11px",
                  padding: "2px 8px",
                  borderRadius: "10px",
                  background: "#2d1f4e",
                  border: "1px solid #5b21b6",
                  color: "#C084FC",
                }}>
                {p.mbti}
              </span>
            )}
          </div>
          <span style={{ color: "#666", fontSize: "12px" }}>
            📍 {p.location}
          </span>
        </div>

        {/* 점수 */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              color: scoreColor(item.score),
              fontSize: "20px",
              fontWeight: 700,
            }}>
            {item.score}
          </div>
          <div style={{ color: scoreColor(item.score), fontSize: "10px" }}>
            {scoreLabel(item.score)}
          </div>
        </div>
      </div>

      {/* 소개 */}
      {p.bio && (
        <p
          style={{
            color: "#777",
            fontSize: "13px",
            margin: "0 0 12px",
            lineHeight: 1.6,
          }}>
          {p.bio}
        </p>
      )}

      {/* 태그 */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          flexWrap: "wrap",
          marginBottom: "14px",
        }}>
        {p.relationship_style && (
          <span
            style={{
              fontSize: "11px",
              padding: "3px 10px",
              borderRadius: "20px",
              background: "#1a1230",
              border: "1px solid #3b1f7a",
              color: "#C084FC",
            }}>
            {styleMap[p.relationship_style] || p.relationship_style}
          </span>
        )}
      </div>

      {/* 버튼 */}
      <button
        onClick={() => (window.location.href = `/chat/${item.matchId || ""}`)}
        style={{
          width: "100%",
          padding: "12px",
          background: isMatched
            ? "linear-gradient(135deg, #14532d, #16a34a)"
            : "linear-gradient(135deg, #5b21b6, #7C3AED)",
          border: "none",
          borderRadius: "12px",
          color: "#fff",
          fontSize: "14px",
          fontWeight: 600,
          cursor: "pointer",
        }}>
        {isMatched ? "💬 채팅 시작" : "💜 매칭 신청"}
      </button>
    </div>
  );
}
