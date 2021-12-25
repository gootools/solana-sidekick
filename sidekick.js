const BATCH_WINDOW_SIZE_IN_MS = 200;
const requestMatcher = ({ url }) => new URL(url).host.endsWith("solana.com");
self.addEventListener("fetch", (event) => {
  if (requestMatcher(event.request)) {
    event.respondWith(batchedFetch(event.request));
  }
});
const batchedFetch = (request) =>
  new Promise((resolve) => {
    debouncedFetch({ request, resolve });
  });
const debounceAndBatch = (fn) => {
  let timeout;
  let args = [];
  const process = () => {
    timeout = null;
    fn(args);
    args = [];
  };
  return (value) => {
    args.push(value);
    if (!timeout) timeout = setTimeout(process, BATCH_WINDOW_SIZE_IN_MS);
  };
};
const debouncedFetch = debounceAndBatch(async (requests) => {
  const allRequestBodies = await Promise.all(
    requests.map(({ request }) => request.json())
  );
  const { request } = requests[0];
  const response = await fetch(request.url, {
    body: JSON.stringify(allRequestBodies),
    headers: request.headers,
    method: request.method,
  });
  const allResults = await response.json();
  allResults.forEach((result, i) => {
    requests[i].resolve(new Response(JSON.stringify(result), response));
  });
});
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
  console.log("sidekick ready!");
});
