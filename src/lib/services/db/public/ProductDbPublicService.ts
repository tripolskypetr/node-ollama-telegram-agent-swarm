import { inject } from "src/lib/core/di";
import ProductDbPrivateService from "../private/ProductDbPrivateService";
import TYPES from "src/lib/core/types";
import LoggerService from "../../base/LoggerService";
import ContextService, { TContextService } from "../../base/ContextService";
import { IProductDto, IProductFilterData } from "src/schema/Product.schema";

interface IProductDbPrivateService extends ProductDbPrivateService {}

type IgnoreKeys = keyof {
  loggerService: never;
  contextService: never;
  embeddingService: never;
  TargetModel: never;
};

type TProductDbPrivateService = {
  [key in Exclude<keyof IProductDbPrivateService, IgnoreKeys>]: unknown;
};

export class ProductDbPublicService implements TProductDbPrivateService {
  readonly loggerService = inject<LoggerService>(TYPES.loggerService);
  readonly contextService = inject<TContextService>(TYPES.contextService);
  readonly productDbPrivateService = inject<ProductDbPrivateService>(
    TYPES.productDbPrivateService
  );

  public remove = async (id: string, clientId: string) => {
    this.loggerService.log("productDbPublicService remove", { id, clientId });
    return await ContextService.runInContext(
      async () => {
        return await this.productDbPrivateService.remove(id);
      },
      {
        clientId,
      }
    );
  };

  public update = async (id: string, dto: IProductDto, clientId: string) => {
    this.loggerService.log("productDbPublicService update", {
      id,
      clientId,
      dto,
    });
    return await ContextService.runInContext(
      async () => {
        return await this.productDbPrivateService.update(id, dto);
      },
      {
        clientId,
      }
    );
  };

  public create = async (dto: IProductDto, clientId: string) => {
    this.loggerService.log("productDbPublicService create", { clientId, dto });
    return await ContextService.runInContext(
      async () => {
        return await this.productDbPrivateService.create(dto);
      },
      {
        clientId,
      }
    );
  };

  public findByFulltext = async (search: string, clientId: string) => {
    this.loggerService.log("productDbPublicService findByFulltext", {
      clientId,
      search,
    });
    return await ContextService.runInContext(
      async () => {
        return await this.productDbPrivateService.findByFulltext(search);
      },
      {
        clientId,
      }
    );
  };

  public findAll = async (
    filterData: Partial<IProductFilterData>,
    clientId: string
  ) => {
    this.loggerService.log("productDbPublicService findAll", {
      clientId,
      filterData,
    });
    return await ContextService.runInContext(
      async () => {
        return await this.productDbPrivateService.findAll(filterData);
      },
      {
        clientId,
      }
    );
  };

  public findByFilter = async (
    filterData: Partial<IProductFilterData>,
    clientId: string
  ) => {
    this.loggerService.log("productDbPublicService findByFilter", {
      clientId,
      filterData,
    });
    return await ContextService.runInContext(
      async () => {
        return await this.productDbPrivateService.findByFilter(filterData);
      },
      {
        clientId,
      }
    );
  };

  public findById = async (id: string, clientId: string) => {
    this.loggerService.log("productDbPublicService findById", { clientId, id });
    return await ContextService.runInContext(
      async () => {
        return await this.productDbPrivateService.findById(id);
      },
      {
        clientId,
      }
    );
  };

  public paginate = async (
    filterData: Partial<IProductFilterData>,
    pagination: {
      limit: number;
      offset: number;
    },
    clientId: string
  ) => {
    this.loggerService.log("productDbPublicService paginate", {
      clientId,
      filterData,
      pagination,
    });
    return await ContextService.runInContext(
      async () => {
        return await this.productDbPrivateService.paginate(
          filterData,
          pagination
        );
      },
      {
        clientId,
      }
    );
  };

  public iterate = async (
    filterData: Partial<IProductFilterData>,
    clientId: string
  ) => {
    this.loggerService.log("productDbPublicService iterate", {
      clientId,
      filterData,
    });
    return await ContextService.runInContext(
      async () => {
        return await ContextService.runAsyncIterator(
          this.productDbPrivateService.iterate(filterData),
          this.contextService.context,
        );
      },
      {
        clientId,
      }
    );
  };
}

export default ProductDbPublicService;
