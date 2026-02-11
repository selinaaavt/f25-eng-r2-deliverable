/* eslint-disable */
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const systemInstruction = `
You are a helpful assistant that ONLY answers questions about species, animals, and related topics.
If a user asks something unrelated, politely respond that you only handle species questions.
`;

export async function generateResponse(message: string): Promise<string> {
  try {
    if (!message.trim()) return "Please ask a question about species or animals.";

    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      systemInstruction: systemInstruction,
    });

    const result = await model.generateContent(message);
    const response = result.response.text();
    
    return response || "Sorry, I could not generate a response at this time.";
  } catch (error) {
    console.error("LLM error:", error);
    return "Sorry, I'm having trouble answering that right now.";
  }
}