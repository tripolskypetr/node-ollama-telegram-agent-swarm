import repl from "repl";

import "../build/index.mjs";

import { randomString, Subject } from 'functools-kit';

const clientId = randomString();

const outgoingSubject = new Subject();

const receive = ioc.connectionPublicService.connect(clientId, async (outgoing) => {
    outgoingSubject.next(outgoing);
});

async function run(uInput, context, filename, callback) {
    console.time('Timing');
    receive({
        clientId,
        data: [uInput],
    });
    const { agentName, data } = await outgoingSubject.toPromise();
    console.timeEnd('Timing');
    callback(null, `[${agentName}]: ${data}`);
}
  
ioc.loggerService.setDebug(false);

setTimeout(() => {
    console.clear();
    repl.start({ prompt: "node-ollama-agent-swarm => ", eval: run });
}, 1_000);
