// app : /proxy.ts

import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const cookies = request.cookies;
  const token = cookies.has("token");

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!login(?:/|$)|.*\\.(?:css|js)$).*)"],
};
