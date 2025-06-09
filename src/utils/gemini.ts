// src/utils/gemini.ts
export async function queryGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API key is not set");
  }

  try {
    // Update this URL to the correct Gemini API endpoint
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API request failed: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Gemini API response:", data);
    // Adjust based on the actual response structure
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini API";
  } catch (error) {
    console.error("Error in queryGemini:", error);
    throw new Error(`Failed to query Gemini API: ${error}`);
  }
}