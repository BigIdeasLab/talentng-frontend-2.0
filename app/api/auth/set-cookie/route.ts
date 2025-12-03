import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    const response = NextResponse.json({ success: true });

    // Set the token as a cookie on the server side
    response.cookies.set("accessToken", token, {
      path: "/",
      maxAge: 604800, // 7 days
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: false, // Allow client-side access for debugging
    });

    console.log("[API] Set accessToken cookie server-side");

    return response;
  } catch (error) {
    console.error("[API] Error setting cookie:", error);
    return NextResponse.json(
      { error: "Failed to set cookie" },
      { status: 500 }
    );
  }
}
