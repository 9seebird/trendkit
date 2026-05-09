import { NextResponse } from "next/server";
import { createId, readCMSData, sortNotices, writeCMSData } from "@/lib/cms-store";

export async function GET() {
  const data = await readCMSData();
  const notices = data.notices
    .filter((notice) => notice.isPublished)
    .sort(sortNotices);

  return NextResponse.json({ notices });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ message: "잘못된 요청입니다." }, { status: 400 });
  }

  const name = String(body.name || "").trim().slice(0, 50);
  const email = String(body.email || "").trim().slice(0, 120);
  const type = String(body.type || "기타 문의").trim().slice(0, 50);
  const message = String(body.message || "").trim().slice(0, 3000);

  if (!name || !email || !message) {
    return NextResponse.json(
      { message: "이름, 이메일, 내용을 입력해주세요." },
      { status: 400 }
    );
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json(
      { message: "이메일 형식을 확인해주세요." },
      { status: 400 }
    );
  }

  const now = new Date().toISOString();
  const data = await readCMSData();

  const inquiry = {
    id: createId("inquiry"),
    name,
    email,
    type,
    message,
    status: "new" as const,
    createdAt: now,
    updatedAt: now,
  };

  data.inquiries = [inquiry, ...data.inquiries];
  await writeCMSData(data);

  return NextResponse.json({ ok: true });
}
