/* eslint-disable */
// TODO: Import whatever service you decide to use. i.e. `import OpenAI from 'openai';`

// HINT: You'll want to initialize your service outside of the function definition

// TODO: Implement the function below
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const systemInstruction = `
You are a helpful assistant that ONLY answers questions about species, animals, and related topics.
If a user asks something unrelated, politely respond that you only handle species questions.
`;

export async function generateResponse(message: string): Promise<string> {
  try {
    if (!message.trim()) return "Please ask a question about species or animals.";

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: message },
      ],
    });

    const response = completion.choices[0]?.message?.content?.trim();
    return response || "Sorry, I could not generate a response at this time.";
  } catch (error) {
    console.error("LLM error:", error);
    return "Sorry, I’m having trouble answering that right now.";
  }
}
