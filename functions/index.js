// functions/index.js

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const targetUrl = url.searchParams.get('q');
  
  if (!targetUrl) {
    return new Response("Please specify a URL using ?q=URL parameter.", {
      status: 400
    });
  }
  
  try {
    const response = await fetch(targetUrl);
    
    if (!response.ok) {
      throw new Error(`Error fetching content: ${response.status} ${response.statusText}`);
    }
    
    const content = await response.text();
    return new Response(content, {
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "text/plain",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    return new Response(`Error: ${error.message}`, {
      status: 500
    });
  }
}
