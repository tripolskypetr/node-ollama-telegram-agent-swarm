import { provide } from '../core/di';
import CompletionService from '../services/api/CompletionService';
import EmbeddingService from '../services/api/EmbeddingService';
import ContextService from '../services/base/ContextService';
import ErrorService from '../services/base/ErrorService';
import LoggerService from '../services/base/LoggerService';
import MongooseService from '../services/base/MongooseService';
import RedisService from '../services/base/RedisService';
import ProductDbPrivateService from '../services/db/private/ProductDbPrivateService';
import ProductDbPublicService from '../services/db/public/ProductDbPublicService';

import TYPES from './types';

{
    provide(TYPES.completionService, () => new CompletionService());
    provide(TYPES.embeddingService, () => new EmbeddingService());
}

{
    provide(TYPES.loggerService, () => new LoggerService());
    provide(TYPES.errorService, () => new ErrorService());
    provide(TYPES.contextService, () => new ContextService());
    provide(TYPES.mongooseService, () => new MongooseService());
    provide(TYPES.redisService, () => new RedisService());
}

{
    provide(TYPES.productDbPrivateService, () => new ProductDbPrivateService());
}

{
    provide(TYPES.productDbPublicService, () => new ProductDbPublicService());
}
