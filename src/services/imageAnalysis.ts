import { GoogleGenAI } from "@google/genai";

export async function analyzeImageFile(base64Image: string, mimeType: string): Promise<string> {
  const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");
  
  const response = await fetch('/api/search/screenshot', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ base64Image: cleanBase64, mimeType })
  });

  if (!response.ok) {
    let errMsg = 'Failed to analyze image.';
    try {
      const errData = await response.json();
      if (errData?.error) errMsg = errData.error;
    } catch(e) {}
    throw new Error(errMsg);
  }

  const data = await response.json();
  return data.title;
}
