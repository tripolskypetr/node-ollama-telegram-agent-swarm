import "src/lib/core/provide";
import { init, inject } from "./core/di";
import TYPES from "./core/types";
import CompletionService from "./services/api/CompletionService";
import EmbeddingService from "./services/api/EmbeddingService";
import { TContextService } from "./services/base/ContextService";
import ErrorService from "./services/base/ErrorService";
import LoggerService from "./services/base/LoggerService";
import MongooseService from "./services/base/MongooseService";
import RedisService from "./services/base/RedisService";
import ProductDbPrivateService from "./services/db/private/ProductDbPrivateService";
import ProductDbPublicService from "./services/db/public/ProductDbPublicService";

const apiServices = {
    embeddingService: inject<EmbeddingService>(TYPES.embeddingService),
    completionService: inject<CompletionService>(TYPES.completionService),
};

const baseServices = {
    loggerService: inject<LoggerService>(TYPES.loggerService),
    errorService: inject<ErrorService>(TYPES.errorService),
    contextService: inject<TContextService>(TYPES.contextService),
    mongooseService: inject<MongooseService>(TYPES.mongooseService),
    redisService: inject<RedisService>(TYPES.redisService),
};

const publicDbServices = {
    productDbPublicService: inject<ProductDbPublicService>(TYPES.productDbPublicService),
};

const privateDbServices = {
    productDbPrivateService: inject<ProductDbPrivateService>(TYPES.productDbPrivateService),
};

init();

export const ioc = {
    ...apiServices,
    ...baseServices,
    ...publicDbServices,
    ...privateDbServices,
};

Object.assign(globalThis, { ioc });
