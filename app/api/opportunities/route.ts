import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const baseUrl = process.env.NEXT_PUBLIC_TALENTNG_API_URL || "/api/v1";

    // Get token from cookies
    const token = request.cookies.get("accessToken")?.value;

    // Call backend API to save the opportunity
    const response = await fetch(`${baseUrl}/opportunities`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating opportunity:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create opportunity",
      },
      { status: 500 }
    );
  }
}
