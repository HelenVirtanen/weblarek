import { IBuyer } from "../../types";

export class Customer {
    customerData: IBuyer | null = null;

    setCustomerData(detail: Partial<IBuyer>): void {
    if (!this.customerData) {
        this.customerData = {
            payment: 'card',
            email: '',
            phone: '',
            address: ''
        };
    }
    Object.assign(this.customerData, detail);
}

    getCustomerData(): IBuyer | null {
        return this.customerData;
    }

    clearCustomerData(): void {
        this.customerData = null;
    }

    isCustomerDataValid(): boolean {
        return this.customerData !== null 
            && Object.values(this.customerData).every(value => value !== null && value !== '');
    }
}