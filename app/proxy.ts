// app : /proxy.ts

import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const cookies = request.cookies;
  const token = cookies.has("token");

  if (!token) {
    if (request.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/welcome", request.url));
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!welcome(?:/|$)|proceed(?:/|$)|signup(?:/|$)|login(?:/|$)|.*\\.(?:css|js)$).*)"],
};
