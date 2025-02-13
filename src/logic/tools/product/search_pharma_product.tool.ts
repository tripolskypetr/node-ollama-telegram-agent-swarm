import {
  addTool,
  commitSystemMessage,
  commitToolOutput,
  execute,
  getLastUserMessage,
} from "agent-swarm-kit";
import { str } from "functools-kit";
import { ioc } from "src/lib";
import serializeProduct from "src/utils/serializeProduct";
import { z } from "zod";

const PARAMETER_SCHEMA = z
  .object({
    description: z
      .string()
      .min(1, "Fulltext is required")
  })
  .strict();


export const SEARCH_PHARMA_PRODUCT = addTool({
  toolName: "search_pharma_product",
  validate: async (clientId, agentName, params) => {
    const { success } = await PARAMETER_SCHEMA.spa(params);
    return success;
  },
  call: async (toolId, clientId, agentName, params) => {
    let search = "";
    if (params.description) {
      search = String(params.description);
    } else {
      search = await getLastUserMessage(clientId);
    }
    if (!search) {
      await commitToolOutput(
        toolId,
        str.newline(`The products does not found in the database`),
        clientId,
        agentName
      );
      await execute(
        "Tell user to specify search criteria for the pharma product",
        clientId,
        agentName
      );
      return;
    }
    const products = await ioc.productDbPublicService.findByFulltext(
      search,
      clientId
    );
    if (products.length) {
      await commitToolOutput(
        toolId,
        str.newline(
          `The next pharma product found in database: ${products.map(
            serializeProduct
          )}`
        ),
        clientId,
        agentName
      );
      await commitSystemMessage(
        "Do not call the search_pharma_product next time!",
        clientId,
        agentName
      );
      await execute(
        "Tell user the products found in the database.",
        clientId,
        agentName
      );
      return;
    }
    await commitToolOutput(
      toolId,
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
      properties: {
        description: {
          type: "string",
          description:
            "REQUIRED! Minimum one word. The product description. Must include several sentences with description and keywords to find a product",
        },
      },
      required: ["description"],
    },
  },
});
