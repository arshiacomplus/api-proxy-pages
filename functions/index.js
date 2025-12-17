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

// functions/index.js

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const targetUrl = url.searchParams.get('q');
  
  if (!targetUrl) {
    return new Response("Please specify a URL using ?q=URL parameter.", { status: 400 });
  }
  
  try {
    // اضافه کردن User-Agent برای جلوگیری از بلاک شدن توسط برخی سرورها
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    
    // ساخت هدرهای جدید بر اساس پاسخ اصلی
    const newHeaders = new Headers(response.headers);
    
    // *** بخش مهم: حذف هدرهای مزاحم ***
    // این دو هدر باعث خرابی عکس می‌شوند چون کلادفلر خودش مدیریتشان می‌کند
    newHeaders.delete("Content-Encoding");
    newHeaders.delete("Content-Length");
    
    // تنظیم CORS
    newHeaders.set("Access-Control-Allow-Origin", "*");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    });

  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}
