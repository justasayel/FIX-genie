import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, IssueType, Severity } from "../types";

export const analyzeIssue = async (
  images: File[],
  description: string,
  location: string
): Promise<AnalysisResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Convert images to base64
  const imageParts = await Promise.all(
    images.map(async (file) => {
      const base64Data = await fileToGenerativePart(file);
      return {
        inlineData: {
          data: base64Data,
          mimeType: file.type || 'image/jpeg', // Fallback for some devices
        },
      };
    })
  );

  const prompt = `
    You are an expert AI home and auto repair diagnostician. 
    Analyze the provided image(s) and the user's description: "${description || 'No description provided'}".
    The user is located in: "${location}".

    Determine:
    1. The specific problem.
    2. The severity (Low, Medium, High, Dangerous).
    3. Whether this is a "Simple DIY" fix for a novice or "Needs Professional" help.
       - IMPORTANT: If the issue involves gas, dangerous electrical work, structural integrity, or complex auto engine internal work, ALWAYS classify as "Needs Professional".
       - If it is a simple clog, flat tire change (if safe), minor scratch, or simple part replacement, classify as "Simple DIY".
    4. Categorize the specialty (Plumbing, Electrical, Auto, HVAC, Construction, General).
    5. Provide a summary and possible cause.

    If it is "Simple DIY", provide a step-by-step guide.
    If it is "Needs Professional" (or even if DIY, for the record), provide a technical report object for a technician.
  `;

  // Define the schema for structured JSON output
  const schema = {
    type: Type.OBJECT,
    properties: {
      classification: { type: Type.STRING, enum: ["Simple DIY", "Needs Professional"] },
      severity: { type: Type.STRING, enum: [Severity.LOW, Severity.MEDIUM, Severity.HIGH, Severity.DANGEROUS] },
      summary: { type: Type.STRING },
      possibleCause: { type: Type.STRING },
      detectedSpecialty: { type: Type.STRING, enum: [IssueType.PLUMBING, IssueType.ELECTRICAL, IssueType.AUTO, IssueType.HVAC, IssueType.CONSTRUCTION, IssueType.GENERAL] },
      diyGuide: {
        type: Type.OBJECT,
        nullable: true,
        properties: {
          steps: { type: Type.ARRAY, items: { type: Type.STRING } },
          tools: { type: Type.ARRAY, items: { type: Type.STRING } },
          timeEstimate: { type: Type.STRING },
          safetyWarnings: { type: Type.ARRAY, items: { type: Type.STRING } },
        }
      },
      technicianReport: {
        type: Type.OBJECT,
        properties: {
          problemTitle: { type: Type.STRING },
          description: { type: Type.STRING },
          suspectedCause: { type: Type.STRING },
          urgency: { type: Type.STRING },
          requiredSkills: { type: Type.STRING },
        }
      }
    },
    required: ["classification", "severity", "summary", "possibleCause", "detectedSpecialty", "technicianReport"]
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [
        {
          role: "user",
          parts: [...imageParts, { text: prompt }]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    let text = response.text;
    if (!text) throw new Error("No response from AI");
    
    // Clean potential markdown wrapping often added by LLMs
    text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    
    return JSON.parse(text) as AnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

async function fileToGenerativePart(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}