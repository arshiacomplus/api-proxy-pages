addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});
async function handleRequest(request) {
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get('q');
  if (!targetUrl) {
    return new Response('لطفاً یک URL در پارامتر کوئری "q" ارائه دهید. مثال: /?q=https://example.com', { status: 400 });
  }
  try {
    const validTargetUrl = new URL(targetUrl);
    const response = await fetch(validTargetUrl.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: 'follow'
    });
    const responseBody = await response.arrayBuffer();
    const headers = new Headers(response.headers);
    return new Response(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: headers
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    return new Response(`خطا در واکشی محتوا: ${error.message}`, { status: 500 });
  }
}
