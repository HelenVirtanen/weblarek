import { IProduct } from "../../types";

export class Cart {
    products: IProduct[] = [];

    getCartProducts(): IProduct[] {
        return this.products;
    }

    addProductToCart(product: IProduct): void {
        this.products.push(product);
    }

    removeProductFromCart(product: IProduct): void {
        this.products = this.products.filter(p => p.id !== product.id);
    }

    clearCart(): void {
        this.products = [];
    }
    
    getTotalCartPrice(): number {
        return this.products.reduce((sum, p) => sum + (p.price ?? 0), 0);
    }

    getTotalCartProducts(): number {
        return this.products.length;
    }

    isProductInCart(id: string): boolean {
        return this.products.some(p => p.id === id);
    }
}

