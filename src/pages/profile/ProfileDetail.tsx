import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../common/hooks/useAuth";

type Profile = {
  id: string;
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

export function ProfileDetail() {
  const { userId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [reporting, setReporting] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDone, setReportDone] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchProfile();
      checkMatch();
    }
  }, [userId]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    setProfile(data);
    setLoading(false);
  };

  const checkMatch = async () => {
    const { data } = await supabase
      .from("matches")
      .select("id")
      .or(
        `and(user1.eq.${user?.id},user2.eq.${userId}),and(user1.eq.${userId},user2.eq.${user?.id})`,
      )
      .single();
    if (data) setMatchId(data.id);
  };

  const handleReport = async () => {
    if (!reportReason) return;
    await supabase.from("reports").insert({
      reporter_id: user?.id,
      reported_id: userId,
      reason: reportReason,
    });
    setReportDone(true);
    setReporting(false);
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

  if (!profile) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0a0a0a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <p style={{ color: "#666" }}>프로필을 찾을 수 없어요</p>
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
      {/* 신고 팝업 */}
      {reporting && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}>
          <div
            style={{
              background: "#111",
              border: "1px solid #2a2a2a",
              borderRadius: "20px",
              padding: "24px",
              width: "100%",
              maxWidth: "360px",
            }}>
            <h3
              style={{
                color: "#fff",
                fontSize: "18px",
                fontWeight: 700,
                marginBottom: "8px",
              }}>
              신고하기
            </h3>
            <p
              style={{ color: "#666", fontSize: "13px", marginBottom: "20px" }}>
              신고 사유를 선택해주세요
            </p>

            {[
              { v: "fake_profile", l: "허위 프로필" },
              { v: "harassment", l: "욕설 / 성희롱" },
              { v: "spam", l: "스팸 / 광고" },
              { v: "inappropriate_photo", l: "부적절한 사진" },
              { v: "underage", l: "미성년자 의심" },
              { v: "other", l: "기타" },
            ].map(({ v, l }) => (
              <button
                key={v}
                onClick={() => setReportReason(v)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  marginBottom: "8px",
                  background: reportReason === v ? "#2d1f4e" : "#1a1a1a",
                  border: `1px solid ${reportReason === v ? "#7C3AED" : "#2a2a2a"}`,
                  borderRadius: "10px",
                  color: reportReason === v ? "#C084FC" : "#888",
                  fontSize: "14px",
                  cursor: "pointer",
                  textAlign: "left",
                }}>
                {l}
              </button>
            ))}

            <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
              <button
                onClick={() => {
                  setReporting(false);
                  setReportReason("");
                }}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "#1a1a1a",
                  border: "1px solid #2a2a2a",
                  borderRadius: "10px",
                  color: "#888",
                  fontSize: "14px",
                  cursor: "pointer",
                }}>
                취소
              </button>
              <button
                onClick={handleReport}
                disabled={!reportReason}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: reportReason ? "#ef4444" : "#1a1a1a",
                  border: "none",
                  borderRadius: "10px",
                  color: reportReason ? "#fff" : "#444",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: reportReason ? "pointer" : "not-allowed",
                }}>
                신고
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 헤더 */}
      <div
        style={{
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #1a1a1a",
          position: "sticky",
          top: 0,
          background: "#0a0a0a",
          zIndex: 10,
        }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "none",
            border: "none",
            color: "#888",
            fontSize: "20px",
            cursor: "pointer",
          }}>
          ←
        </button>
        <span style={{ color: "#fff", fontSize: "16px", fontWeight: 600 }}>
          프로필
        </span>
        <button
          onClick={() => setReporting(true)}
          style={{
            background: "none",
            border: "none",
            color: "#555",
            fontSize: "13px",
            cursor: "pointer",
          }}>
          신고
        </button>
      </div>

      <div style={{ padding: "24px 20px 100px" }}>
        {/* 프로필 카드 */}
        <div
          style={{
            background: "#111",
            border: "1px solid #1e1e1e",
            borderRadius: "20px",
            padding: "28px 24px",
            textAlign: "center",
            marginBottom: "16px",
          }}>
          <div
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              margin: "0 auto 16px",
              background: "linear-gradient(135deg, #5b21b6, #C084FC)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              color: "#fff",
              fontWeight: 700,
            }}>
            {profile.nickname[0]}
          </div>

          <h2
            style={{
              color: "#fff",
              fontSize: "22px",
              fontWeight: 700,
              margin: "0 0 6px",
            }}>
            {profile.nickname}
          </h2>
          <p style={{ color: "#666", fontSize: "14px", margin: "0 0 14px" }}>
            {getAge(profile.birth_date)}세 · {profile.location}
          </p>

          {profile.mbti && (
            <span
              style={{
                display: "inline-block",
                fontSize: "13px",
                padding: "4px 14px",
                borderRadius: "20px",
                background: "#2d1f4e",
                border: "1px solid #5b21b6",
                color: "#C084FC",
                marginBottom: "14px",
              }}>
              {profile.mbti}
            </span>
          )}

          {profile.bio && (
            <p
              style={{
                color: "#888",
                fontSize: "14px",
                lineHeight: 1.7,
                margin: 0,
              }}>
              {profile.bio}
            </p>
          )}
        </div>

        {/* 상세 정보 */}
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
            상세 정보
          </h3>
          {[
            {
              label: "연애 스타일",
              value: profile.relationship_style
                ? styleMap[profile.relationship_style]
                : "-",
            },
            {
              label: "흡연",
              value: profile.smoking ? smokingMap[profile.smoking] : "-",
            },
            {
              label: "음주",
              value: profile.drinking ? drinkingMap[profile.drinking] : "-",
            },
            {
              label: "키",
              value: profile.height ? `${profile.height}cm` : "-",
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
              <span style={{ color: "#666", fontSize: "14px" }}>{label}</span>
              <span style={{ color: "#fff", fontSize: "14px" }}>{value}</span>
            </div>
          ))}
        </div>

        {/* 신고 완료 메시지 */}
        {reportDone && (
          <div
            style={{
              background: "#1a1a1a",
              border: "1px solid #2a2a2a",
              borderRadius: "12px",
              padding: "12px 16px",
              marginBottom: "16px",
              textAlign: "center",
            }}>
            <p style={{ color: "#22c55e", fontSize: "13px", margin: 0 }}>
              ✓ 신고가 접수됐어요. 검토 후 조치할게요.
            </p>
          </div>
        )}

        {/* 채팅 버튼 */}
        {matchId && (
          <button
            onClick={() => navigate(`/chat/${matchId}`)}
            style={{
              width: "100%",
              padding: "16px",
              background: "linear-gradient(135deg, #5b21b6, #7C3AED)",
              border: "none",
              borderRadius: "14px",
              color: "#fff",
              fontSize: "16px",
              fontWeight: 600,
              cursor: "pointer",
            }}>
            💬 채팅하기
          </button>
        )}
      </div>
    </div>
  );
}
