import { complete } from "agent-swarm-kit";
import { errorData, getErrorMessage } from "functools-kit";
import { app } from "src/config/app";
import { ioc } from "src/lib";
import { ROOT_SWARM } from "src/logic";
import CompleteRequest from "src/model/CompleteRequest.model";

app.post("/api/v1/complete", async (ctx) => {
  const request = await ctx.req.json<CompleteRequest>();
  console.time(`${ctx.req.url} ${request.requestId}`);
  ioc.loggerService.log(ctx.req.url, { request });
  try {
    const result = await complete(request.message, request.clientId, ROOT_SWARM);
    ioc.loggerService.log(`${ctx.req.url} ok`, { request, result });
    return ctx.json(result, 200);
  } catch (error) {
    ioc.loggerService.log(`${ctx.req.url} error`, {
      request,
      error: errorData(error),
    });
    return ctx.json(
      {
        status: "error",
        error: getErrorMessage(error),
        clientId: request.clientId,
        requestId: request.requestId,
        serviceName: request.serviceName,
      },
      500
    );
  } finally {
    console.timeEnd(`${ctx.req.url} ${request.requestId}`);
  }
});
