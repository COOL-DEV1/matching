import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export function Landing() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        window.location.href = "/home";
      }
    });
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        overflowX: "hidden",
      }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(30px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.5 } }
        @keyframes float { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
        .fade-up { animation: fadeUp 0.8s ease forwards; }
        .fade-up-2 { animation: fadeUp 0.8s ease 0.2s forwards; opacity: 0; }
        .fade-up-3 { animation: fadeUp 0.8s ease 0.4s forwards; opacity: 0; }
        .fade-up-4 { animation: fadeUp 0.8s ease 0.6s forwards; opacity: 0; }
      `}</style>

      {/* 네비게이션 */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: scrollY > 50 ? "rgba(10,10,10,0.95)" : "transparent",
          borderBottom: scrollY > 50 ? "1px solid #1a1a1a" : "none",
          transition: "all 0.3s",
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
        <div style={{ display: "flex", gap: "10px" }}>
          <a
            href="/login"
            style={{
              padding: "8px 18px",
              background: "transparent",
              border: "1px solid #333",
              borderRadius: "20px",
              color: "#aaa",
              fontSize: "13px",
              textDecoration: "none",
            }}>
            로그인
          </a>
          <a
            href="/signup"
            style={{
              padding: "8px 18px",
              background: "#7C3AED",
              border: "none",
              borderRadius: "20px",
              color: "#fff",
              fontSize: "13px",
              textDecoration: "none",
              fontWeight: 600,
            }}>
            시작하기
          </a>
        </div>
      </nav>

      {/* 히어로 섹션 */}
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "120px 24px 60px",
          textAlign: "center",
          position: "relative",
        }}>
        {/* 배경 glow */}
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          className="fade-up"
          style={{
            display: "inline-block",
            background: "#1a1230",
            border: "1px solid #3b1f7a",
            borderRadius: "20px",
            padding: "6px 16px",
            marginBottom: "24px",
          }}>
          <span style={{ color: "#C084FC", fontSize: "13px" }}>
            ✦ 새로운 만남의 시작
          </span>
        </div>

        <h2
          className="fade-up-2"
          style={{
            color: "#fff",
            fontSize: "clamp(36px, 8vw, 64px)",
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: "20px",
            letterSpacing: "-1px",
          }}>
          가볍게 시작하는
          <br />
          <span style={{ color: "#C084FC" }}>이성 매칭</span>
        </h2>

        <p
          className="fade-up-3"
          style={{
            color: "#888",
            fontSize: "clamp(14px, 3vw, 18px)",
            lineHeight: 1.7,
            marginBottom: "40px",
            maxWidth: "480px",
          }}>
          복잡한 과정 없이 간단하게 가입하고
          <br />
          AI가 분석한 궁합으로 딱 맞는 상대를 만나보세요
        </p>

        <div
          className="fade-up-4"
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}>
          <a
            href="/signup"
            style={{
              padding: "16px 36px",
              background: "linear-gradient(135deg, #5b21b6, #7C3AED)",
              border: "none",
              borderRadius: "14px",
              color: "#fff",
              fontSize: "16px",
              fontWeight: 700,
              textDecoration: "none",
              display: "inline-block",
            }}>
            무료로 시작하기 →
          </a>
          <a
            href="/login"
            style={{
              padding: "16px 36px",
              background: "transparent",
              border: "1px solid #333",
              borderRadius: "14px",
              color: "#aaa",
              fontSize: "16px",
              textDecoration: "none",
              display: "inline-block",
            }}>
            로그인
          </a>
        </div>

        {/* 통계 */}
        <div
          style={{
            display: "flex",
            gap: "40px",
            marginTop: "60px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}>
          {[
            { num: "무료", label: "가입비 없음" },
            { num: "AI", label: "궁합 분석" },
            { num: "100%", label: "익명 보호" },
          ].map(({ num, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div
                style={{ color: "#C084FC", fontSize: "28px", fontWeight: 700 }}>
                {num}
              </div>
              <div
                style={{ color: "#555", fontSize: "13px", marginTop: "4px" }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 기능 소개 */}
      <div
        style={{ padding: "80px 24px", maxWidth: "900px", margin: "0 auto" }}>
        <h3
          style={{
            color: "#fff",
            fontSize: "clamp(24px, 5vw, 36px)",
            fontWeight: 700,
            textAlign: "center",
            marginBottom: "48px",
          }}>
          왜 <span style={{ color: "#C084FC" }}>Spark</span> 인가요?
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
          }}>
          {[
            {
              icon: "🤖",
              title: "AI 자동 매칭",
              desc: "MBTI, 연애 성향, 라이프스타일을 분석해 가장 잘 맞는 상대를 자동으로 연결해줘요",
            },
            {
              icon: "🔒",
              title: "완전한 익명 보호",
              desc: "사진 없이 닉네임만으로 시작해요. 개인정보는 철저히 보호되고 상대에게 공개되지 않아요",
            },
            {
              icon: "💜",
              title: "간단한 시작",
              desc: "복잡한 가입 절차 없이 이메일 하나로 시작할 수 있어요. 추가 정보는 원할 때 입력하면 돼요",
            },
            {
              icon: "💬",
              title: "바로 채팅",
              desc: "매칭되면 바로 채팅을 시작할 수 있어요. AI가 첫 대화 주제도 추천해줘요",
            },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              style={{
                background: "#111",
                border: "1px solid #1e1e1e",
                borderRadius: "20px",
                padding: "28px 24px",
                transition: "border-color 0.2s",
              }}>
              <div style={{ fontSize: "32px", marginBottom: "16px" }}>
                {icon}
              </div>
              <h4
                style={{
                  color: "#fff",
                  fontSize: "17px",
                  fontWeight: 700,
                  marginBottom: "10px",
                }}>
                {title}
              </h4>
              <p
                style={{
                  color: "#666",
                  fontSize: "14px",
                  lineHeight: 1.7,
                  margin: 0,
                }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 어떻게 작동하나요 */}
      <div style={{ padding: "80px 24px", background: "#0d0d0d" }}>
        <div
          style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
          <h3
            style={{
              color: "#fff",
              fontSize: "clamp(24px, 5vw, 36px)",
              fontWeight: 700,
              marginBottom: "48px",
            }}>
            3단계로 끝나요
          </h3>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {[
              {
                step: "01",
                title: "간단하게 가입",
                desc: "이메일과 닉네임만으로 30초 안에 가입 완료",
              },
              {
                step: "02",
                title: "프로필 완성",
                desc: "MBTI, 연애 성향 등 나를 표현하는 정보 입력",
              },
              {
                step: "03",
                title: "자동 매칭",
                desc: "AI가 조건에 맞는 상대를 찾아 바로 연결",
              },
            ].map(({ step, title, desc }) => (
              <div
                key={step}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  background: "#111",
                  border: "1px solid #1e1e1e",
                  borderRadius: "16px",
                  padding: "20px 24px",
                  textAlign: "left",
                }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: "#2d1f4e",
                    border: "1px solid #5b21b6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#C084FC",
                    fontSize: "14px",
                    fontWeight: 700,
                  }}>
                  {step}
                </div>
                <div>
                  <h4
                    style={{
                      color: "#fff",
                      fontSize: "16px",
                      fontWeight: 700,
                      margin: "0 0 4px",
                    }}>
                    {title}
                  </h4>
                  <p style={{ color: "#666", fontSize: "13px", margin: 0 }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          padding: "100px 24px",
          textAlign: "center",
          background:
            "linear-gradient(180deg, #0a0a0a 0%, #130a2a 50%, #0a0a0a 100%)",
        }}>
        <h3
          style={{
            color: "#fff",
            fontSize: "clamp(28px, 6vw, 40px)",
            fontWeight: 700,
            marginBottom: "16px",
          }}>
          지금 바로 시작해봐요
        </h3>
        <p style={{ color: "#888", fontSize: "16px", marginBottom: "36px" }}>
          가입비 없음 · 언제든 탈퇴 가능
        </p>
        <a
          href="/signup"
          style={{
            display: "inline-block",
            padding: "18px 48px",
            background: "linear-gradient(135deg, #5b21b6, #7C3AED)",
            borderRadius: "16px",
            color: "#fff",
            fontSize: "18px",
            fontWeight: 700,
            textDecoration: "none",
          }}>
          무료로 시작하기 →
        </a>
      </div>

      {/* 푸터 */}
      <div
        style={{
          padding: "32px 24px",
          borderTop: "1px solid #1a1a1a",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}>
        <span style={{ color: "#fff", fontSize: "16px", fontWeight: 700 }}>
          Sp<span style={{ color: "#C084FC" }}>a</span>rk
        </span>
        <div style={{ display: "flex", gap: "20px" }}>
          <a
            href="/privacy"
            style={{ color: "#555", fontSize: "12px", textDecoration: "none" }}>
            개인정보처리방침
          </a>
          <a
            href="/terms"
            style={{ color: "#555", fontSize: "12px", textDecoration: "none" }}>
            이용약관
          </a>
        </div>
        <span style={{ color: "#444", fontSize: "12px" }}>© 2026 Spark</span>
      </div>
    </div>
  );
}
