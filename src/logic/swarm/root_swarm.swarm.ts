import { addSwarm } from "agent-swarm-kit";
import { TRIAGE_AGENT } from "../agent/triage.agent";
import { SALES_AGENT } from "../agent/sales.agent";
import { REFUND_AGENT } from "../agent/refund.agent";

export const ROOT_SWARM = addSwarm({
    swarmName: 'root_swarm',
    agentList: [
        TRIAGE_AGENT,
        SALES_AGENT,
        REFUND_AGENT,
    ],
    defaultAgent: TRIAGE_AGENT,
});
