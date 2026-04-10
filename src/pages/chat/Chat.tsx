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
  const [showMenu, setShowMenu] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportTarget, setReportTarget] = useState<Message | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [reportDone, setReportDone] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!matchId || !user) return;
    fetchMessages();
    fetchMatchedUser();

    const interval = setInterval(() => {
      fetchMessages();
    }, 3000);

    return () => clearInterval(interval);
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
    const raw = input.trim();
    const content = filterMessage(raw);
    setInput("");

    const { data, error } = await supabase
      .from("messages")
      .insert({ match_id: matchId, sender_id: user.id, content })
      .select()
      .single();

    if (error) {
      console.error(error);
      return;
    }
    if (data) setMessages((prev) => [...prev, data as Message]);
  };

  const filterMessage = (text: string): string => {
    const badWords = [
      "씨발",
      "시발",
      "씨바",
      "시바",
      "ㅅㅂ",
      "개새끼",
      "개새",
      "새끼",
      "ㅅㄲ",
      "지랄",
      "ㅈㄹ",
      "병신",
      "ㅂㅅ",
      "미친",
      "ㅁㅊ",
      "꺼져",
      "닥쳐",
      "좆",
      "ㅈ같",
      "창녀",
      "보지",
      "자지",
      "죽어",
      "죽을",
      "찐따",
      "장애",
    ];

    let filtered = text;
    badWords.forEach((word) => {
      const regex = new RegExp(word, "gi");
      filtered = filtered.replace(regex, "잇힝");
    });
    return filtered;
  };

  const handleEndChat = async () => {
    const confirmed = window.confirm(
      "대화를 종료하시겠어요? 매칭이 해제되고 채팅 내역이 삭제됩니다.",
    );
    if (!confirmed) return;

    await supabase.from("messages").delete().eq("match_id", matchId);
    await supabase
      .from("matches")
      .update({ is_active: false })
      .eq("id", matchId);
    navigate("/chat");
  };

  const handleReportMessage = async () => {
    if (!reportReason || !reportTarget || !matchedUser) return;

    await supabase.from("reports").insert({
      reporter_id: user?.id,
      reported_id: matchedUser.id,
      reason: reportReason,
      description: `메시지 신고: "${reportTarget.content}"`,
    });

    setReportDone(true);
    setTimeout(() => {
      setShowReport(false);
      setReportDone(false);
      setReportReason("");
      setReportTarget(null);
    }, 2000);
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
      {/* 메뉴 */}
      {showMenu && (
        <div
          onClick={() => setShowMenu(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "rgba(0,0,0,0.5)",
          }}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              top: "60px",
              right: "20px",
              background: "#1a1a1a",
              border: "1px solid #2a2a2a",
              borderRadius: "14px",
              overflow: "hidden",
              minWidth: "180px",
            }}>
            <button
              onClick={() => {
                setShowMenu(false);
                navigate(`/profile/${matchedUser?.id}`);
              }}
              style={{
                width: "100%",
                padding: "14px 16px",
                background: "none",
                border: "none",
                borderBottom: "1px solid #2a2a2a",
                color: "#fff",
                fontSize: "14px",
                cursor: "pointer",
                textAlign: "left",
              }}>
              👤 프로필 보기
            </button>
            <button
              onClick={() => {
                setShowMenu(false);
                handleEndChat();
              }}
              style={{
                width: "100%",
                padding: "14px 16px",
                background: "none",
                border: "none",
                borderBottom: "1px solid #2a2a2a",
                color: "#ef4444",
                fontSize: "14px",
                cursor: "pointer",
                textAlign: "left",
              }}>
              💔 대화 종료
            </button>
            <button
              onClick={() => {
                setShowMenu(false);
                setShowReport(true);
              }}
              style={{
                width: "100%",
                padding: "14px 16px",
                background: "none",
                border: "none",
                color: "#888",
                fontSize: "14px",
                cursor: "pointer",
                textAlign: "left",
              }}>
              🚨 신고하기
            </button>
          </div>
        </div>
      )}

      {/* 메시지 신고 팝업 */}
      {showReport && (
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
            {reportDone ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>✅</div>
                <p
                  style={{
                    color: "#22c55e",
                    fontSize: "15px",
                    fontWeight: 600,
                  }}>
                  신고가 접수됐어요
                </p>
              </div>
            ) : (
              <>
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
                  style={{
                    color: "#666",
                    fontSize: "13px",
                    marginBottom: "20px",
                  }}>
                  신고 사유를 선택해주세요
                </p>

                {[
                  { v: "harassment", l: "욕설 / 성희롱" },
                  { v: "spam", l: "스팸 / 광고" },
                  { v: "fake_profile", l: "허위 정보" },
                  { v: "inappropriate_photo", l: "부적절한 내용" },
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

                <div
                  style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                  <button
                    onClick={() => {
                      setShowReport(false);
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
                    onClick={handleReportMessage}
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
              </>
            )}
          </div>
        </div>
      )}

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
          onClick={() => navigate("/chat")}
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
            <div style={{ flex: 1 }}>
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

        {/* 메뉴 버튼 */}
        <button
          onClick={() => setShowMenu(true)}
          style={{
            background: "none",
            border: "none",
            color: "#888",
            fontSize: "20px",
            cursor: "pointer",
            padding: "4px",
          }}>
          ⋮
        </button>
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
          <div style={{ textAlign: "center", padding: "40px" }}>
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
                  onContextMenu={(e) => {
                    e.preventDefault();
                    if (!isMine) {
                      setReportTarget(msg);
                      setShowReport(true);
                    }
                  }}
                  style={{
                    padding: "10px 14px",
                    background: isMine ? "#5b21b6" : "#1a1a1a",
                    borderRadius: isMine
                      ? "18px 18px 4px 18px"
                      : "18px 18px 18px 4px",
                    color: isMine ? "#e9d5ff" : "#ccc",
                    fontSize: "14px",
                    lineHeight: 1.5,
                    cursor: !isMine ? "context-menu" : "default",
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
