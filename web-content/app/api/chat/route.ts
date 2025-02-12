// app/api/chat/route.ts
export const runtime = 'edge'; // Add this line for better streaming support

export async function POST(request: Request) {
  const { prompt, conversation_id } = await request.json();

  // Call your AWS Lambda function
  const response = await fetch('https://cw5fd4g5qhpf35pbno6jyqsy4m0ulhpf.lambda-url.us-east-1.on.aws/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream',  // Add this line
    },
    body: JSON.stringify({ prompt, conversation_id }),
  });

  // Return the stream directly with necessary headers
  return new Response(response.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no'  // Add this to prevent Nginx buffering
    },
  });
}