import { useState } from "react";
import { supabase } from "../../lib/supabase";

export function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setMessage("비밀번호가 일치하지 않아요.");
      return;
    }
    if (password.length < 6) {
      setMessage("비밀번호는 6자 이상이어야 해요.");
      return;
    }
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage("비밀번호 변경에 실패했어요. 다시 시도해주세요.");
    } else {
      setDone(true);
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
        <h1
          style={{
            color: "#fff",
            fontSize: "24px",
            fontWeight: 700,
            marginBottom: "8px",
          }}>
          새 비밀번호 설정
        </h1>

        {!done ? (
          <>
            <p
              style={{ color: "#666", fontSize: "14px", marginBottom: "28px" }}>
              새로운 비밀번호를 입력해주세요
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    color: "#aaa",
                    fontSize: "13px",
                    display: "block",
                    marginBottom: "6px",
                  }}>
                  새 비밀번호
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="6자 이상"
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    color: "#aaa",
                    fontSize: "13px",
                    display: "block",
                    marginBottom: "6px",
                  }}>
                  비밀번호 확인
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="비밀번호 재입력"
                  style={inputStyle}
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
                disabled={loading || !password || !confirm}
                style={{
                  width: "100%",
                  padding: "14px",
                  background:
                    loading || !password || !confirm ? "#1a1a1a" : "#7C3AED",
                  color: loading || !password || !confirm ? "#444" : "#fff",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "15px",
                  fontWeight: 600,
                  cursor:
                    loading || !password || !confirm
                      ? "not-allowed"
                      : "pointer",
                }}>
                {loading ? "변경 중..." : "비밀번호 변경"}
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
            <p
              style={{
                color: "#fff",
                fontSize: "16px",
                fontWeight: 600,
                marginBottom: "8px",
              }}>
              비밀번호가 변경됐어요
            </p>
            <p
              style={{ color: "#666", fontSize: "14px", marginBottom: "24px" }}>
              새 비밀번호로 로그인해주세요
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
              로그인하기
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  background: "#1a1a1a",
  border: "1px solid #2a2a2a",
  borderRadius: "10px",
  color: "#fff",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
};
