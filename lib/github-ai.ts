import ModelClient from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

const client = ModelClient(
  "https://models.inference.ai.azure.com",
  new AzureKeyCredential(process.env.GITHUB_AI_TOKEN!)
);

export async function analyzeSentiment(
  transcript: string
): Promise<"positive" | "negative" | "neutral"> {
  try {
    const response = await client.path("/chat/completions").post({
      body: {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "Analyze the sentiment of this meeting transcript. " +
              "Return ONLY one word: positive, negative, or neutral. " +
              "No punctuation, no explanation, just the one word.",
          },
          {
            role: "user",
            content: transcript.slice(0, 3000),
          },
        ],
        max_tokens: 10,
        temperature: 0.1,
      },
    });

    const raw = (response.body as any)
      ?.choices?.[0]
      ?.message
      ?.content
      ?.trim()
      ?.toLowerCase();

    if (raw === "positive" || raw === "negative" || raw === "neutral") {
      return raw;
    }
    return "neutral";
  } catch (error) {
    console.error("GitHub AI sentiment error:", error);
    return "neutral";
  }
}
