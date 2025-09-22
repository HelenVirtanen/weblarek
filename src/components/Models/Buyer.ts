import { IBuyer } from "../../types";

export class Buyer {
    buyerData: IBuyer | null = null;

    setBuyerData(detail: Partial<IBuyer>): void {
    if (!this.buyerData) {
        this.buyerData = {
            payment: 'card',
            email: '',
            phone: '',
            address: ''
        };
    }
    Object.assign(this.buyerData, detail);
}

    getBuyerData(): IBuyer | null {
        return this.buyerData;
    }

    clearBuyerData(): void {
        this.buyerData = null;
    }

    isBuyerDataValid(): boolean {
        return this.buyerData !== null 
            && Object.values(this.buyerData).every(value => value !== null && value !== '');
    }
}