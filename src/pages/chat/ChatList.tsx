import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../common/hooks/useAuth";

type MatchItem = {
  id: string;
  otherUser: {
    id: string;
    nickname: string;
    mbti: string;
    birth_date: string;
  };
  lastMessage: string;
  lastTime: string;
  unread: number;
};

export function ChatList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchMatches();
  }, [user]);

  const fetchMatches = async () => {
    const { data: matchData } = await supabase
      .from("matches")
      .select("*")
      .or(`user1.eq.${user?.id},user2.eq.${user?.id}`)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (!matchData) {
      setLoading(false);
      return;
    }

    const items: MatchItem[] = [];
    for (const match of matchData) {
      const otherId = match.user1 === user?.id ? match.user2 : match.user1;

      const { data: profile } = await supabase
        .from("profiles")
        .select("id, nickname, mbti, birth_date")
        .eq("id", otherId)
        .single();

      const { data: lastMsg } = await supabase
        .from("messages")
        .select("content, created_at, is_read, sender_id")
        .eq("match_id", match.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      const { count } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("match_id", match.id)
        .eq("is_read", false)
        .neq("sender_id", user?.id);

      if (profile) {
        items.push({
          id: match.id,
          otherUser: profile,
          lastMessage: lastMsg?.content || "매칭됐어요! 먼저 인사해봐요 💜",
          lastTime: lastMsg?.created_at || match.created_at,
          unread: count || 0,
        });
      }
    }

    setMatches(items);
    setLoading(false);
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return "방금";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}분 전`;
    if (diff < 86400000)
      return `${d.getHours()}:${d.getMinutes().toString().padStart(2, "0")}`;
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  const getAge = (birth: string) =>
    new Date().getFullYear() - new Date(birth).getFullYear();

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
          채팅
        </h1>
        <p style={{ color: "#555", fontSize: "12px", margin: "2px 0 0" }}>
          {matches.length}개의 대화
        </p>
      </div>

      {/* 로딩 */}
      {loading && (
        <div style={{ padding: "60px", textAlign: "center" }}>
          <div style={{ color: "#C084FC", fontSize: "24px" }}>✦</div>
        </div>
      )}

      {/* 채팅 없음 */}
      {!loading && matches.length === 0 && (
        <div style={{ padding: "60px 20px", textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>💬</div>
          <p
            style={{
              color: "#fff",
              fontSize: "16px",
              fontWeight: 600,
              marginBottom: "8px",
            }}>
            아직 매칭된 상대가 없어요
          </p>
          <p style={{ color: "#666", fontSize: "14px" }}>
            홈에서 매칭을 기다려봐요
          </p>
        </div>
      )}

      {/* 채팅 목록 */}
      <div style={{ padding: "8px 0 100px" }}>
        {matches.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(`/chat/${item.id}`)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "14px 20px",
              cursor: "pointer",
              borderBottom: "1px solid #111",
              transition: "background 0.2s",
            }}>
            {/* 아바타 */}
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                flexShrink: 0,
                background: "linear-gradient(135deg, #5b21b6, #C084FC)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                color: "#fff",
                fontWeight: 700,
              }}>
              {item.otherUser.nickname[0]}
            </div>

            {/* 정보 */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "4px",
                }}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span
                    style={{
                      color: "#fff",
                      fontSize: "15px",
                      fontWeight: 600,
                    }}>
                    {item.otherUser.nickname}
                  </span>
                  <span style={{ color: "#555", fontSize: "12px" }}>
                    {getAge(item.otherUser.birth_date)}세
                  </span>
                </div>
                <span style={{ color: "#444", fontSize: "11px" }}>
                  {formatTime(item.lastTime)}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                <p
                  style={{
                    color: "#666",
                    fontSize: "13px",
                    margin: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "220px",
                  }}>
                  {item.lastMessage}
                </p>
                {item.unread > 0 && (
                  <div
                    style={{
                      minWidth: "18px",
                      height: "18px",
                      borderRadius: "9px",
                      background: "#7C3AED",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      color: "#fff",
                      fontWeight: 600,
                      padding: "0 5px",
                    }}>
                    {item.unread}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 하단 네비게이션 */}
      <BottomNav active="chat" />
    </div>
  );
}

function BottomNav({ active }: { active: string }) {
  const navigate = useNavigate();
  return (
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
        { icon: "🏠", label: "홈", path: "/home" },
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
              color: active === label.toLowerCase() ? "#C084FC" : "#555",
            }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
