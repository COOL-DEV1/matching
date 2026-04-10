import { useState } from "react";
import { supabase } from "../../lib/supabase";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setMessage("이메일 전송에 실패했어요. 다시 시도해주세요.");
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "40px 32px",
          background: "#111",
          borderRadius: "20px",
          border: "1px solid #222",
        }}>
        <a
          href="/login"
          style={{
            color: "#666",
            fontSize: "13px",
            textDecoration: "none",
            display: "inline-block",
            marginBottom: "24px",
          }}>
          ← 로그인으로
        </a>

        <h1
          style={{
            color: "#fff",
            fontSize: "24px",
            fontWeight: 700,
            marginBottom: "8px",
          }}>
          비밀번호 찾기
        </h1>

        {!sent ? (
          <>
            <p
              style={{ color: "#666", fontSize: "14px", marginBottom: "28px" }}>
              가입한 이메일을 입력하면 재설정 링크를 보내드려요
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    color: "#aaa",
                    fontSize: "13px",
                    display: "block",
                    marginBottom: "6px",
                  }}>
                  이메일
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    background: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    borderRadius: "10px",
                    color: "#fff",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {message && (
                <p
                  style={{
                    color: "#ef4444",
                    fontSize: "13px",
                    marginBottom: "16px",
                  }}>
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !email}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: loading || !email ? "#1a1a1a" : "#7C3AED",
                  color: loading || !email ? "#444" : "#fff",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "15px",
                  fontWeight: 600,
                  cursor: loading || !email ? "not-allowed" : "pointer",
                }}>
                {loading ? "전송 중..." : "재설정 링크 보내기"}
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📧</div>
            <p
              style={{
                color: "#fff",
                fontSize: "16px",
                fontWeight: 600,
                marginBottom: "8px",
              }}>
              이메일을 보냈어요
            </p>
            <p
              style={{
                color: "#666",
                fontSize: "14px",
                lineHeight: 1.6,
                marginBottom: "24px",
              }}>
              {email} 로 재설정 링크를 보냈어요.
              <br />
              받은 편지함을 확인해주세요.
            </p>
            <a
              href="/login"
              style={{
                display: "inline-block",
                padding: "12px 24px",
                background: "#7C3AED",
                borderRadius: "12px",
                color: "#fff",
                fontSize: "14px",
                textDecoration: "none",
              }}>
              로그인으로 돌아가기
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
