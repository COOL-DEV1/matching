import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../../lib/supabase";

type LoginForm = {
  email: string;
  password: string;
};

export function Login() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setMessage("");

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        setMessage("이메일 또는 비밀번호가 올바르지 않아요.");
      } else if (error.message.includes("Email not confirmed")) {
        setMessage("이메일 인증이 필요해요. 받은 편지함을 확인해주세요.");
      } else {
        setMessage(error.message);
      }
      setLoading(false);
      return;
    }

    // 이메일 인증 여부 체크
    if (!authData.user?.email_confirmed_at) {
      await supabase.auth.signOut();
      setMessage("이메일 인증이 필요해요. 받은 편지함을 확인해주세요.");
      setLoading(false);
      return;
    }

    window.location.href = "/";
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
            fontSize: "28px",
            fontWeight: 700,
            marginBottom: "8px",
          }}>
          Sp<span style={{ color: "#C084FC" }}>a</span>rk
        </h1>
        <p style={{ color: "#666", fontSize: "14px", marginBottom: "32px" }}>
          다시 만나서 반가워요
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom: "16px" }}>
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
              {...register("email", { required: "이메일을 입력해주세요" })}
              type="email"
              placeholder="example@email.com"
              style={inputStyle}
            />
            {errors.email && <p style={errorStyle}>{errors.email.message}</p>}
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                color: "#aaa",
                fontSize: "13px",
                display: "block",
                marginBottom: "6px",
              }}>
              비밀번호
            </label>
            <input
              {...register("password", { required: "비밀번호를 입력해주세요" })}
              type="password"
              placeholder="비밀번호"
              style={inputStyle}
            />
            {errors.password && (
              <p style={errorStyle}>{errors.password.message}</p>
            )}
          </div>

          {message && (
            <p
              style={{
                color: "#ef4444",
                fontSize: "13px",
                marginBottom: "16px",
                lineHeight: 1.5,
              }}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: "#7C3AED",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              fontSize: "15px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}>
            {loading ? "로그인 중..." : "로그인"}
          </button>

          <p
            style={{
              color: "#555",
              fontSize: "13px",
              textAlign: "center",
              marginTop: "20px",
            }}>
            아직 계정이 없으신가요?{" "}
            <a
              href="/signup"
              style={{ color: "#C084FC", textDecoration: "none" }}>
              회원가입
            </a>
          </p>
        </form>
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

const errorStyle: React.CSSProperties = {
  color: "#ef4444",
  fontSize: "12px",
  marginTop: "4px",
};
