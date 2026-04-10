import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../common/hooks/useAuth";

const ADMIN_EMAIL = "seewon3342@gmail.com"; // 관리자 이메일

type Report = {
  id: string;
  reporter_id: string;
  reported_id: string;
  reason: string;
  description: string;
  status: string;
  created_at: string;
  reporter_profile: { nickname: string };
  reported_profile: { nickname: string; is_active: boolean };
};

const reasonMap: Record<string, string> = {
  fake_profile: "허위 프로필",
  harassment: "욕설 / 성희롱",
  spam: "스팸 / 광고",
  inappropriate_photo: "부적절한 내용",
  underage: "미성년자 의심",
  other: "기타",
};

export function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, suspended: 0 });

  useEffect(() => {
    if (!user) return;
    if (user.email !== ADMIN_EMAIL) {
      navigate("/home");
      return;
    }
    fetchReports();
    fetchStats();
  }, [user]);

  const fetchReports = async () => {
    const { data } = await supabase
      .from("reports")
      .select(
        `
        *,
        reporter_profile:profiles!reports_reporter_id_fkey(nickname),
        reported_profile:profiles!reports_reported_id_fkey(nickname, is_active)
      `,
      )
      .order("created_at", { ascending: false });

    setReports(data || []);
    setLoading(false);
  };

  const fetchStats = async () => {
    const { count: total } = await supabase
      .from("reports")
      .select("*", { count: "exact", head: true });

    const { count: pending } = await supabase
      .from("reports")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    const { count: suspended } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("is_active", false);

    setStats({
      total: total || 0,
      pending: pending || 0,
      suspended: suspended || 0,
    });
  };

  const handleSuspend = async (reportedId: string) => {
    if (!window.confirm("이 유저를 정지하시겠어요?")) return;
    await supabase
      .from("profiles")
      .update({ is_active: false })
      .eq("id", reportedId);
    await supabase
      .from("reports")
      .update({ status: "resolved" })
      .eq("reported_id", reportedId);
    fetchReports();
    fetchStats();
  };

  const handleRestore = async (reportedId: string) => {
    if (!window.confirm("이 유저의 정지를 해제하시겠어요?")) return;
    await supabase
      .from("profiles")
      .update({ is_active: true })
      .eq("id", reportedId);
    fetchReports();
    fetchStats();
  };

  const handleDismiss = async (reportId: string) => {
    await supabase
      .from("reports")
      .update({ status: "reviewed" })
      .eq("id", reportId);
    fetchReports();
    fetchStats();
  };

  const statusColor: Record<string, string> = {
    pending: "#f59e0b",
    reviewed: "#888",
    resolved: "#22c55e",
  };

  const statusLabel: Record<string, string> = {
    pending: "대기",
    reviewed: "검토됨",
    resolved: "처리완료",
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0a0a0a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <div style={{ color: "#C084FC", fontSize: "24px" }}>✦</div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        maxWidth: "800px",
        margin: "0 auto",
        padding: "24px 20px",
      }}>
      {/* 헤더 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}>
        <div>
          <h1
            style={{
              color: "#fff",
              fontSize: "22px",
              fontWeight: 700,
              margin: 0,
            }}>
            Sp<span style={{ color: "#C084FC" }}>a</span>rk 관리자
          </h1>
          <p style={{ color: "#555", fontSize: "12px", margin: 0 }}>
            {user?.email}
          </p>
        </div>
        <button
          onClick={() => navigate("/home")}
          style={{
            padding: "8px 16px",
            background: "#1a1a1a",
            border: "1px solid #2a2a2a",
            borderRadius: "10px",
            color: "#888",
            fontSize: "13px",
            cursor: "pointer",
          }}>
          ← 홈으로
        </button>
      </div>

      {/* 통계 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px",
          marginBottom: "24px",
        }}>
        {[
          { label: "전체 신고", value: stats.total, color: "#C084FC" },
          { label: "처리 대기", value: stats.pending, color: "#f59e0b" },
          { label: "정지된 유저", value: stats.suspended, color: "#ef4444" },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            style={{
              background: "#111",
              border: "1px solid #1e1e1e",
              borderRadius: "14px",
              padding: "16px",
              textAlign: "center",
            }}>
            <div style={{ color, fontSize: "28px", fontWeight: 700 }}>
              {value}
            </div>
            <div style={{ color: "#666", fontSize: "12px", marginTop: "4px" }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* 신고 목록 */}
      <div
        style={{
          background: "#111",
          border: "1px solid #1e1e1e",
          borderRadius: "16px",
          overflow: "hidden",
        }}>
        <div
          style={{ padding: "16px 20px", borderBottom: "1px solid #1e1e1e" }}>
          <h2
            style={{
              color: "#fff",
              fontSize: "16px",
              fontWeight: 600,
              margin: 0,
            }}>
            신고 목록
          </h2>
        </div>

        {reports.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#555" }}>
            신고 내역이 없어요
          </div>
        ) : (
          reports.map((report) => (
            <div
              key={report.id}
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #1a1a1a",
              }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "10px",
                }}>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "6px",
                    }}>
                    <span
                      style={{
                        fontSize: "11px",
                        padding: "2px 8px",
                        borderRadius: "10px",
                        background: "#2d1f4e",
                        border: "1px solid #5b21b6",
                        color: "#C084FC",
                      }}>
                      {reasonMap[report.reason] || report.reason}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        padding: "2px 8px",
                        borderRadius: "10px",
                        background: "#1a1a1a",
                        color: statusColor[report.status],
                      }}>
                      {statusLabel[report.status]}
                    </span>
                    {report.reported_profile?.is_active === false && (
                      <span
                        style={{
                          fontSize: "11px",
                          padding: "2px 8px",
                          borderRadius: "10px",
                          background: "#2a0a0a",
                          color: "#ef4444",
                        }}>
                        정지됨
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      color: "#aaa",
                      fontSize: "13px",
                      marginBottom: "4px",
                    }}>
                    <span style={{ color: "#fff" }}>
                      {report.reporter_profile?.nickname}
                    </span>
                    <span style={{ color: "#555" }}> → </span>
                    <span style={{ color: "#ef4444" }}>
                      {report.reported_profile?.nickname}
                    </span>
                    <span
                      style={{
                        color: "#555",
                        fontSize: "11px",
                        marginLeft: "8px",
                      }}>
                      {new Date(report.created_at).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                  {report.description && (
                    <p style={{ color: "#666", fontSize: "12px", margin: 0 }}>
                      {report.description}
                    </p>
                  )}
                </div>

                {/* 액션 버튼 */}
                {report.status === "pending" && (
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      flexShrink: 0,
                      marginLeft: "12px",
                    }}>
                    {report.reported_profile?.is_active !== false ? (
                      <button
                        onClick={() => handleSuspend(report.reported_id)}
                        style={{
                          padding: "6px 12px",
                          background: "#2a0a0a",
                          border: "1px solid #ef4444",
                          borderRadius: "8px",
                          color: "#ef4444",
                          fontSize: "12px",
                          cursor: "pointer",
                        }}>
                        정지
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRestore(report.reported_id)}
                        style={{
                          padding: "6px 12px",
                          background: "#0a2a0a",
                          border: "1px solid #22c55e",
                          borderRadius: "8px",
                          color: "#22c55e",
                          fontSize: "12px",
                          cursor: "pointer",
                        }}>
                        해제
                      </button>
                    )}
                    <button
                      onClick={() => handleDismiss(report.id)}
                      style={{
                        padding: "6px 12px",
                        background: "#1a1a1a",
                        border: "1px solid #2a2a2a",
                        borderRadius: "8px",
                        color: "#888",
                        fontSize: "12px",
                        cursor: "pointer",
                      }}>
                      무시
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
