import { factory } from "di-factory";
import { Model } from "mongoose";
import TYPES from "src/lib/core/types";
import { inject } from "src/lib/core/di";
import LoggerService from "src/lib/services/base/LoggerService";
import { readTransform } from "src/utils/readTransform";

export const BaseCRUD = factory(
  class {

    readonly loggerService = inject<LoggerService>(TYPES.loggerService);

    constructor(public readonly TargetModel: Model<any>) {}

    public async create(dto: object) {
      this.loggerService.debug(`BaseCRUD create TargetModel=${this.TargetModel.modelName}`, { dto });
      const entity = await this.TargetModel.create(dto);
      return readTransform(entity.toJSON());
    }

    public async update(id: string, dto: object) {
      this.loggerService.debug(`BaseCRUD update TargetModel=${this.TargetModel.modelName}`, { dto });
      const updatedDocument = await this.TargetModel.findByIdAndUpdate(id, dto, {
        new: true,
        runValidators: true,
      });
      if (!updatedDocument) {
        throw new Error(`${this.TargetModel.modelName} not found`);
      }
      return readTransform(updatedDocument.toJSON());
    }

    public async remove(id: string) {
      this.loggerService.debug(`BaseCRUD remove TargetModel=${this.TargetModel.modelName}`, { id });
      const deletedDocument = await this.TargetModel.findByIdAndDelete(id);
      if (!deletedDocument) {
        throw new Error(`${this.TargetModel.modelName} not found`);
      }
      return readTransform(deletedDocument.toJSON());
    }

    public async findAll(filterData: object = {}, sort?: object) {
      this.loggerService.debug(`BaseCRUD findAll TargetModel=${this.TargetModel.modelName}`, { filterData, sort });
      const entities = await this.TargetModel.find(filterData, null, { sort });
      return entities.map((entity) => readTransform(entity.toJSON()));
    }

    public async findById(id: string) {
      this.loggerService.debug(`BaseCRUD findById TargetModel=${this.TargetModel.modelName}`, { id });
      const entity = await this.TargetModel.findById(id);
      if (!entity) {
        throw new Error(`${this.TargetModel.modelName} not found`);
      }
      return readTransform(entity.toJSON());
    }

    public async findByFilter(filterData: object, sort?: object) {
      this.loggerService.debug(`BaseCRUD findByFilter TargetModel=${this.TargetModel.modelName}`, { filterData, sort });
      const entity = await this.TargetModel.findOne(filterData, null, {
        sort
      });
      if (entity) {
        return readTransform(entity.toJSON());
      }
      return null;
    }

    public async *iterate(filterData: object = {}, sort?: object) {
      this.loggerService.debug(`BaseCRUD iterate TargetModel=${this.TargetModel.modelName}`, { filterData, sort });
      for await (const document of this.TargetModel.find(filterData, null, {
        sort,
      })) {
        yield readTransform(document.toJSON());
      }
    }

    public async paginate(
      filterData: object,
      pagination: {
        limit: number;
        offset: number;
      },
      sort?: object
    ) {
      this.loggerService.debug(`BaseCRUD paginate TargetModel=${this.TargetModel.modelName}`, { filterData, pagination, sort });
      const entities = await this.TargetModel.find(filterData, null, {
        sort,
      })
        .skip(pagination.offset)
        .limit(pagination.limit);
      const items = entities.map((item) => item.toJSON());
      const total = await this.TargetModel.countDocuments(filterData);
      return {
        rows: items.map(readTransform),
        total: total,
      };
    }
  }
);

export default BaseCRUD;
