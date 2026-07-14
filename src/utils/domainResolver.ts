import { GoogleGenAI } from "@google/genai";

export async function getDomainFromSoftwareName(name: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined");
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `You are a domain name resolver. The user searched for a software or brand called: "${name}". 
  Respond with ONLY the primary official domain name of this software/brand.
  Do not include https://, www, paths, or any explanation. Example: Figma -> figma.com, Photoshop -> adobe.com, VS Code -> visualstudio.com
  If you can't figure it out, return "unknown".`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.1,
        maxOutputTokens: 20 }
    });

    const domain = response.text?.trim() || "unknown";
    return domain;
  } catch (error) {
    console.error("Error resolving domain:", error);
    return "unknown";
  }
}
