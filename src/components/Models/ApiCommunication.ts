import { ICatalogResult, IOrderRequest, IOrderResult } from "../../types";
import { Api } from "../base/Api";

export class ApiCommunication extends Api{
    constructor(baseUrl: string, options: RequestInit = {}) {
        super(baseUrl, options);
    }

    getCatalog(): Promise<ICatalogResult> {
        return this.get('/product/');
    }

    createOrder(order: IOrderRequest): Promise<IOrderResult>{
        return this.post('/order/', order).then((data => data as IOrderResult));
    }
}