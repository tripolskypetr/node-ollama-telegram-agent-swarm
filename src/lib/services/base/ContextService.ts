import { scoped } from "di-scoped";

export interface IContext {
  clientId: string;
}

export const ContextService = scoped(
  class {
    constructor(readonly context: IContext) {}
  }
);

export type TContextService = InstanceType<typeof ContextService>;

export default ContextService;
