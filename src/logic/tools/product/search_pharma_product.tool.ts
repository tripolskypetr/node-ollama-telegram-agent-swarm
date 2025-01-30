import {
  addTool,
  commitToolOutput,
  execute,
  getLastUserMessage,
} from "agent-swarm-kit";
import { str } from "functools-kit";
import { ioc } from "src/lib";
import serializeProduct from "src/utils/serializeProduct";
import { z } from "zod";

const PARAMETER_SCHEMA = z.object({}).strict();

export const SEARCH_PHARMA_PRODUCT = addTool({
  toolName: "search_pharma_product",
  validate: async (clientId, agentName, params) => {
    const { success } = await PARAMETER_SCHEMA.spa(params);
    return success;
  },
  call: async (clientId, agentName, params) => {
    const lastMessage = await getLastUserMessage(clientId);
    const products = await ioc.productDbPublicService.findByFulltext(
      lastMessage,
      clientId
    );
    if (products.length) {
      await commitToolOutput(
        str.newline(
          `The next pharma product found in database: ${products.map(
            serializeProduct
          )}`
        ),
        clientId,
        agentName
      );
      await execute(
        "Tell user the products found in the database",
        clientId,
        agentName
      );
      return;
    }
    await commitToolOutput(
      `The products does not found in the database`,
      clientId,
      agentName
    );
    await execute(
      "Tell user to specify search criteria for the pharma product",
      clientId,
      agentName
    );
  },
  type: "function",
  function: {
    name: "search_pharma_product",
    description:
      "Retrieve several pharma products from the database based on description",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
});
