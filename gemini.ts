
import { GoogleGenAI, Type } from "@google/genai";
import { SHELI_SYSTEM_PROMPT } from "../constants";
import { RightCard } from "../types";

// Fix: Creating fresh instance and using correct response properties as per Gemini API guidelines.
export const getGeminiResponse = async (userPrompt: string, reportContext?: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let fullSystemInstruction = SHELI_SYSTEM_PROMPT;
  if (reportContext) {
    fullSystemInstruction += `\n\nהקשר נוכחי: המשתמש קיבל דו"ח זכויות הכולל: ${JSON.stringify(reportContext)}. עני על שאלות בהתבסס על מידע זה.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: fullSystemInstruction,
        temperature: 0.7,
      },
    });
    // Fix: Access .text property directly (not a method).
    return response.text || "מצטערת, לא הצלחתי למצוא תשובה מדויקת.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "מצטערת, נתקלתי בקושי קטן. תוכלי לשאול שוב?";
  }
};

// Fix: Adding thinkingBudget for complex reasoning and handling grounding metadata.
export const analyzeRights = async (profileData: any): Promise<RightCard[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `את/ה המומחה/ית הבכיר/ה ביותר בישראל למיצוי זכויות (תואם 'זכותי' או 'לבנת פורן' אבל בחינם ובשירות האזרח).
  
  פרופיל המשתמש המעמיק:
  ${JSON.stringify(profileData, null, 2)}
  
  משימה:
  הפק/י דו"ח זכויות מפורט ומקצועי. עבור כל זכות שזוהתה, ספק/י:
  1. כותרת ותיאור בשפה אנושית ומונגשת.
  2. הרשות האחראית (ביטוח לאומי, מס הכנסה, משרד הבריאות וכו').
  3. שווי כספי שנתי מוערך (אם רלוונטי).
  4. תיאור הזכות בפועל (מה מקבלים?).
  5. סדר פעולות מדויק למימוש: היכן מגישים (אונליין/פיזי), קישורים רשמיים (.gov.il), וצפי למשך טיפול.
  6. רשימת מסמכים ואישורים שצריך להכין מראש.
  7. המלצות להמשך וטיפ מקצועי מ'שלי'.
  
  השתמש/י בחיפוש גוגל למציאת הקישורים הרשמיים המעודכנים ביותר.
  
  החזר/י מערך JSON בלבד בפורמט הנדרש.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // Fix: Added thinkingBudget for gemini-3-pro-preview to improve reasoning quality for this complex task.
        thinkingConfig: { thinkingBudget: 32768 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              authority: { type: Type.STRING },
              location: { type: Type.STRING },
              priority: { type: Type.STRING, description: 'critical, important, recommended, future' },
              estimatedValue: { type: Type.STRING },
              numericValue: { type: Type.NUMBER },
              requirements: { type: Type.ARRAY, items: { type: Type.STRING } },
              actionSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
              officialLink: { type: Type.STRING },
              documentsToPrepare: { type: Type.ARRAY, items: { type: Type.STRING } },
              estimatedProcessingTime: { type: Type.STRING },
              recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
              sources: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    uri: { type: Type.STRING }
                  }
                }
              }
            },
            required: ["id", "title", "description", "authority", "priority", "actionSteps", "documentsToPrepare"]
          }
        }
      },
    });
    
    // Fix: Accessing .text directly as per SDK requirements.
    const text = response.text;
    if (!text) return [];

    // Fix: Extracting grounding URLs as required when using googleSearch tool.
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const searchLinks = groundingChunks
      .filter(chunk => chunk.web)
      .map(chunk => ({
        title: chunk.web?.title || 'מקור רשמי',
        uri: chunk.web?.uri || ''
      }));

    try {
      const data = JSON.parse(text.trim());
      if (Array.isArray(data)) {
        return data.map(item => ({
          ...item,
          // Merging model-provided sources with actual search grounding chunks for accuracy.
          sources: [...(item.sources || []), ...searchLinks]
        }));
      }
      return [];
    } catch (e) {
      console.error("Failed to parse report JSON:", e);
      return [];
    }
  } catch (error) {
    console.error("Analysis Error:", error);
    return [];
  }
};
