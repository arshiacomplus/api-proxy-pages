// functions/index.js

export async function onRequest(context) {
  // دریافت URL از پارامتر query
  const url = new URL(context.request.url);
  const targetUrl = url.searchParams.get('q');
  
  if (!targetUrl) {
    return new Response("لطفا یک URL با استفاده از ?q=URL مشخص کنید.", {
      status: 400
    });
  }
  
  try {
    // دریافت محتوا از URL هدف
    const response = await fetch(targetUrl);
    
    if (!response.ok) {
      throw new Error(`خطا در دریافت محتوا: ${response.status} ${response.statusText}`);
    }
    
    // برگرداندن محتوا با هدرهای مناسب
    const content = await response.text();
    return new Response(content, {
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "text/plain",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    return new Response(`خطا: ${error.message}`, {
      status: 500
    });
  }
}
