import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const publicRoute = [""];

export default auth((req) => {
  // console.log(req.auth);
  const pathname = req.nextUrl.pathname;
  console.log("Requesting for", pathname);

  if (publicRoute.includes(pathname)) {
    return NextResponse.next();
  }

  if (req.auth) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/api/auth/signin", req.nextUrl));
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
