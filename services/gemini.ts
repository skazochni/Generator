import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getNumberFact = async (number: number): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Расскажи один очень короткий и удивительный факт о числе ${number} на русском языке. Максимум 1-2 предложения.`,
    });
    return response.text || "";
  } catch (error) {
    console.error("Error fetching fact:", error);
    return "";
  }
};