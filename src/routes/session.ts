import { disposeConnection, getAgentName, makeConnection } from "agent-swarm-kit";
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
        const receive = makeConnection(
          async (outgoing) => {
            ws.send(JSON.stringify(outgoing));
          },
          clientId,
          ROOT_SWARM
        );
        incomingSubject.subscribe(receive);
      },
      onMessage(event) {
        const incoming = JSON.parse(event.data.toString());
        incomingSubject.next(incoming.data);
      },
      onClose: () => {
        disposeConnection(clientId, ROOT_SWARM);
      },
    };
  })
);

export default app;
