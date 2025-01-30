import { ICompletionArgs, IModelMessage } from 'agent-swarm-kit';
import * as functools_kit from 'functools-kit';
import { TSubject } from 'functools-kit';
import Redis from 'ioredis';
import * as src_lib_services_base_ContextService from 'src/lib/services/base/ContextService';
import * as mongoose from 'mongoose';
import * as src_schema_Product_schema from 'src/schema/Product.schema';
import { IProductDto, IProductRow, IProductFilterData } from 'src/schema/Product.schema';
import LoggerService$1 from 'src/lib/services/base/LoggerService';
import EmbeddingService$1 from 'src/lib/services/api/EmbeddingService';

interface IContext {
    clientId: string;
}

declare class LoggerService {
    protected readonly contextService: {
        readonly context: IContext;
    };
    private _logger;
    private _debug;
    log: (...args: any[]) => void;
    debug: (...args: any[]) => void;
    debugCtx: (...args: any[]) => void;
    setPrefix: (prefix: string) => void;
    setDebug: (debug: boolean) => void;
    logCtx: (...args: any[]) => void;
}

declare class CompletionService {
    readonly loggerService: LoggerService;
    getCompletion: ({ agentName, messages, mode, tools, }: ICompletionArgs) => Promise<IModelMessage>;
}

type Embeddings = number[];
declare class EmbeddingService {
    readonly loggerService: LoggerService;
    createEmbedding: (text: string) => Promise<Embeddings>;
    calculateEmbeddings: (a: Embeddings, b: Embeddings) => Promise<number>;
    compareStrings: (t1: string, t2: string) => Promise<number>;
}

declare class ErrorService {
    get beforeExitSubject(): TSubject<void>;
    handleGlobalError: (error: Error) => Promise<void>;
    private _listenForError;
    protected init: () => void;
}

declare class MongooseService {
    readonly loggerService: LoggerService;
    init: () => Promise<void>;
}

declare class RedisService {
    private readonly loggerService;
    getRedis: (() => Promise<Redis>) & functools_kit.ISingleshotClearable;
    private makePingInterval;
    protected init: (() => Promise<void>) & functools_kit.ISingleshotClearable;
}

declare const ProductDbPrivateService_base: (new () => {
    readonly loggerService: LoggerService$1;
    readonly TargetModel: mongoose.Model<any>;
    create(dto: object): Promise<any>;
    update(id: string, dto: object): Promise<any>;
    remove(id: string): Promise<any>;
    findAll(filterData?: object, sort?: object): Promise<any[]>;
    findById(id: string): Promise<any>;
    findByFilter(filterData: object, sort?: object): Promise<any>;
    iterate(filterData?: object, sort?: object): AsyncGenerator<any, void, unknown>;
    paginate(filterData: object, pagination: {
        limit: number;
        offset: number;
    }, sort?: object): Promise<{
        rows: any[];
        total: number;
    }>;
}) & Omit<{
    new (TargetModel: mongoose.Model<any>): {
        readonly loggerService: LoggerService$1;
        readonly TargetModel: mongoose.Model<any>;
        create(dto: object): Promise<any>;
        update(id: string, dto: object): Promise<any>;
        remove(id: string): Promise<any>;
        findAll(filterData?: object, sort?: object): Promise<any[]>;
        findById(id: string): Promise<any>;
        findByFilter(filterData: object, sort?: object): Promise<any>;
        iterate(filterData?: object, sort?: object): AsyncGenerator<any, void, unknown>;
        paginate(filterData: object, pagination: {
            limit: number;
            offset: number;
        }, sort?: object): Promise<{
            rows: any[];
            total: number;
        }>;
    };
}, "prototype">;
declare class ProductDbPrivateService extends ProductDbPrivateService_base {
    readonly loggerService: LoggerService$1;
    readonly contextService: {
        readonly context: src_lib_services_base_ContextService.IContext;
    };
    readonly embeddingService: EmbeddingService$1;
    private getEmbedding;
    create: (dto: IProductDto) => Promise<IProductRow>;
    update: (id: string, dto: IProductDto) => Promise<any>;
    remove: (id: string) => Promise<IProductRow>;
    findByFulltext: (search: string) => Promise<IProductRow[]>;
    findAll: (filterData?: Partial<IProductFilterData>) => Promise<IProductRow[]>;
    findByFilter: (filterData: Partial<IProductFilterData>) => Promise<IProductRow | null>;
    findById: (id: string) => Promise<IProductRow>;
    iterate: (filterData?: Partial<IProductFilterData>) => AsyncGenerator<IProductRow, void, unknown>;
    paginate: (filterData: Partial<IProductFilterData>, pagination: {
        limit: number;
        offset: number;
    }) => Promise<{
        rows: any[];
        total: number;
    }>;
}

interface IProductDbPrivateService extends ProductDbPrivateService {
}
type IgnoreKeys = keyof {
    loggerService: never;
    contextService: never;
    embeddingService: never;
    TargetModel: never;
};
type TProductDbPrivateService = {
    [key in Exclude<keyof IProductDbPrivateService, IgnoreKeys>]: unknown;
};
declare class ProductDbPublicService implements TProductDbPrivateService {
    readonly loggerService: LoggerService;
    readonly contextService: {
        readonly context: IContext;
    };
    readonly productDbPrivateService: ProductDbPrivateService;
    remove: (id: string, clientId: string) => Promise<src_schema_Product_schema.IProductRow>;
    update: (id: string, dto: IProductDto, clientId: string) => Promise<any>;
    create: (dto: IProductDto, clientId: string) => Promise<src_schema_Product_schema.IProductRow>;
    findByFulltext: (search: string, clientId: string) => Promise<src_schema_Product_schema.IProductRow[]>;
    findAll: (filterData: Partial<IProductFilterData>, clientId: string) => Promise<src_schema_Product_schema.IProductRow[]>;
    findByFilter: (filterData: Partial<IProductFilterData>, clientId: string) => Promise<src_schema_Product_schema.IProductRow>;
    findById: (id: string, clientId: string) => Promise<src_schema_Product_schema.IProductRow>;
    paginate: (filterData: Partial<IProductFilterData>, pagination: {
        limit: number;
        offset: number;
    }, clientId: string) => Promise<{
        rows: any[];
        total: number;
    }>;
    iterate: (filterData: Partial<IProductFilterData>, clientId: string) => Promise<AsyncGenerator<src_schema_Product_schema.IProductRow, void, unknown>>;
}

declare const ioc: {
    productDbPrivateService: ProductDbPrivateService;
    productDbPublicService: ProductDbPublicService;
    loggerService: LoggerService;
    errorService: ErrorService;
    contextService: {
        readonly context: IContext;
    };
    mongooseService: MongooseService;
    redisService: RedisService;
    embeddingService: EmbeddingService;
    completionService: CompletionService;
};

export { ioc };
