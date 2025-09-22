import { IApi, IProduct, IOrder, ICatalog } from "../../types";

export class ApiCommunication {
    protected api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    async getCatalog(): Promise<IProduct[]> {
        const response = await this.api.get<ICatalog>('/product/');
        return response.items;
    }

    async postOrder(order: IOrder): Promise<IOrder>{
        return this.api.post<IOrder>('/order/', order, 'POST');
    }
}