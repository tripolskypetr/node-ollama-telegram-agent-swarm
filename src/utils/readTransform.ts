import { FlattenMaps } from "mongoose";

export interface IIncomingRowData {
    _id: FlattenMaps<unknown>;
}

export interface IOutgoingRowData {
    id: string;
}

export const readTransform = <T extends IIncomingRowData>(data: T): T & IOutgoingRowData => ({
    ...data,
    id: String(data._id),
});
