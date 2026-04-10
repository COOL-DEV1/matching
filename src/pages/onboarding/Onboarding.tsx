import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../common/hooks/useAuth";
import { StepIndicator } from "./components/StepIndicator";

type FormData = {
  nickname: string;
  birth_date: string;
  gender: "male" | "female" | "";
  location: string;
  city: string;
  bio: string;
  mbti: string;
  height: string;
  smoking: string;
  drinking: string;
  relationship_style: string;
  skinship_level: string;
  contact_frequency: string;
  date_style: string;
  lead_style: string;
  seeking_gender: "male" | "female" | "";
  age_min: string;
  age_max: string;
};

const MBTI_LIST = [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
];

const LOCATION_DATA: Record<string, string[]> = {
  서울: [
    "강남구",
    "강동구",
    "강북구",
    "강서구",
    "관악구",
    "광진구",
    "구로구",
    "금천구",
    "노원구",
    "도봉구",
    "동대문구",
    "동작구",
    "마포구",
    "서대문구",
    "서초구",
    "성동구",
    "성북구",
    "송파구",
    "양천구",
    "영등포구",
    "용산구",
    "은평구",
    "종로구",
    "중구",
    "중랑구",
  ],
  경기: [
    "수원시",
    "성남시",
    "고양시",
    "용인시",
    "부천시",
    "안산시",
    "안양시",
    "남양주시",
    "화성시",
    "평택시",
    "의정부시",
    "시흥시",
    "파주시",
    "광명시",
    "김포시",
    "군포시",
    "하남시",
    "오산시",
    "이천시",
    "안성시",
    "의왕시",
    "양주시",
    "구리시",
    "포천시",
  ],
  인천: [
    "중구",
    "동구",
    "미추홀구",
    "연수구",
    "남동구",
    "부평구",
    "계양구",
    "서구",
  ],
  부산: [
    "강서구",
    "금정구",
    "기장군",
    "남구",
    "동구",
    "동래구",
    "부산진구",
    "북구",
    "사상구",
    "사하구",
    "서구",
    "수영구",
    "연제구",
    "영도구",
    "중구",
    "해운대구",
  ],
  대구: ["남구", "달서구", "달성군", "동구", "북구", "서구", "수성구", "중구"],
  대전: ["대덕구", "동구", "서구", "유성구", "중구"],
  광주: ["광산구", "남구", "동구", "북구", "서구"],
  울산: ["남구", "동구", "북구", "울주군", "중구"],
  세종: ["세종시"],
  강원: ["춘천시", "원주시", "강릉시", "동해시", "태백시", "속초시", "삼척시"],
  충북: ["청주시", "충주시", "제천시"],
  충남: [
    "천안시",
    "공주시",
    "보령시",
    "아산시",
    "서산시",
    "논산시",
    "계룡시",
    "당진시",
  ],
  전북: ["전주시", "군산시", "익산시", "정읍시", "남원시", "김제시"],
  전남: ["목포시", "여수시", "순천시", "나주시", "광양시"],
  경북: [
    "포항시",
    "경주시",
    "김천시",
    "안동시",
    "구미시",
    "영주시",
    "영천시",
    "상주시",
    "문경시",
    "경산시",
  ],
  경남: [
    "창원시",
    "진주시",
    "통영시",
    "사천시",
    "김해시",
    "밀양시",
    "거제시",
    "양산시",
  ],
  제주: ["제주시", "서귀포시"],
};

export function Onboarding() {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormData>({
    nickname: "",
    birth_date: "",
    gender: "",
    location: "",
    city: "",
    bio: "",
    mbti: "",
    height: "",
    smoking: "",
    drinking: "",
    relationship_style: "",
    skinship_level: "",
    contact_frequency: "",
    date_style: "",
    lead_style: "",
    seeking_gender: "",
    age_min: "19",
    age_max: "40",
  });

  const set = (key: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const TOTAL_STEPS = 5;

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);

    const { error: profileError } = await supabase.from("profiles").upsert({
      id: user.id,
      nickname: form.nickname,
      birth_date: form.birth_date,
      gender: form.gender,
      location: form.city ? `${form.location} ${form.city}` : form.location,
      bio: form.bio,
      mbti: form.mbti,
      height: form.height ? parseInt(form.height) : null,
      smoking: form.smoking,
      drinking: form.drinking,
      relationship_style: form.relationship_style,
    });

    if (profileError) {
      console.error(profileError);
      setLoading(false);
      return;
    }

    const { error: prefError } = await supabase
      .from("user_preferences")
      .upsert({
        user_id: user.id,
        seeking_gender: form.seeking_gender,
        age_min: parseInt(form.age_min),
        age_max: parseInt(form.age_max),
        skinship_level: form.skinship_level,
        contact_frequency: form.contact_frequency,
        date_style: form.date_style,
        lead_style: form.lead_style,
        sensitive_consent_at: new Date().toISOString(),
      });

    if (prefError) {
      console.error(prefError);
      setLoading(false);
      return;
    }

    window.location.href = "/";
  };

  const btnStyle = (active: boolean): React.CSSProperties => ({
    padding: "12px 16px",
    background: active ? "#2d1f4e" : "#1a1a1a",
    border: `1px solid ${active ? "#7C3AED" : "#2a2a2a"}`,
    borderRadius: "12px",
    color: active ? "#C084FC" : "#666",
    fontSize: "14px",
    cursor: "pointer",
    fontWeight: active ? 600 : 400,
    transition: "all 0.2s",
    textAlign: "center",
  });

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px",
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    color: "#888",
    fontSize: "13px",
    display: "block",
    marginBottom: "8px",
  };

  const nextBtn = (disabled = false) => (
    <button
      onClick={() => setStep((s) => s + 1)}
      disabled={disabled}
      style={{
        width: "100%",
        padding: "16px",
        background: disabled
          ? "#1a1a1a"
          : "linear-gradient(135deg, #5b21b6, #7C3AED)",
        border: "none",
        borderRadius: "14px",
        color: disabled ? "#444" : "#fff",
        fontSize: "16px",
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        marginTop: "32px",
        transition: "all 0.2s",
      }}>
      다음
    </button>
  );

  const steps = [
    // Step 0: 기본 정보
    <div key={0}>
      <h2
        style={{
          color: "#fff",
          fontSize: "22px",
          fontWeight: 700,
          marginBottom: "6px",
        }}>
        기본 정보
      </h2>
      <p style={{ color: "#666", fontSize: "14px", marginBottom: "28px" }}>
        나를 소개해줘요
      </p>

      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>닉네임</label>
        <input
          value={form.nickname}
          onChange={(e) => set("nickname", e.target.value)}
          placeholder="닉네임"
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>생년월일</label>
        <input
          type="date"
          value={form.birth_date}
          onChange={(e) => set("birth_date", e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>성별</label>
        <div style={{ display: "flex", gap: "10px" }}>
          {[
            { v: "male", l: "남성" },
            { v: "female", l: "여성" },
          ].map(({ v, l }) => (
            <button
              key={v}
              onClick={() => set("gender", v)}
              style={{ ...btnStyle(form.gender === v), flex: 1 }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>지역</label>
        <select
          value={form.location}
          onChange={(e) => {
            set("location", e.target.value);
            set("city", "");
          }}
          style={{ ...inputStyle, appearance: "none", marginBottom: "8px" }}>
          <option value="">시/도 선택</option>
          {Object.keys(LOCATION_DATA).map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>

        {form.location && form.location !== "세종" && (
          <select
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
            style={{ ...inputStyle, appearance: "none" }}>
            <option value="">구/시/군 선택</option>
            {LOCATION_DATA[form.location]?.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>키 (선택)</label>
        <input
          type="number"
          value={form.height}
          onChange={(e) => set("height", e.target.value)}
          placeholder="cm"
          style={inputStyle}
        />
      </div>

      {nextBtn(
        !form.nickname ||
          !form.birth_date ||
          !form.gender ||
          !form.location ||
          (!form.city && form.location !== "세종"),
      )}
    </div>,

    // Step 1: 자기소개 + MBTI
    <div key={1}>
      <h2
        style={{
          color: "#fff",
          fontSize: "22px",
          fontWeight: 700,
          marginBottom: "6px",
        }}>
        나를 표현해요
      </h2>
      <p style={{ color: "#666", fontSize: "14px", marginBottom: "28px" }}>
        상대방이 가장 먼저 보게 돼요
      </p>

      <div style={{ marginBottom: "20px" }}>
        <label style={labelStyle}>자기소개</label>
        <textarea
          value={form.bio}
          onChange={(e) => set("bio", e.target.value)}
          placeholder="나를 한 줄로 표현해보세요"
          rows={4}
          style={{ ...inputStyle, resize: "none", lineHeight: 1.6 }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={labelStyle}>MBTI</label>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "8px",
          }}>
          {MBTI_LIST.map((m) => (
            <button
              key={m}
              onClick={() => set("mbti", m)}
              style={btnStyle(form.mbti === m)}>
              {m}
            </button>
          ))}
        </div>
      </div>

      {nextBtn(!form.bio || !form.mbti)}
    </div>,

    // Step 2: 라이프스타일
    <div key={2}>
      <h2
        style={{
          color: "#fff",
          fontSize: "22px",
          fontWeight: 700,
          marginBottom: "6px",
        }}>
        라이프스타일
      </h2>
      <p style={{ color: "#666", fontSize: "14px", marginBottom: "28px" }}>
        나의 생활 습관을 알려줘요
      </p>

      <div style={{ marginBottom: "20px" }}>
        <label style={labelStyle}>흡연</label>
        <div style={{ display: "flex", gap: "8px" }}>
          {[
            { v: "no", l: "비흡연" },
            { v: "sometimes", l: "가끔" },
            { v: "yes", l: "흡연" },
          ].map(({ v, l }) => (
            <button
              key={v}
              onClick={() => set("smoking", v)}
              style={{ ...btnStyle(form.smoking === v), flex: 1 }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={labelStyle}>음주</label>
        <div style={{ display: "flex", gap: "8px" }}>
          {[
            { v: "no", l: "안 마심" },
            { v: "sometimes", l: "가끔" },
            { v: "yes", l: "즐김" },
          ].map(({ v, l }) => (
            <button
              key={v}
              onClick={() => set("drinking", v)}
              style={{ ...btnStyle(form.drinking === v), flex: 1 }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={labelStyle}>연애 스타일</label>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
          }}>
          {[
            { v: "serious", l: "진지한 연애" },
            { v: "casual", l: "캐주얼한 만남" },
            { v: "thumb", l: "썸 타고 싶어요" },
            { v: "open", l: "오픈 릴레이션십" },
          ].map(({ v, l }) => (
            <button
              key={v}
              onClick={() => set("relationship_style", v)}
              style={btnStyle(form.relationship_style === v)}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {nextBtn(!form.smoking || !form.drinking || !form.relationship_style)}
    </div>,

    // Step 3: 연애 성향 (민감정보)
    <div key={3}>
      <h2
        style={{
          color: "#fff",
          fontSize: "22px",
          fontWeight: 700,
          marginBottom: "6px",
        }}>
        연애 성향
      </h2>
      <p style={{ color: "#666", fontSize: "14px", marginBottom: "4px" }}>
        매칭 알고리즘에만 활용돼요
      </p>
      <div
        style={{
          background: "#1a1230",
          border: "1px solid #3b1f7a",
          borderRadius: "10px",
          padding: "8px 12px",
          marginBottom: "24px",
        }}>
        <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>
          🔒 이 정보는 상대방에게 공개되지 않아요
        </p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={labelStyle}>스킨십 선호</label>
        <div style={{ display: "flex", gap: "8px" }}>
          {[
            { v: "slow", l: "천천히" },
            { v: "natural", l: "자연스럽게" },
            { v: "fast", l: "빠르게" },
          ].map(({ v, l }) => (
            <button
              key={v}
              onClick={() => set("skinship_level", v)}
              style={{ ...btnStyle(form.skinship_level === v), flex: 1 }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={labelStyle}>연락 빈도</label>
        <div style={{ display: "flex", gap: "8px" }}>
          {[
            { v: "often", l: "자주" },
            { v: "normal", l: "보통" },
            { v: "rarely", l: "필요할 때" },
          ].map(({ v, l }) => (
            <button
              key={v}
              onClick={() => set("contact_frequency", v)}
              style={{ ...btnStyle(form.contact_frequency === v), flex: 1 }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={labelStyle}>데이트 스타일</label>
        <div style={{ display: "flex", gap: "8px" }}>
          {[
            { v: "indoor", l: "실내 중심" },
            { v: "outdoor", l: "야외 중심" },
            { v: "mixed", l: "혼합" },
          ].map(({ v, l }) => (
            <button
              key={v}
              onClick={() => set("date_style", v)}
              style={{ ...btnStyle(form.date_style === v), flex: 1 }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={labelStyle}>주도성</label>
        <div style={{ display: "flex", gap: "8px" }}>
          {[
            { v: "me", l: "내가 리드" },
            { v: "half", l: "반반" },
            { v: "partner", l: "상대가 리드" },
          ].map(({ v, l }) => (
            <button
              key={v}
              onClick={() => set("lead_style", v)}
              style={{ ...btnStyle(form.lead_style === v), flex: 1 }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {nextBtn(
        !form.skinship_level ||
          !form.contact_frequency ||
          !form.date_style ||
          !form.lead_style,
      )}
    </div>,

    // Step 4: 상대 조건
    <div key={4}>
      <h2
        style={{
          color: "#fff",
          fontSize: "22px",
          fontWeight: 700,
          marginBottom: "6px",
        }}>
        원하는 상대
      </h2>
      <p style={{ color: "#666", fontSize: "14px", marginBottom: "28px" }}>
        어떤 분을 만나고 싶으세요?
      </p>

      <div style={{ marginBottom: "20px" }}>
        <label style={labelStyle}>원하는 성별</label>
        <div style={{ display: "flex", gap: "10px" }}>
          {[
            { v: "male", l: "남성" },
            { v: "female", l: "여성" },
          ].map(({ v, l }) => (
            <button
              key={v}
              onClick={() => set("seeking_gender", v)}
              style={{ ...btnStyle(form.seeking_gender === v), flex: 1 }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={labelStyle}>원하는 나이대</label>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="number"
            value={form.age_min}
            onChange={(e) => set("age_min", e.target.value)}
            style={{ ...inputStyle, textAlign: "center" }}
            min={19}
          />
          <span style={{ color: "#666" }}>~</span>
          <input
            type="number"
            value={form.age_max}
            onChange={(e) => set("age_max", e.target.value)}
            style={{ ...inputStyle, textAlign: "center" }}
          />
        </div>
      </div>

      <div
        style={{
          background: "#111",
          border: "1px solid #2a2a2a",
          borderRadius: "14px",
          padding: "16px",
          marginTop: "24px",
        }}>
        <p
          style={{
            color: "#aaa",
            fontSize: "13px",
            marginBottom: "8px",
            lineHeight: 1.6,
          }}>
          연애 성향 정보는 매칭 알고리즘에만 활용되며 제3자에게 제공되지
          않습니다.
        </p>
        <p style={{ color: "#666", fontSize: "12px", margin: 0 }}>
          시작하기 버튼을 누르면 개인정보 처리방침 및 민감정보 수집·이용에
          동의하는 것으로 간주됩니다.
        </p>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || !form.seeking_gender}
        style={{
          width: "100%",
          padding: "16px",
          background:
            loading || !form.seeking_gender
              ? "#1a1a1a"
              : "linear-gradient(135deg, #5b21b6, #7C3AED)",
          border: "none",
          borderRadius: "14px",
          color: loading || !form.seeking_gender ? "#444" : "#fff",
          fontSize: "16px",
          fontWeight: 600,
          cursor: loading || !form.seeking_gender ? "not-allowed" : "pointer",
          marginTop: "24px",
        }}>
        {loading ? "저장 중..." : "시작하기 ✦"}
      </button>
    </div>,
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
      }}>
      <div
        style={{ width: "100%", maxWidth: "430px", padding: "48px 24px 40px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1
            style={{
              color: "#fff",
              fontSize: "26px",
              fontWeight: 700,
              margin: 0,
            }}>
            Sp<span style={{ color: "#C084FC" }}>a</span>rk
          </h1>
        </div>

        <StepIndicator total={TOTAL_STEPS} current={step} />

        <div style={{ animation: "fadeIn 0.3s ease" }}>{steps[step]}</div>

        {step > 0 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            style={{
              width: "100%",
              padding: "12px",
              background: "transparent",
              border: "none",
              color: "#555",
              fontSize: "14px",
              cursor: "pointer",
              marginTop: "12px",
            }}>
            ← 이전으로
          </button>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateX(20px) } to { opacity: 1; transform: translateX(0) } }
        select option { background: #1a1a1a; color: #fff; }
      `}</style>
    </div>
  );
}
