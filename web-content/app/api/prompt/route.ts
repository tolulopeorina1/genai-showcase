const API_GATEWAY_URL =
  "https://rpwzbqjh4onmdvkp6rglixuzcm0qdqcm.lambda-url.us-east-1.on.aws/"; // Replace with actual AWS Lambda URL

const API_GATEWAY_URL2 =
  "https://kq7ajxkuuhk2vojrnmspjmrsay0wehsu.lambda-url.us-east-1.on.aws/"; // Replace with actual AWS Lambda URL

export async function POST(req: Request) {
  const { prompt } = await req.json();

  if (!prompt) {
    return new Response(JSON.stringify({ error: "Prompt is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const response = await fetch(API_GATEWAY_URL2, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!response.body) {
      throw new Error("No response body from AWS Lambda.");
    }

    return new Response(iteratorToStream(response.body.getReader()), {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Error in API route:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

function iteratorToStream(reader: ReadableStreamDefaultReader<Uint8Array>) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await reader.read();

      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}
