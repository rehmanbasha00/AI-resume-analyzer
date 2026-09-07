import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Sends a prompt to Gemini and returns the reply as plain text.
// Tries again a couple times if the free server is busy (503 error).
export async function askClaude(prompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      if (attempt === 3) throw err;
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  return "";
}

// Some prompts ask AI to reply only in JSON.
// This cleans up ```json fences if AI adds them, then parses it.
export function parseJsonReply<T>(raw: string): T {
  const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(cleaned) as T;
}
