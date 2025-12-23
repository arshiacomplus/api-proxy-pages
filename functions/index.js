// // functions/index.js

// export async function onRequest(context) {
//   const url = new URL(context.request.url);
//   const targetUrl = url.searchParams.get('q');
  
//   if (!targetUrl) {
//     return new Response("Please specify a URL using ?q=URL parameter.", {
//       status: 400
//     });
//   }
  
//   try {
//     const response = await fetch(targetUrl);
    
//     if (!response.ok) {
//       throw new Error(`Error fetching content: ${response.status} ${response.statusText}`);
//     }
    
//     const content = await response.text();
//     return new Response(content, {
//       headers: {
//         "Content-Type": response.headers.get("Content-Type") || "text/plain",
//         "Access-Control-Allow-Origin": "*"
//       }
//     });
//   } catch (error) {
//     return new Response(`Error: ${error.message}`, {
//       status: 500
//     });
//   }
// }

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const targetUrl = url.searchParams.get('q');
  
  if (!targetUrl) {
    return new Response("Error: Missing 'q' parameter.", { status: 400 });
  }

  let validatedUrl;
  try {
    validatedUrl = new URL(targetUrl);
  } catch (e) {
    return new Response("Error: Invalid URL format.", { status: 400 });
  }

  try {
    const response = await fetch(validatedUrl.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      redirect: "follow" 
    });

    if (!response.ok) {
       return new Response(`Error fetching source: ${response.status}`, { status: response.status });
    }

    const contentType = response.headers.get("Content-Type") || "";

    const isAnimApi = targetUrl.includes("animapi");
    const isImage = contentType.startsWith("image/");

    if (!isAnimApi && !isImage) {
        return new Response("Forbidden: The target is NOT an image.", { 
            status: 415, 
            headers: { "Access-Control-Allow-Origin": "*" }
        });
    }
    
    const newHeaders = new Headers(response.headers);
    newHeaders.delete("Content-Encoding");
    newHeaders.delete("Content-Length");
    newHeaders.set("Access-Control-Allow-Origin", "*");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    });

  } catch (error) {
    return new Response(`Fetch Error: ${error.message}`, { status: 500 });
  }
}
