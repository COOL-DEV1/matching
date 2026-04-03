import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../common/hooks/useAuth";
import { StepIndicator } from "./components/StepIndicator";

type FormData = {
  nickname: string;
  birth_date: string;
  gender: "male" | "female" | "";
  location: string;
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

const LOCATIONS = [
  "서울 강남구",
  "서울 강북구",
  "서울 마포구",
  "서울 성동구",
  "서울 용산구",
  "서울 종로구",
  "서울 송파구",
  "서울 강서구",
  "경기 수원",
  "경기 성남",
  "경기 고양",
  "인천",
  "부산",
  "대구",
  "대전",
  "광주",
];

export function Onboarding() {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  // const [photos, setPhotos] = useState<File[]>([]);
  // const [previews, setPreviews] = useState<string[]>([]);
  // const [uploadProgress, setUploadProgress] = useState(false);
  // const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormData>({
    nickname: "",
    birth_date: "",
    gender: "",
    location: "",
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

  // const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = Array.from(e.target.files || []);
  //   if (files.length === 0) return;
  //   const newPhotos = [...photos, ...files].slice(0, 3);
  //   setPhotos(newPhotos);
  //   const newPreviews = newPhotos.map((f) => URL.createObjectURL(f));
  //   setPreviews(newPreviews);
  // };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    setPreviews(newPreviews);
  };

  // const uploadPhotos = async (): Promise<string[]> => {
  //   if (!user || photos.length === 0) return [];
  //   setUploadProgress(true);
  //   const urls: string[] = [];

  //   for (const photo of photos) {
  //     const ext = photo.name.split(".").pop();
  //     const path = `${user.id}/${Date.now()}.${ext}`;
  //     const { error } = await supabase.storage
  //       .from("avatars")
  //       .upload(path, photo, { upsert: true });

  //     if (!error) {
  //       const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  //       urls.push(data.publicUrl);
  //     }
  //   }

  //   setUploadProgress(false);
  //   return urls;
  // };

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);

    // const photoUrls = await uploadPhotos();

    const { error: profileError } = await supabase.from("profiles").upsert({
      id: user.id,
      nickname: form.nickname,
      birth_date: form.birth_date,
      gender: form.gender,
      location: form.location,
      bio: form.bio,
      mbti: form.mbti,
      height: form.height ? parseInt(form.height) : null,
      smoking: form.smoking,
      drinking: form.drinking,
      relationship_style: form.relationship_style,
      // photos: photoUrls,
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
          onChange={(e) => set("location", e.target.value)}
          style={{ ...inputStyle, appearance: "none" }}>
          <option value="">지역 선택</option>
          {LOCATIONS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
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
        !form.nickname || !form.birth_date || !form.gender || !form.location,
      )}
    </div>,

    // Step 1: 사진 업로드
    <div key={1}>
      <h2
        style={{
          color: "#fff",
          fontSize: "22px",
          fontWeight: 700,
          marginBottom: "6px",
        }}>
        프로필 사진
      </h2>
      <p style={{ color: "#666", fontSize: "14px", marginBottom: "28px" }}>
        최대 3장까지 올릴 수 있어요
      </p>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handlePhotoSelect}
        style={{ display: "none" }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
          marginBottom: "20px",
        }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ position: "relative" }}>
            {previews[i] ? (
              <div style={{ position: "relative" }}>
                <img
                  src={previews[i]}
                  alt=""
                  style={{
                    width: "100%",
                    aspectRatio: "1",
                    objectFit: "cover",
                    borderRadius: "14px",
                    border: "1px solid #2a2a2a",
                  }}
                />
                <button
                  onClick={() => removePhoto(i)}
                  style={{
                    position: "absolute",
                    top: "6px",
                    right: "6px",
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    background: "rgba(0,0,0,0.7)",
                    border: "none",
                    color: "#fff",
                    fontSize: "12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                  ✕
                </button>
                {i === 0 && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "6px",
                      left: "6px",
                      background: "#7C3AED",
                      borderRadius: "6px",
                      padding: "2px 6px",
                      color: "#fff",
                      fontSize: "10px",
                    }}>
                    대표
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                style={{
                  width: "100%",
                  aspectRatio: "1",
                  background: "#1a1a1a",
                  border: "1px dashed #2a2a2a",
                  borderRadius: "14px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  color: "#444",
                  fontSize: "12px",
                }}>
                <span style={{ fontSize: "24px" }}>+</span>
                <span>사진 추가</span>
              </button>
            )}
          </div>
        ))}
      </div>

      <div
        style={{
          background: "#1a1a1a",
          border: "1px solid #2a2a2a",
          borderRadius: "12px",
          padding: "12px 14px",
        }}>
        <p
          style={{
            color: "#666",
            fontSize: "12px",
            margin: 0,
            lineHeight: 1.6,
          }}>
          📸 본인 사진만 올려주세요. 타인·캐릭터 사진은 계정 정지 사유가 됩니다.
        </p>
      </div>

      {nextBtn(photos.length === 0)}
    </div>,

    // Step 2: 자기소개 + MBTI
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

    // Step 3: 라이프스타일
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

    // Step 4: 연애 성향 (민감정보)
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

    // Step 5: 상대 조건
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
        {loading || uploadProgress ? "저장 중..." : "시작하기 ✦"}
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
