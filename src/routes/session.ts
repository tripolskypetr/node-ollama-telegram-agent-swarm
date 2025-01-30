import { disposeConnection, makeConnection } from "agent-swarm-kit";
import { Subject } from "functools-kit";
import { app, upgradeWebSocket } from "src/config/app";
import { ROOT_SWARM } from "src/logic";

app.get(
  "/api/v1/session/:clientId",
  upgradeWebSocket((ctx) => {
    const clientId = ctx.req.param("clientId");

    const incomingSubject = new Subject<string>();

    return {
      onOpen(_, ws) {
        const receive = makeConnection.scheduled(
          async (outgoing) => {
            ws.send(JSON.stringify(outgoing));
          },
          clientId,
          ROOT_SWARM
        );
        incomingSubject.subscribe(receive);
      },
      onMessage(event) {
        const data = JSON.parse(event.data.toString());
        incomingSubject.next(data);
      },
      onClose: () => {
        disposeConnection(clientId, ROOT_SWARM);
      },
    };
  })
);

export default app;
