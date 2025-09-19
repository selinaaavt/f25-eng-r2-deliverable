/* eslint-disable */
import { NextResponse, type NextRequest } from "next/server";
import { generateResponse } from "@/lib/services/species-chat";

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();

    // Narrow the type
    if (
      typeof body !== "object" ||
      body === null ||
      !("message" in body) ||
      typeof (body as any).message !== "string"
    ) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const message = (body as { message: string }).message;
    const response = await generateResponse(message);
    return NextResponse.json({ response });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Upstream error" }, { status: 502 });
  }
}
