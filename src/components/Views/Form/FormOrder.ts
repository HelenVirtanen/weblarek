import { TPayment, IFormActions, IOrderActions } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { Form } from "./Form";
import { IEvents } from "../../base/Events";

export interface IFormOrderActions extends IFormActions, IOrderActions {};
export interface IOrderData {
    payment: TPayment;
    address: string;
};

export class FormOrder extends Form {
    protected paymentCard: HTMLButtonElement;
    protected paymentCash: HTMLButtonElement;
    protected addressInput: HTMLInputElement;

    constructor(container: HTMLElement, actions?: IFormOrderActions, protected events?: IEvents) {
        super(container, actions);

        this.paymentCard = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this.paymentCash = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

        this.paymentCard.addEventListener('click', () => {
                this.selectPayment('card');
                if (actions?.onPaymentSelect) {
                    actions.onPaymentSelect?.('card');
                };
            });

        this.paymentCash.addEventListener('click', () => {
                this.selectPayment('cash');
                if (actions?.onPaymentSelect) {
                    actions.onPaymentSelect('cash');
                };
            });

        this.addressInput.addEventListener('input', () => {
            if (actions?.onAddressInput) {
                actions.onAddressInput(this.addressInput.value);
            };
            this.isAddressValid();
        });

        this.submitButton.addEventListener('click', () => {
            this.events?.emit('cart:contacts');
        });
    };

    selectPayment(payment: TPayment): void {
        this.paymentCard.classList.toggle('button_alt-active', payment === 'card');
        this.paymentCash.classList.toggle('button_alt-active', payment === 'cash');
    };

    set payment(value: TPayment) {
        this.selectPayment(value);
    };

    get payment(): TPayment {
        if (this.paymentCash.classList.contains('button_alt-active')) {
            return 'cash';
        } else {
            return 'card';
        }
    }

    set address(value: string) {
        this.addressInput.value = value;
    };


    get address(): string {
        return this.addressInput.value;
    };

    isAddressValid(): void {
        const error: {[key: string]: string} = {};
        if (!this.addressInput.value || this.addressInput.value.trim() === '') {
            error.address = 'Необходимо указать адрес';
        }
        
        this.checkErrors(error);
    }

    get orderData(): IOrderData {
        return {
            payment: this.payment,
            address: this.address,
        };
    };
};
