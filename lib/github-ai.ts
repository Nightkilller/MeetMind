import ModelClient from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

// Client will be instantiated lazily to prevent build errors when env vars are missing
let client: ReturnType<typeof ModelClient> | null = null;

function getClient() {
  if (!client) {
    client = ModelClient(
      "https://models.inference.ai.azure.com",
      new AzureKeyCredential(process.env.GITHUB_AI_TOKEN || "dummy_token_for_build")
    );
  }
  return client;
}

export async function analyzeSentiment(
  transcript: string
): Promise<"positive" | "negative" | "neutral"> {
  try {
    const response = await getClient().path("/chat/completions").post({
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
