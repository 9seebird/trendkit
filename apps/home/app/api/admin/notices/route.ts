import { NextResponse } from "next/server";
import { isAdminLoggedIn } from "@/lib/admin-auth";
import { createId, readCMSData, sortNotices, todayText, writeCMSData, type Notice } from "@/lib/cms-store";

async function requireAdmin() {
  if (!(await isAdminLoggedIn())) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }
  return null;
}

function normalizeNoticeOrder(notices: Notice[]) {
  return [...notices]
    .sort(sortNotices)
    .map((notice, index) => ({ ...notice, order: index }));
}

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const data = await readCMSData();
  return NextResponse.json({ notices: normalizeNoticeOrder(data.notices) });
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await request.json();
  const now = new Date().toISOString();
  const data = await readCMSData();

  const notice = {
    id: createId("notice"),
    tag: String(body.tag || "공지").slice(0, 20),
    tagColor: String(body.tagColor || "#dcfce7"),
    tagText: String(body.tagText || "#15803d"),
    title: String(body.title || "").trim().slice(0, 120),
    content: String(body.content || "").trim().slice(0, 3000),
    date: String(body.date || todayText()),
    isPublished: Boolean(body.isPublished ?? true),
    isPinned: Boolean(body.isPinned ?? false),
    order: 0,
    createdAt: now,
    updatedAt: now,
  };

  if (!notice.title) {
    return NextResponse.json({ message: "공지 제목을 입력해주세요." }, { status: 400 });
  }

  data.notices = normalizeNoticeOrder([notice, ...data.notices]);
  await writeCMSData(data);
  return NextResponse.json({ notice });
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await request.json();
  const data = await readCMSData();
  const target = data.notices.find((notice) => notice.id === body.id);

  if (!target) {
    return NextResponse.json({ message: "공지사항을 찾을 수 없습니다." }, { status: 404 });
  }

  target.tag = String(body.tag ?? target.tag).slice(0, 20);
  target.tagColor = String(body.tagColor ?? target.tagColor);
  target.tagText = String(body.tagText ?? target.tagText);
  target.title = String(body.title ?? target.title).trim().slice(0, 120);
  target.content = String(body.content ?? target.content).trim().slice(0, 3000);
  target.date = String(body.date ?? target.date);
  target.isPublished = Boolean(body.isPublished);
  target.isPinned = Boolean(body.isPinned);
  target.updatedAt = new Date().toISOString();

  if (!target.title) {
    return NextResponse.json({ message: "공지 제목을 입력해주세요." }, { status: 400 });
  }

  data.notices = normalizeNoticeOrder(data.notices);
  await writeCMSData(data);
  return NextResponse.json({ notice: target });
}

export async function PATCH(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await request.json();
  const data = await readCMSData();

  if (body.action === "reorder") {
    const orderedIds = Array.isArray(body.orderedIds)
      ? body.orderedIds.map((id: unknown) => String(id))
      : [];

    if (orderedIds.length === 0) {
      return NextResponse.json({ message: "변경할 순서 정보가 없습니다." }, { status: 400 });
    }

    const noticeById = new Map(data.notices.map((notice) => [notice.id, notice]));
    const reordered = orderedIds
      .map((id: string) => noticeById.get(id))
      .filter(Boolean) as Notice[];
    const missing = data.notices.filter((notice) => !orderedIds.includes(notice.id));

    data.notices = [...reordered, ...missing].map((notice, index) => ({
      ...notice,
      order: index,
      updatedAt: notice.updatedAt,
    }));

    await writeCMSData(data);
    return NextResponse.json({ notices: normalizeNoticeOrder(data.notices) });
  }

  const target = data.notices.find((notice) => notice.id === body.id);

  if (!target) {
    return NextResponse.json({ message: "공지사항을 찾을 수 없습니다." }, { status: 404 });
  }

  if (body.action === "pin") {
    target.isPinned = Boolean(body.isPinned);
    target.updatedAt = new Date().toISOString();
    data.notices = normalizeNoticeOrder(data.notices);
    await writeCMSData(data);
    return NextResponse.json({ notices: data.notices });
  }

  if (body.action === "move") {
    const direction = body.direction === "down" ? "down" : "up";
    const ordered = normalizeNoticeOrder(data.notices);
    const currentIndex = ordered.findIndex((notice) => notice.id === body.id);
    const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= ordered.length) {
      return NextResponse.json({ notices: ordered });
    }

    [ordered[currentIndex], ordered[nextIndex]] = [ordered[nextIndex], ordered[currentIndex]];
    data.notices = ordered.map((notice, index) => ({ ...notice, order: index }));
    await writeCMSData(data);
    return NextResponse.json({ notices: data.notices });
  }

  return NextResponse.json({ message: "지원하지 않는 작업입니다." }, { status: 400 });
}

export async function DELETE(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await request.json();
  const data = await readCMSData();
  data.notices = normalizeNoticeOrder(data.notices.filter((notice) => notice.id !== id));
  await writeCMSData(data);
  return NextResponse.json({ ok: true });
}
