import { NextResponse } from "next/server";
import { isAdminLoggedIn } from "@/lib/admin-auth";
import { readCMSData, writeCMSData } from "@/lib/cms-store";

async function requireAdmin() {
  if (!(await isAdminLoggedIn())) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const data = await readCMSData();
  return NextResponse.json({ inquiries: data.inquiries });
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id, status } = await request.json();
  const allowed = ["new", "read", "done"];
  if (!allowed.includes(status)) {
    return NextResponse.json({ message: "상태값이 올바르지 않습니다." }, { status: 400 });
  }

  const data = await readCMSData();
  const target = data.inquiries.find((inquiry) => inquiry.id === id);
  if (!target) {
    return NextResponse.json({ message: "문의를 찾을 수 없습니다." }, { status: 404 });
  }

  target.status = status;
  target.updatedAt = new Date().toISOString();
  await writeCMSData(data);
  return NextResponse.json({ inquiry: target });
}

export async function DELETE(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await request.json();
  const data = await readCMSData();
  data.inquiries = data.inquiries.filter((inquiry) => inquiry.id !== id);
  await writeCMSData(data);
  return NextResponse.json({ ok: true });
}
