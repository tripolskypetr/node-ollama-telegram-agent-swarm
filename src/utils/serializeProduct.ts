import { IProductRow } from "src/schema/Product.schema";

export const serializeProduct = (product: IProductRow) => {
    return `title=${product.title} description=${product.description},`;
}

export default serializeProduct;
