// start configuration -----------------------------

// when a request is made, any other requests that arrive
// within 200ms will be batched with it, requests made after
// that window will create a new batched request
const BATCH_WINDOW_SIZE_IN_MS = 200;

// specify which requests you want to intercept
// this could based on be the url, body, headers etc...
const requestMatcher = ({ url }) => new URL(url).host.endsWith("solana.com");

// end configuration -------------------------------

self.addEventListener("fetch", (event: FetchEvent) => {
  // only intercept requests that are selected
  // with the above requestMatcher(request) function
  if (requestMatcher(event.request)) {
    event.respondWith(batchedFetch(event.request));
  }
});

/**
 * accepts a Request, includes it in a batched request
 * waits for the response, extracts the correct data and
 * returns it as a Response
 */
const batchedFetch = (request) =>
  new Promise<Response>((resolve) => {
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
  // inject all request bodies into first request

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
  event.waitUntil((self as any).clients.claim());
  console.log("sidekick ready!");
});

self.addEventListener("install", function () {
  (self as any).skipWaiting();
});
