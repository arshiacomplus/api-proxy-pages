addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get('q'); // دریافت URL از پارامتر کوئری 'q'

  // اگر پارامتر 'q' وجود نداشت یا خالی بود
  if (!targetUrl) {
    return new Response('لطفاً یک URL در پارامتر کوئری "q" ارائه دهید. مثال: /?q=https://example.com', { status: 400 });
  }

  try {
    // تلاش برای ساختن یک URL معتبر از targetUrl
    const validTargetUrl = new URL(targetUrl);

    // واکشی (fetch) محتوای URL هدف
    // از آنجایی که Worker نقش پروکسی را ایفا می‌کند، مشکلات CORS سمت مرورگر اینجا نخواهند بود.
    const response = await fetch(validTargetUrl.toString(), {
      method: request.method, // حفظ متد اصلی درخواست (GET, POST, etc.)
      headers: request.headers, // حفظ هدرهای اصلی درخواست
      body: request.body, // حفظ بادی اصلی درخواست
      redirect: 'follow' // دنبال کردن ریدایرکت‌ها
    });

    // ساخت یک Response جدید با محتوای دریافتی و هدرهای اصلی
    // این کار برای اطمینان از اینکه هدرهای CORS و Content-Type به درستی منتقل می‌شوند، مهم است.
    const responseBody = await response.arrayBuffer(); // خواندن بادی به عنوان ArrayBuffer
    const headers = new Headers(response.headers);

    // اگر می‌خواهید هدرهای خاصی را حذف کنید یا اضافه کنید، اینجا می‌توانید این کار را انجام دهید.
    // به عنوان مثال، حذف Content-Security-Policy اگر محتوا را تغییر می‌دهید.
    // headers.delete('Content-Security-Policy');

    return new Response(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: headers
    });

  } catch (error) {
    // هندل کردن ارورها، مانند URL نامعتبر یا خطای شبکه
    console.error('Error fetching content:', error);
    return new Response(`خطا در واکشی محتوا: ${error.message}`, { status: 500 });
  }
}