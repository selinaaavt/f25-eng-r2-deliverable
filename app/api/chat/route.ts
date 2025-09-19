/* eslint-disable */
// TODO: Implement this file
import { NextResponse } from "next/server";
import { generateResponse } from "@/lib/services/species-chat";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const response = await generateResponse(message);
    return NextResponse.json({ response });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Upstream error" }, { status: 502 });
  }
}
