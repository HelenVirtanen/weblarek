import { IProduct } from "../../types";
import { IEvents } from "../base/Events";
export class Catalog {
  productsList: IProduct[] = [];
  selectedProduct: IProduct | null = null;
  
  constructor(protected events: IEvents) {}

  setProducts(products: IProduct[]): void {
    this.productsList = products;
    this.events.emit('catalog:changed');
  };

  getProducts(): IProduct[] {
    return this.productsList;
  };

  getProductById(id: string): IProduct | undefined {
    return this.productsList.find(product => product.id === id);
  }
  
  setSelectedProduct(id: string): void {
    this.selectedProduct = this.productsList.filter(product => product.id === id)[0];
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}