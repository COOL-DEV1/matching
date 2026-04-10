import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../common/hooks/useAuth";

type Message = {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
};

type MatchedUser = {
  id: string;
  nickname: string;
  mbti: string;
  birth_date: string;
};

export function Chat() {
  const { matchId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [matchedUser, setMatchedUser] = useState<MatchedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!matchId || !user) return;
    fetchMessages();
    fetchMatchedUser();

    const channel = supabase
      .channel(`chat:${matchId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("match_id", matchId)
      .order("created_at", { ascending: true });
    setMessages(data || []);
    setLoading(false);
  };

  const fetchMatchedUser = async () => {
    const { data: match } = await supabase
      .from("matches")
      .select("user1, user2")
      .eq("id", matchId)
      .single();

    if (!match) return;
    const otherId = match.user1 === user?.id ? match.user2 : match.user1;

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, nickname, mbti, birth_date")
      .eq("id", otherId)
      .single();

    setMatchedUser(profile);
  };

  const sendMessage = async () => {
    if (!input.trim() || !user || !matchId) return;
    const content = input.trim();
    setInput("");

    const { data, error } = await supabase
      .from("messages")
      .insert({
        match_id: matchId,
        sender_id: user.id,
        content,
      })
      .select()
      .single();

    if (error) {
      console.error("메시지 전송 에러:", error);
      return;
    }

    // 낙관적 업데이트 - 바로 화면에 추가
    if (data) {
      setMessages((prev) => [...prev, data as Message]);
    }
  };

  const getAge = (birth: string) =>
    new Date().getFullYear() - new Date(birth).getFullYear();

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        maxWidth: "430px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
      }}>
      {/* 헤더 */}
      <div
        style={{
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          borderBottom: "1px solid #1a1a1a",
          background: "#0a0a0a",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}>
        <button
          onClick={() => navigate("/")}
          style={{
            background: "none",
            border: "none",
            color: "#888",
            fontSize: "20px",
            cursor: "pointer",
            padding: "4px",
          }}>
          ←
        </button>

        {matchedUser && (
          <>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #5b21b6, #C084FC)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                color: "#fff",
                fontWeight: 700,
                flexShrink: 0,
              }}>
              {matchedUser.nickname[0]}
            </div>
            <div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span
                  style={{ color: "#fff", fontSize: "15px", fontWeight: 600 }}>
                  {matchedUser.nickname}
                </span>
                <span style={{ color: "#666", fontSize: "13px" }}>
                  {getAge(matchedUser.birth_date)}세
                </span>
              </div>
              {matchedUser.mbti && (
                <span
                  style={{
                    fontSize: "11px",
                    padding: "1px 7px",
                    borderRadius: "10px",
                    background: "#2d1f4e",
                    border: "1px solid #5b21b6",
                    color: "#C084FC",
                  }}>
                  {matchedUser.mbti}
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {/* 메시지 목록 */}
      <div
        style={{
          flex: 1,
          padding: "16px 20px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}>
        {loading && (
          <div style={{ textAlign: "center", padding: "40px", color: "#555" }}>
            <div style={{ color: "#C084FC", fontSize: "24px" }}>✦</div>
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p style={{ color: "#555", fontSize: "14px" }}>
              첫 메시지를 보내봐요 💜
            </p>
          </div>
        )}

        {messages.map((msg) => {
          const isMine = msg.sender_id === user?.id;
          return (
            <div
              key={msg.id}
              style={{
                display: "flex",
                justifyContent: isMine ? "flex-end" : "flex-start",
                alignItems: "flex-end",
                gap: "6px",
              }}>
              {!isMine && (
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: "linear-gradient(135deg, #5b21b6, #C084FC)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    color: "#fff",
                    fontWeight: 700,
                  }}>
                  {matchedUser?.nickname[0]}
                </div>
              )}
              <div style={{ maxWidth: "70%" }}>
                <div
                  style={{
                    padding: "10px 14px",
                    background: isMine ? "#5b21b6" : "#1a1a1a",
                    borderRadius: isMine
                      ? "18px 18px 4px 18px"
                      : "18px 18px 18px 4px",
                    color: isMine ? "#e9d5ff" : "#ccc",
                    fontSize: "14px",
                    lineHeight: 1.5,
                  }}>
                  {msg.content}
                </div>
                <div
                  style={{
                    color: "#444",
                    fontSize: "10px",
                    textAlign: isMine ? "right" : "left",
                    marginTop: "3px",
                  }}>
                  {formatTime(msg.created_at)}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* 입력창 */}
      <div
        style={{
          padding: "12px 16px 28px",
          borderTop: "1px solid #1a1a1a",
          background: "#0d0d0d",
          display: "flex",
          gap: "10px",
          alignItems: "flex-end",
        }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
          placeholder="메시지 입력..."
          style={{
            flex: 1,
            padding: "12px 16px",
            background: "#1a1a1a",
            border: "1px solid #2a2a2a",
            borderRadius: "24px",
            color: "#fff",
            fontSize: "14px",
            outline: "none",
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            background: input.trim() ? "#7C3AED" : "#1a1a1a",
            border: "none",
            cursor: input.trim() ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
            transition: "all 0.2s",
            flexShrink: 0,
          }}>
          →
        </button>
      </div>
    </div>
  );
}
