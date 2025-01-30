import { getAgentName, session } from "agent-swarm-kit";
import { randomString } from "functools-kit";
import { ROOT_SWARM } from "src/logic";
import { SALES_AGENT } from "src/logic/agent/sales.agent";
import { test } from "worker-testbed";

const ALLOWED_PRODUCTS = ["aspirin", "paracetamol"];

test("Will list products on request", async (t) => {
  const CLIENT_ID = randomString();
  const { complete } = session(CLIENT_ID, ROOT_SWARM);
  let output = "";
  {
    output = await complete("Take me to the sales agent");
    if ((await getAgentName(CLIENT_ID)) !== SALES_AGENT) {
      t.fail(
        `Navigation failed, agent=${await getAgentName(
          CLIENT_ID
        )} output=${output}`
      );
      return;
    }
  }
  {
    output = await complete(
      "I want to buy the pharma product which cures flu. like paracetamol"
    );
    if (
      !ALLOWED_PRODUCTS.some((p) =>
        output.toLowerCase().includes(p.toLowerCase())
      )
    ) {
      t.fail(
        `Output compare failed, agent=${await getAgentName(
          CLIENT_ID
        )} output=${output}`
      );
    }
  }

  t.pass(
    `Successfully called list product tools in agent agentName=${await getAgentName(
      CLIENT_ID
    )} output=${output}`
  );
});
