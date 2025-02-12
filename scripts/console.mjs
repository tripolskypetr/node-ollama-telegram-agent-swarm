import repl from "repl";

import "../build/index.mjs";

import { randomString, Subject } from "functools-kit";

import { makeConnection } from "agent-swarm-kit";

const clientId = randomString();

const outgoingSubject = new Subject();

const receive = makeConnection(
  async (outgoing) => {
    outgoingSubject.next(outgoing);
  },
  clientId,
  "root_swarm"
);

async function run(uInput, context, filename, callback) {
  console.time("Timing");
  receive(uInput);
  const { agentName, data } = await outgoingSubject.toPromise();
  console.timeEnd("Timing");
  callback(null, `[${agentName}]: ${data}`);
}

ioc.loggerService.setDebug(false);

setTimeout(() => {
  console.clear();
  repl.start({ prompt: "node-ollama-agent-swarm => ", eval: run });
}, 1_000);
