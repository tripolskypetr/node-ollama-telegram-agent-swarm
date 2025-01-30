import BaseCRUD from "src/lib/common/BaseCRUD";
import {
  IProductDocument,
  IProductDto,
  IProductFilterData,
  IProductRow,
  ProductModel,
} from "src/schema/Product.schema";
import { memoize, SortedArray } from "functools-kit";
import LoggerService from "src/lib/services/base/LoggerService";
import { inject } from "src/lib/core/di";
import TYPES from "src/lib/core/types";
import ContextService, { TContextService } from "src/lib/services/base/ContextService";
import EmbeddingService from "src/lib/services/api/EmbeddingService";
import { CC_VECTOR_SEARCH_LIMIT, CC_VECTOR_SEARCH_SIMILARITY } from "src/config/params";

export class ProductDbPrivateService extends BaseCRUD(ProductModel) {
  readonly loggerService = inject<LoggerService>(TYPES.loggerService);
  readonly contextService = inject<TContextService>(TYPES.contextService);
  readonly embeddingService = inject<EmbeddingService>(TYPES.embeddingService);

  private getEmbedding = memoize(([{ id }]) => id, async (row: IProductRow) => {
    const descriptionEmbeddings = await this.embeddingService.createEmbedding(
      row.description,
    );
    const keywordsEmbeddings = await this.embeddingService.createEmbedding(
      row.keywords.join(" "),
    );
    const titleEmbeddings = await this.embeddingService.createEmbedding(
      row.title,
    );
    return {
      descriptionEmbeddings,
      keywordsEmbeddings,
      titleEmbeddings,
    };
  });

  public create = async (dto: IProductDto): Promise<IProductRow> => {
    this.loggerService.logCtx(`productDbPrivateService create`, { dto });
    const payload: Partial<IProductDocument> = { ...dto };
    payload.createdAt = new Date();
    payload.updatedAt = new Date();
    return await super.create(payload);
  };

  public update = async (id: string, dto: IProductDto): Promise<any> => {
    this.loggerService.logCtx(`productDbPrivateService update`, { dto });
    const payload: Partial<IProductDocument> = { ...dto };
    payload.updatedAt = new Date();
    return await super.update(id, payload);
  };

  public remove = async (id: string): Promise<IProductRow> => {
    this.loggerService.logCtx(`productDbPrivateService remove`, { id });
    return await super.remove(id);
  };

  public findByFulltext = async (search: string): Promise<IProductRow[]> => {
    this.loggerService.logCtx(`productDbPrivateService findByFulltext`, { search });
    const embeddings = await this.embeddingService.createEmbedding(search);
    const items = new SortedArray();
    for await (const row of this.iterate()) {
      const {
        titleEmbeddings,
        descriptionEmbeddings,
        keywordsEmbeddings,
      } = await this.getEmbedding(row);
      const rowScores = await Promise.all([
        this.embeddingService.calculateEmbeddings(
          titleEmbeddings,
          embeddings
        ),
        this.embeddingService.calculateEmbeddings(
          descriptionEmbeddings,
          embeddings
        ),
        this.embeddingService.calculateEmbeddings(
          keywordsEmbeddings,
          embeddings
        ),
      ]);
      const score = Math.max(...rowScores);
      if (score > CC_VECTOR_SEARCH_SIMILARITY) {
        items.push(row, score);
      }
    }
    return items.take(CC_VECTOR_SEARCH_LIMIT, CC_VECTOR_SEARCH_SIMILARITY);
  };

  public findAll = async (
    filterData: Partial<IProductFilterData> = {}
  ): Promise<IProductRow[]> => {
    this.loggerService.logCtx(`productDbPrivateService findAll`, { filterData });
    return await super.findAll(filterData, {
      updatedAt: -1,
    });
  };

  public findByFilter = async (
    filterData: Partial<IProductFilterData>
  ): Promise<IProductRow | null> => {
    this.loggerService.logCtx(`productDbPrivateService findByFilter`, { filterData });
    return await super.findByFilter(filterData, {
      updatedAt: -1,
    });
  };

  public findById = async (id: string): Promise<IProductRow> => {
    this.loggerService.logCtx(`productDbPrivateService findById`, { id });
    return await super.findById(id);
  };

  public iterate = (
    filterData: Partial<IProductFilterData> = {}
  ): AsyncGenerator<IProductRow, void, unknown> => {
    this.loggerService.logCtx(`productDbPrivateService iterate`, { filterData });
    return ContextService.runAsyncIterator(
      super.iterate(filterData, {
        updatedAt: -1,
      }),
      this.contextService.context
    );
  };

  public paginate = async (
    filterData: Partial<IProductFilterData>,
    pagination: { limit: number; offset: number }
  ): Promise<{ rows: any[]; total: number }> => {
    this.loggerService.logCtx(`productDbPrivateService paginate`, {
      filterData,
      pagination,
    });
    const query: Record<string, unknown> = {};
    if (filterData?.title) {
      query["title"] = filterData.title;
    }
    if (filterData?.description) {
      query["description"] = filterData.description;
    }
    return await super.paginate(query, pagination);
  };
}

export default ProductDbPrivateService;
