const apiServices = {
    completionService: Symbol('completionService'),
    embeddingService: Symbol('embeddingService'),
};

const baseServices = {
    loggerService: Symbol('loggerService'),
    errorService: Symbol('errorService'),
    contextService: Symbol('contextService'),
    mongooseService: Symbol('mongooseService'),
    redisService: Symbol('redisService'),
};

const publicDbServices = {
    productDbPublicService: Symbol('productDbPublicService'),
};

const privateDbServices = {
    productDbPrivateService: Symbol('productDbPrivateService'),
};

export const TYPES = {
    ...apiServices,
    ...baseServices,
    ...publicDbServices,
    ...privateDbServices,
};

export default TYPES;
