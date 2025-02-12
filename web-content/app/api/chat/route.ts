// app/api/chat/route.ts

export async function POST(req: Request) {
  const encoder = new TextEncoder();
  const { prompt, conversation_id } = await req.json();

  // Create a stream
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Your AI integration code here
        // For each chunk of response, send it like this:
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              contentBlockDelta: {
                delta: { text: "Your text here" }
              }
            })}\n\n`
          )
        );
      } catch (error) {
        controller.error(error);
      } finally {
        controller.close();
      }
    }
  });

  // Return the stream with proper headers
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}