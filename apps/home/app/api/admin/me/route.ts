import { NextResponse } from "next/server";
import { isAdminLoggedIn } from "@/lib/admin-auth";

export async function GET() {
  return NextResponse.json({ loggedIn: await isAdminLoggedIn() });
}
