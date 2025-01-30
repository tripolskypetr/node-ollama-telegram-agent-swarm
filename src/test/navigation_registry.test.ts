import { getAgentName, session } from "agent-swarm-kit";
import { randomString } from "functools-kit";
import { ROOT_SWARM } from "src/logic";
import { REFUND_AGENT } from "src/logic/agent/refund.agent";
import { SALES_AGENT } from "src/logic/agent/sales.agent";
import { TRIAGE_AGENT } from "src/logic/agent/triage.agent";
import { test } from "worker-testbed";

test("Will pass ask_for_agent bug", async (t) => {
    const CLIENT_ID = randomString();
    const { complete } = session(CLIENT_ID, ROOT_SWARM);
    const output = await complete("Ask for agent function");
    if (await getAgentName(CLIENT_ID) === TRIAGE_AGENT) {
        t.pass(`Successfully skipped the navigation output=${output}`);
        return;
    }
    t.fail(`Navigation mistake, agent=${await getAgentName(CLIENT_ID)} output=${output}`);
});

test("Will navigate to sales agent when user ask the product list", async (t) => {
    const CLIENT_ID = randomString();
    const { complete } = session(CLIENT_ID, ROOT_SWARM);
    await complete("Take me to the sales agent");
    const output = await complete("Give me the product list which you sale");
    if (await getAgentName(CLIENT_ID) === SALES_AGENT) {
        t.pass(`Successfully navigated to sales agent output=${output}`);
        return;
    }
    t.fail(`Navigation failed, agent=${await getAgentName(CLIENT_ID)} output=${output}`);
});

test("Will navigate to refund agent when user ask to withdraw bank deposit", async (t) => {
    const CLIENT_ID = randomString();
    const { complete } = session(CLIENT_ID, ROOT_SWARM);
    const output = await complete("i got a problem with my previous order. i need to withdraw bank deposit");
    if (await getAgentName(CLIENT_ID) === REFUND_AGENT) {
        t.pass(`Successfully navigated to refunds agent output=${output}`);
        return;
    }
    t.fail(`Navigation failed, agent=${await getAgentName(CLIENT_ID)} output=${output}`);
});
