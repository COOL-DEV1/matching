import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../../lib/supabase";

type SignUpForm = {
  email: string;
  password: string;
  nickname: string;
  birth_date: string;
  gender: "male" | "female";
};

export function SignUp() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>();

  const onSubmit = async (data: SignUpForm) => {
    // 만 19세 이상 확인
    const birth = new Date(data.birth_date);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    const realAge =
      monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())
        ? age - 1
        : age;

    if (realAge < 19) {
      setMessage("만 19세 이상만 가입할 수 있습니다.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          nickname: data.nickname,
          birth_date: data.birth_date,
          gender: data.gender,
        },
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("이메일을 확인해주세요. 인증 링크를 보내드렸습니다.");
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
            fontSize: "28px",
            fontWeight: 700,
            marginBottom: "8px",
          }}>
          Sp<span style={{ color: "#C084FC" }}>a</span>rk
        </h1>
        <p style={{ color: "#666", fontSize: "14px", marginBottom: "32px" }}>
          가볍게 시작하는 이성 매칭
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

          <div style={{ marginBottom: "16px" }}>
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
              {...register("password", {
                required: "비밀번호를 입력해주세요",
                minLength: { value: 6, message: "6자 이상 입력해주세요" },
              })}
              type="password"
              placeholder="6자 이상"
              style={inputStyle}
            />
            {errors.password && (
              <p style={errorStyle}>{errors.password.message}</p>
            )}
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                color: "#aaa",
                fontSize: "13px",
                display: "block",
                marginBottom: "6px",
              }}>
              닉네임
            </label>
            <input
              {...register("nickname", { required: "닉네임을 입력해주세요" })}
              type="text"
              placeholder="닉네임"
              style={inputStyle}
            />
            {errors.nickname && (
              <p style={errorStyle}>{errors.nickname.message}</p>
            )}
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                color: "#aaa",
                fontSize: "13px",
                display: "block",
                marginBottom: "6px",
              }}>
              생년월일
            </label>
            <input
              {...register("birth_date", {
                required: "생년월일을 입력해주세요",
              })}
              type="date"
              style={inputStyle}
            />
            {errors.birth_date && (
              <p style={errorStyle}>{errors.birth_date.message}</p>
            )}
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                color: "#aaa",
                fontSize: "13px",
                display: "block",
                marginBottom: "8px",
              }}>
              성별
            </label>
            <div style={{ display: "flex", gap: "10px" }}>
              <label style={genderLabelStyle}>
                <input
                  {...register("gender", { required: true })}
                  type="radio"
                  value="male"
                  style={{ display: "none" }}
                />
                <span>남성</span>
              </label>
              <label style={genderLabelStyle}>
                <input
                  {...register("gender", { required: true })}
                  type="radio"
                  value="female"
                  style={{ display: "none" }}
                />
                <span>여성</span>
              </label>
            </div>
          </div>

          {message && (
            <p
              style={{
                color: message.includes("확인") ? "#22c55e" : "#ef4444",
                fontSize: "13px",
                marginBottom: "16px",
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
            {loading ? "처리 중..." : "가입하기"}
          </button>

          <p
            style={{
              color: "#555",
              fontSize: "13px",
              textAlign: "center",
              marginTop: "20px",
            }}>
            이미 계정이 있으신가요?{" "}
            <a
              href="/login"
              style={{ color: "#C084FC", textDecoration: "none" }}>
              로그인
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

const genderLabelStyle: React.CSSProperties = {
  flex: 1,
  padding: "12px",
  background: "#1a1a1a",
  border: "1px solid #2a2a2a",
  borderRadius: "10px",
  color: "#aaa",
  fontSize: "14px",
  textAlign: "center",
  cursor: "pointer",
};
