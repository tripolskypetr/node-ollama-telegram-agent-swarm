import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { app, injectWebSocket } from "src/config/app";
import {
  CC_EXECUTE_TEST,
  CC_WWWROOT_PATH,
  CC_WWWROOT_PORT,
} from "src/config/params";

import "src/routes/complete";
import "src/routes/session";

app.use("/*", serveStatic({ root: CC_WWWROOT_PATH }));

const main = () => {
  if (CC_EXECUTE_TEST) {
    return;
  }
  if (CC_WWWROOT_PORT === -1) {
    return;
  }
  const server = serve({
    fetch: app.fetch,
    port: CC_WWWROOT_PORT,
  });

  server.addListener("listening", () => {
    console.log(`Server listening on http://localhost:${CC_WWWROOT_PORT}`);
  });

  injectWebSocket(server);
};

main();
