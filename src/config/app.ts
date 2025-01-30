import { Hono } from "hono"
import { createNodeWebSocket } from '@hono/node-ws'

export const app = new Hono();

export const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app })
