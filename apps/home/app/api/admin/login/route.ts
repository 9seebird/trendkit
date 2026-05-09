import { NextResponse } from "next/server";
import { createSessionToken, getAdminPassword, setAdminCookie } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const { password } = await request.json().catch(() => ({ password: "" }));

  if (!password || password !== getAdminPassword()) {
    return NextResponse.json({ message: "비밀번호가 올바르지 않습니다." }, { status: 401 });
  }

  await setAdminCookie(createSessionToken());
  return NextResponse.json({ ok: true });
}
