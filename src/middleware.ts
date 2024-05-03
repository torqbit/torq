import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import appConstant from "@/services/appConstant";

export let cookieName = appConstant.development.cookieName;

if (process.env.NEXT_PUBLIC_APP_ENV === "production") {
  cookieName = appConstant.production.cookieName;
}

export default async function middleware(req: NextRequest, event: NextFetchEvent) {
  const token = await getToken({
    req,
    secret: process.env.NEXT_PUBLIC_SECRET,
    cookieName,
  });
  console.log(token, "token in middleware");
  const isAuthenticated = token != null;
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token != null && !token.isActive) {
    return NextResponse.redirect(new URL("/in-active-user", req.url));
  }

  if (req.nextUrl.pathname === "/" && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (req.nextUrl.pathname.startsWith("/login") && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (req.nextUrl.pathname.startsWith("/program/:path*") && isAuthenticated && token.role !== "AUTHOR") {
    return NextResponse.redirect(new URL("/programs", req.url));
  }
  if (req.nextUrl.pathname.startsWith("/program/add-program") && isAuthenticated && token.role !== "AUTHOR") {
    return NextResponse.redirect(new URL("/programs", req.url));
  }
}

export const config = {
  matcher: [
    "/",
    "/courses",
    "/guides",
    "/quizzes",
    "/add-course",
    "/learn/course/:path*",
    "/enroll-courses/",
    "/course/about/:path*",
    "/dashboard",
    "/profile",
    "/admin/:path*",
    "/program/:path*/course/:path*",
    "/program/add-program",
    "/setting",
  ],
};
