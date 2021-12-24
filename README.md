# Solana Sidekick

### :warning: This is a pre-release! Much more code, docs and tests in the coming week(s)

Demo: https://gootools.github.io/solana-sidekick

[sidekick.js](https://github.com/gootools/solana-sidekick/blob/main/sidekick.js) is a [ServiceWorker](https://developers.google.com/web/fundamentals/primers/service-workers) that automatically batches individual Solana JSON RPC requests without requiring you to change your existing code.

There are a lot of caveats and will be some [open questions](https://github.com/gootools/solana-sidekick/issues). I can almost guarantee you it's not production-ready yet.

## Goals

- Compatible with any JS frontend framework, or lack thereof
- Simple as possible to install and update, ideally requiring no or very little existing code changes
- Provide sensible defaults, offering granular configuration and easy overrides
## Prior Art

Based off https://github.com/johnrees/rate-limited-fetch-service-worker which is no longer needed because either RPCs aren't incorrectly sending CORS errors when rate limiting anymore, or [web3.js](https://github.com/solana-labs/solana-web3.js) is now retrying on CORS errors (I haven't checked recently). [More info](https://github.com/project-serum/anchor/issues/360#issuecomment-860109385)
