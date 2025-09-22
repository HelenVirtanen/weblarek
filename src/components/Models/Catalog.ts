import { IProduct } from "../../types";

export class Catalog {
  productsList: IProduct[] = [];
  selectedProduct: IProduct | null = null; 

  setProducts(products: IProduct[]): void {
    this.productsList = products;
  };

  getProducts(): IProduct[] {
    return this.productsList;
  };

  getProductById(id: string): IProduct | undefined {
    return this.productsList.filter(product => product.id === id)[0];
  }
  
  saveProductToShow(id: string): void {
    this.selectedProduct = this.productsList.filter(product => product.id === id)[0];
  }

  getProductToShow(): IProduct | null {
    return this.selectedProduct;
  }
}