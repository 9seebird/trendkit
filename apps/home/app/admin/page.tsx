"use client";

import { useEffect, useMemo, useState } from "react";

type Notice = {
  id: string;
  tag: string;
  tagColor: string;
  tagText: string;
  title: string;
  content: string;
  date: string;
  isPublished: boolean;
  isPinned?: boolean;
  order?: number;
  createdAt: string;
  updatedAt: string;
};

type Inquiry = {
  id: string;
  name: string;
  email: string;
  type: string;
  message: string;
  status: "new" | "read" | "done";
  createdAt: string;
  updatedAt: string;
};

type ToastState = {
  message: string;
  type?: "success" | "error";
};

type ConfirmState = {
  title: string;
  description: string;
  confirmText?: string;
  danger?: boolean;
  onConfirm: () => Promise<void> | void;
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "13px 15px",
  border: "1px solid #e2e8f0",
  borderRadius: 14,
  fontSize: 14,
  background: "#fff",
  outline: "none",
  boxSizing: "border-box",
};

const cardStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.88)",
  border: "1px solid rgba(226,232,240,0.95)",
  borderRadius: 26,
  padding: 24,
  boxShadow: "0 20px 60px rgba(15,23,42,0.08)",
};

const emptyNotice = {
  id: "",
  tag: "공지",
  tagColor: "#dcfce7",
  tagText: "#15803d",
  title: "",
  content: "",
  date: "",
  isPublished: true,
  isPinned: false,
};

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [tab, setTab] = useState<"inquiries" | "notices">("inquiries");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [noticeForm, setNoticeForm] = useState(emptyNotice);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [confirmModal, setConfirmModal] = useState<ConfirmState | null>(null);
  const [draggingNoticeId, setDraggingNoticeId] = useState<string | null>(null);
  const [dragOverNoticeId, setDragOverNoticeId] = useState<string | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);

  const counts = useMemo(() => ({
    new: inquiries.filter((item) => item.status === "new").length,
    read: inquiries.filter((item) => item.status === "read").length,
    done: inquiries.filter((item) => item.status === "done").length,
  }), [inquiries]);

  async function checkLogin() {
    const res = await fetch("/api/admin/me", { cache: "no-store" });
    const data = await res.json();
    setLoggedIn(Boolean(data.loggedIn));
    setChecking(false);
    if (data.loggedIn) await loadData();
  }

  async function loadData() {
    const [inquiryRes, noticeRes] = await Promise.all([
      fetch("/api/admin/inquiries", { cache: "no-store" }),
      fetch("/api/admin/notices", { cache: "no-store" }),
    ]);
    if (inquiryRes.ok) setInquiries((await inquiryRes.json()).inquiries || []);
    if (noticeRes.ok) setNotices((await noticeRes.json()).notices || []);
  }

  useEffect(() => { checkLogin(); }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function showToast(message: string, type: ToastState["type"] = "success") {
    setToast({ message, type });
  }

  function openConfirm(nextConfirm: ConfirmState) {
    setConfirmModal(nextConfirm);
  }

  async function runConfirmAction() {
    if (!confirmModal) return;
    const action = confirmModal.onConfirm;
    setConfirmModal(null);
    await action();
  }

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMessage(data.message || "로그인에 실패했습니다.");
      return;
    }
    setPassword("");
    setLoggedIn(true);
    await loadData();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setLoggedIn(false);
  }

  async function switchTab(nextTab: "inquiries" | "notices") {
    setTab(nextTab);
    await loadData();
  }

  async function updateInquiry(id: string, status: Inquiry["status"]) {
    const res = await fetch("/api/admin/inquiries", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (!res.ok) {
      showToast("문의 상태 변경에 실패했습니다.", "error");
      return;
    }
    await loadData();
    showToast("문의 상태가 변경되었습니다.");
  }

  function requestInquiryDelete(id: string) {
    openConfirm({
      title: "문의를 삭제하시겠습니까?",
      description: "삭제한 문의는 복구할 수 없습니다.",
      confirmText: "삭제하기",
      danger: true,
      onConfirm: async () => {
        const res = await fetch("/api/admin/inquiries", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (!res.ok) {
          showToast("문의 삭제에 실패했습니다.", "error");
          return;
        }
        await loadData();
        showToast("문의가 삭제되었습니다.");
      },
    });
  }

  async function saveNotice(e: React.FormEvent) {
    e.preventDefault();
    const method = noticeForm.id ? "PUT" : "POST";
    const isEdit = Boolean(noticeForm.id);

    const submitNotice = async () => {
      const res = await fetch("/api/admin/notices", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(noticeForm),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        showToast(data.message || "공지 저장에 실패했습니다.", "error");
        return;
      }
      setNoticeForm(emptyNotice);
      await loadData();
      showToast(isEdit ? "공지사항이 수정되었습니다." : "공지사항이 등록되었습니다.");
    };

    if (isEdit) {
      openConfirm({
        title: "공지사항을 수정하시겠습니까?",
        description: "현재 입력한 내용으로 공지사항이 저장됩니다.",
        confirmText: "수정 저장",
        onConfirm: submitNotice,
      });
      return;
    }

    await submitNotice();
  }

  function requestNoticeEdit(item: Notice) {
    openConfirm({
      title: "이 공지사항을 수정하시겠습니까?",
      description: "선택한 공지사항 내용이 작성 영역에 불러와집니다.",
      confirmText: "수정하기",
      onConfirm: () => {
        setNoticeForm(item);
        showToast("공지사항을 수정 모드로 불러왔습니다.");
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
    });
  }

  async function updateNoticePin(id: string, isPinned: boolean) {
    const res = await fetch("/api/admin/notices", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "pin", isPinned }),
    });
    if (!res.ok) {
      showToast("상단 고정 변경에 실패했습니다.", "error");
      return;
    }
    await loadData();
    showToast(isPinned ? "공지사항이 상단에 고정되었습니다." : "공지사항 상단 고정이 해제되었습니다.");
  }

  async function saveNoticeOrder(nextNotices: Notice[]) {
    setSavingOrder(true);
    const previous = notices;
    setNotices(nextNotices);

    const res = await fetch("/api/admin/notices", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reorder", orderedIds: nextNotices.map((item) => item.id) }),
    });

    setSavingOrder(false);
    if (!res.ok) {
      setNotices(previous);
      showToast("공지 순서 저장에 실패했습니다.", "error");
      return;
    }

    const data = await res.json().catch(() => ({}));
    if (Array.isArray(data.notices)) setNotices(data.notices);
    showToast("공지 순서가 저장되었습니다.");
  }

  function handleNoticeDragStart(id: string, event: React.DragEvent<HTMLElement>) {
    setDraggingNoticeId(id);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", id);
  }

  function handleNoticeDragOver(id: string, event: React.DragEvent<HTMLElement>) {
    event.preventDefault();
    if (!draggingNoticeId || draggingNoticeId === id) return;
    setDragOverNoticeId(id);
  }

  async function handleNoticeDrop(targetId: string, event: React.DragEvent<HTMLElement>) {
    event.preventDefault();
    const sourceId = draggingNoticeId || event.dataTransfer.getData("text/plain");
    setDraggingNoticeId(null);
    setDragOverNoticeId(null);

    if (!sourceId || sourceId === targetId) return;
    const sourceIndex = notices.findIndex((item) => item.id === sourceId);
    const targetIndex = notices.findIndex((item) => item.id === targetId);
    if (sourceIndex < 0 || targetIndex < 0) return;

    const next = [...notices];
    const [moved] = next.splice(sourceIndex, 1);
    next.splice(targetIndex, 0, moved);
    await saveNoticeOrder(next);
  }

  function handleNoticeDragEnd() {
    setDraggingNoticeId(null);
    setDragOverNoticeId(null);
  }

  function requestNoticeDelete(id: string) {
    openConfirm({
      title: "공지사항을 삭제하시겠습니까?",
      description: "삭제한 공지사항은 복구할 수 없습니다.",
      confirmText: "삭제하기",
      danger: true,
      onConfirm: async () => {
        const res = await fetch("/api/admin/notices", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (!res.ok) {
          showToast("공지사항 삭제에 실패했습니다.", "error");
          return;
        }
        await loadData();
        showToast("공지사항이 삭제되었습니다.");
      },
    });
  }

  if (checking) {
    return <main style={{ padding: 40 }}>관리자 상태를 확인하는 중입니다...</main>;
  }

  if (!loggedIn) {
    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "linear-gradient(135deg,#f8fafc 0%,#f5f4f0 48%,#eef2ff 100%)", padding: 24 }}>
        <form onSubmit={login} style={{ ...cardStyle, width: "100%", maxWidth: 430 }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: "#2563eb", marginBottom: 8 }}>TRENDKIT ADMIN</div>
          <h1 style={{ fontSize: 30, margin: "0 0 8px", letterSpacing: "-0.05em" }}>관리자 로그인</h1>
          <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.7, marginBottom: 22 }}>문의 확인과 공지사항 관리를 위해 비밀번호를 입력해주세요. 세션은 30분간 유지됩니다.</p>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="관리자 비밀번호" style={inputStyle} autoFocus />
          {message && <p style={{ color: "#dc2626", fontSize: 13 }}>{message}</p>}
          <button style={{ ...button("#111827", "#fff"), width: "100%", marginTop: 14, padding: "14px 16px" }}>로그인</button>
          <p style={{ marginTop: 14, color: "#94a3b8", fontSize: 12 }}>초기 비밀번호는 환경변수 ADMIN_PASSWORD로 변경하세요.</p>
        </form>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "radial-gradient(circle at 12% 8%, rgba(59,130,246,0.10), transparent 26%), radial-gradient(circle at 86% 0%, rgba(16,185,129,0.10), transparent 24%), #f8fafc", padding: "32px 20px 80px", color: "#0f172a" }}>
      <div style={{ maxWidth: 1220, margin: "0 auto" }}>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 11px", borderRadius: 999, background: "#eff6ff", color: "#2563eb", fontSize: 12, fontWeight: 900, marginBottom: 10 }}>● TRENDKIT ADMIN</div>
            <h1 style={{ fontSize: "clamp(31px, 5vw, 48px)", margin: 0, letterSpacing: "-0.06em", lineHeight: 1 }}>관리자 페이지</h1>
            <p style={{ margin: "10px 0 0", color: "#64748b", fontSize: 14 }}>문의와 공지사항을 한 곳에서 관리합니다.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={loadData} style={button("#fff", "#0f172a", "#cbd5e1")}>새로고침</button>
            <button onClick={logout} style={button("#0f172a", "#fff")}>로그아웃</button>
          </div>
        </header>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 18 }}>
          <Stat title="신규 문의" value={counts.new} accent="#2563eb" />
          <Stat title="확인 중" value={counts.read} accent="#f59e0b" />
          <Stat title="처리 완료" value={counts.done} accent="#10b981" />
          <Stat title="공지사항" value={notices.length} accent="#8b5cf6" />
        </section>

        <div style={{ display: "inline-flex", gap: 6, marginBottom: 18, padding: 6, border: "1px solid #e2e8f0", borderRadius: 18, background: "rgba(255,255,255,0.75)", boxShadow: "0 12px 30px rgba(15,23,42,0.05)" }}>
          <button onClick={() => switchTab("inquiries")} style={tabButton(tab === "inquiries")}>문의 관리</button>
          <button onClick={() => switchTab("notices")} style={tabButton(tab === "notices")}>공지사항 관리</button>
        </div>

        {tab === "inquiries" ? (
          <section style={cardStyle}>
            <SectionTitle title="문의 목록" desc="접수된 문의를 확인하고 처리 상태를 변경합니다." />
            <div style={{ display: "grid", gap: 12 }}>
              {inquiries.length === 0 && <EmptyMessage>아직 접수된 문의가 없습니다.</EmptyMessage>}
              {inquiries.map((item) => (
                <article key={item.id} style={{ border: "1px solid #e2e8f0", borderRadius: 20, padding: 18, background: item.status === "new" ? "#f8fbff" : "#fff" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
                    <strong style={{ fontSize: 16 }}>{item.type} · {item.name}</strong>
                    <StatusBadge status={item.status} />
                  </div>
                  <div style={{ color: "#64748b", fontSize: 13, marginBottom: 6 }}>{item.email}</div>
                  <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 12 }}>{new Date(item.createdAt).toLocaleString("ko-KR")}</div>
                  <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.75, margin: 0 }}>{item.message}</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
                    <select value={item.status} onChange={(e) => updateInquiry(item.id, e.target.value as Inquiry["status"])} style={{ ...inputStyle, width: 150, padding: "10px 12px" }}>
                      <option value="new">신규</option>
                      <option value="read">확인 중</option>
                      <option value="done">처리 완료</option>
                    </select>
                    <button onClick={() => requestInquiryDelete(item.id)} style={button("#fee2e2", "#991b1b")}>삭제</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : (
          <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 390px) minmax(0, 1fr)", gap: 18, alignItems: "start" }} className="admin-grid">
            <form onSubmit={saveNotice} style={{ ...cardStyle, position: "sticky", top: 20 }} className="notice-form-card">
              <SectionTitle title={noticeForm.id ? "공지 수정" : "공지 작성"} desc={noticeForm.id ? "수정 저장 전 확인창이 표시됩니다." : "공지 내용을 입력하고 공개 여부를 선택하세요."} />
              <div style={{ display: "grid", gap: 12 }}>
                <input style={inputStyle} placeholder="제목" value={noticeForm.title} onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })} />
                <textarea style={{ ...inputStyle, minHeight: 150, resize: "vertical" }} placeholder="공지 내용" value={noticeForm.content} onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }} className="form-two-cols">
                  <input style={inputStyle} placeholder="태그" value={noticeForm.tag} onChange={(e) => setNoticeForm({ ...noticeForm, tag: e.target.value })} />
                  <input style={inputStyle} placeholder="날짜 예: 2026.05.09" value={noticeForm.date} onChange={(e) => setNoticeForm({ ...noticeForm, date: e.target.value })} />
                </div>
                <div style={{ display: "grid", gap: 10, padding: 14, border: "1px solid #e2e8f0", borderRadius: 16, background: "#f8fafc" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 14, fontWeight: 700 }}>
                    <input type="checkbox" checked={noticeForm.isPublished} onChange={(e) => setNoticeForm({ ...noticeForm, isPublished: e.target.checked })} /> 공개하기
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 14, fontWeight: 700 }}>
                    <input type="checkbox" checked={Boolean(noticeForm.isPinned)} onChange={(e) => setNoticeForm({ ...noticeForm, isPinned: e.target.checked })} /> 상단 고정하기
                  </label>
                </div>
                <button style={{ ...button("#0f172a", "#fff"), padding: "14px 16px" }}>{noticeForm.id ? "수정 저장" : "공지 등록"}</button>
                {noticeForm.id && <button type="button" onClick={() => setNoticeForm(emptyNotice)} style={button("#fff", "#0f172a", "#cbd5e1")}>작성 취소</button>}
              </div>
            </form>

            <div style={cardStyle}>
              <SectionTitle title="공지 목록" desc="왼쪽 손잡이를 드래그해서 노출 순서를 변경할 수 있습니다." />
              {savingOrder && <p style={{ margin: "-4px 0 12px", color: "#2563eb", fontSize: 13, fontWeight: 800 }}>순서를 저장하는 중입니다...</p>}
              <div style={{ display: "grid", gap: 12 }}>
                {notices.length === 0 && <EmptyMessage>등록된 공지사항이 없습니다.</EmptyMessage>}
                {notices.map((item, index) => {
                  const isDragging = draggingNoticeId === item.id;
                  const isDragOver = dragOverNoticeId === item.id;
                  return (
                    <article
                      key={item.id}
                      draggable
                      onDragStart={(event) => handleNoticeDragStart(item.id, event)}
                      onDragOver={(event) => handleNoticeDragOver(item.id, event)}
                      onDrop={(event) => handleNoticeDrop(item.id, event)}
                      onDragEnd={handleNoticeDragEnd}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "44px 1fr",
                        gap: 14,
                        border: item.isPinned ? "1px solid #bfdbfe" : "1px solid #e2e8f0",
                        borderRadius: 22,
                        padding: 16,
                        background: item.isPinned ? "linear-gradient(135deg,#eff6ff,#ffffff)" : "#fff",
                        boxShadow: isDragOver ? "0 0 0 3px rgba(37,99,235,0.18)" : "0 10px 28px rgba(15,23,42,0.045)",
                        opacity: isDragging ? 0.45 : 1,
                        transform: isDragging ? "scale(0.99)" : "none",
                      }}
                    >
                      <div title="드래그해서 순서 변경" style={{ display: "grid", placeItems: "center", alignSelf: "stretch", minHeight: 86, borderRadius: 16, background: "#f1f5f9", color: "#64748b", cursor: "grab", fontSize: 20, fontWeight: 900, userSelect: "none" }}>☰</div>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            <span style={{ display: "grid", placeItems: "center", width: 24, height: 24, borderRadius: 999, background: "#f1f5f9", color: "#64748b", fontSize: 12, fontWeight: 900 }}>{index + 1}</span>
                            <strong style={{ fontSize: 16, letterSpacing: "-0.02em" }}>{item.title}</strong>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                            {item.isPinned && <Badge bg="#dbeafe" color="#1d4ed8">📌 고정</Badge>}
                            <Badge bg={item.isPublished ? "#dcfce7" : "#f1f5f9"} color={item.isPublished ? "#15803d" : "#64748b"}>{item.isPublished ? "공개" : "비공개"}</Badge>
                          </div>
                        </div>
                        <p style={{ color: "#64748b", fontSize: 13, margin: "0 0 8px" }}>{item.tag} · {item.date}</p>
                        <p style={{ color: "#334155", whiteSpace: "pre-wrap", lineHeight: 1.65, margin: "0 0 14px" }}>{item.content}</p>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <button onClick={() => updateNoticePin(item.id, !item.isPinned)} style={button(item.isPinned ? "#fff" : "#eff6ff", "#1d4ed8", "#bfdbfe")}>{item.isPinned ? "고정 해제" : "상단 고정"}</button>
                          <button onClick={() => requestNoticeEdit(item)} style={button("#eff6ff", "#1d4ed8")}>수정</button>
                          <button onClick={() => requestNoticeDelete(item.id)} style={button("#fee2e2", "#991b1b")}>삭제</button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {confirmModal && (
        <ConfirmModal
          title={confirmModal.title}
          description={confirmModal.description}
          confirmText={confirmModal.confirmText}
          danger={confirmModal.danger}
          onCancel={() => setConfirmModal(null)}
          onConfirm={runConfirmAction}
        />
      )}

      <style jsx>{`
        @media (max-width: 900px) {
          .admin-grid { grid-template-columns: 1fr !important; }
          .notice-form-card { position: static !important; }
        }
        @media (max-width: 540px) {
          .form-two-cols { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}

function SectionTitle({ title, desc }: { title: string; desc?: string }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <h2 style={{ margin: 0, fontSize: 20, letterSpacing: "-0.04em" }}>{title}</h2>
      {desc && <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: 13, lineHeight: 1.6 }}>{desc}</p>}
    </div>
  );
}

function EmptyMessage({ children }: { children: React.ReactNode }) {
  return <p style={{ color: "#64748b", margin: 0, padding: 18, border: "1px dashed #cbd5e1", borderRadius: 18, background: "#f8fafc" }}>{children}</p>;
}

function Badge({ children, bg, color }: { children: React.ReactNode; bg: string; color: string }) {
  return <span style={{ display: "inline-flex", alignItems: "center", padding: "5px 9px", borderRadius: 999, background: bg, color, fontSize: 12, fontWeight: 900 }}>{children}</span>;
}

function StatusBadge({ status }: { status: Inquiry["status"] }) {
  if (status === "new") return <Badge bg="#dbeafe" color="#1d4ed8">신규</Badge>;
  if (status === "read") return <Badge bg="#fef3c7" color="#b45309">확인 중</Badge>;
  return <Badge bg="#dcfce7" color="#15803d">처리 완료</Badge>;
}

function Toast({ message, type = "success", onClose }: { message: string; type?: "success" | "error"; onClose: () => void }) {
  const isError = type === "error";
  return (
    <div style={{ position: "fixed", left: "50%", bottom: 28, transform: "translateX(-50%)", zIndex: 80, width: "calc(100% - 32px)", maxWidth: 420 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", border: `1px solid ${isError ? "#fecaca" : "#bbf7d0"}`, borderRadius: 18, boxShadow: "0 18px 60px rgba(15,23,42,0.18)", padding: "14px 16px" }}>
        <div style={{ width: 34, height: 34, borderRadius: 999, display: "grid", placeItems: "center", flexShrink: 0, background: isError ? "#fee2e2" : "#dcfce7", color: isError ? "#dc2626" : "#16a34a", fontWeight: 900 }}>
          {isError ? "!" : "✓"}
        </div>
        <div style={{ flex: 1, color: "#111827", fontWeight: 800, fontSize: 14 }}>{message}</div>
        <button type="button" onClick={onClose} aria-label="알림 닫기" style={{ border: 0, background: "transparent", color: "#9ca3af", fontSize: 20, lineHeight: 1, cursor: "pointer" }}>×</button>
      </div>
    </div>
  );
}

function ConfirmModal({
  title,
  description,
  confirmText = "확인",
  danger = false,
  onCancel,
  onConfirm,
}: {
  title: string;
  description: string;
  confirmText?: string;
  danger?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 70, display: "grid", placeItems: "center", padding: 20, background: "rgba(15,23,42,0.48)", backdropFilter: "blur(4px)" }}>
      <div style={{ width: "100%", maxWidth: 430, background: "#fff", borderRadius: 22, padding: 24, boxShadow: "0 24px 80px rgba(15,23,42,0.28)" }}>
        <div style={{ width: 48, height: 48, borderRadius: 999, display: "grid", placeItems: "center", marginBottom: 16, background: danger ? "#fee2e2" : "#eff6ff", color: danger ? "#dc2626" : "#2563eb", fontWeight: 900, fontSize: 22 }}>
          {danger ? "!" : "?"}
        </div>
        <h3 style={{ margin: "0 0 8px", fontSize: 22, letterSpacing: "-0.04em" }}>{title}</h3>
        <p style={{ margin: "0 0 22px", color: "#6b7280", lineHeight: 1.6, fontSize: 14 }}>{description}</p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, flexWrap: "wrap" }}>
          <button type="button" onClick={onCancel} style={button("#fff", "#111827", "#d1d5db")}>취소</button>
          <button type="button" onClick={onConfirm} style={button(danger ? "#dc2626" : "#111827", "#fff")}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}

function button(bg: string, color: string, border = "transparent"): React.CSSProperties {
  return {
    padding: "11px 14px",
    borderRadius: 13,
    border: `1px solid ${border}`,
    background: bg,
    color,
    fontWeight: 850,
    cursor: "pointer",
    boxShadow: bg === "#0f172a" || bg === "#111827" ? "0 12px 24px rgba(15,23,42,0.12)" : "none",
  };
}

function tabButton(active: boolean): React.CSSProperties {
  return {
    ...button(active ? "#0f172a" : "transparent", active ? "#fff" : "#334155", "transparent"),
    boxShadow: active ? "0 10px 22px rgba(15,23,42,0.13)" : "none",
  };
}

function Stat({ title, value, accent }: { title: string; value: number; accent: string }) {
  return (
    <div style={{ ...cardStyle, padding: 20, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", right: -18, top: -18, width: 72, height: 72, borderRadius: 999, background: accent, opacity: 0.12 }} />
      <div style={{ color: "#64748b", fontSize: 13, marginBottom: 10, fontWeight: 800 }}>{title}</div>
      <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between" }}>
        <div style={{ fontSize: 32, fontWeight: 950, letterSpacing: "-0.04em" }}>{value}</div>
        <div style={{ width: 10, height: 10, borderRadius: 999, background: accent }} />
      </div>
    </div>
  );
}
