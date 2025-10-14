import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IBasketOrderActions } from '../../types';

interface BasketData {
    products: HTMLElement[];
    total: number;
}

export class Basket extends Component<BasketData> {
    protected basketTitle: HTMLElement;
    protected basketList: HTMLElement;
    protected basketButton: HTMLButtonElement;
    protected basketPrice: HTMLElement;

    constructor(container: HTMLElement, actions?: IBasketOrderActions) {
        super(container);

        this.basketTitle = ensureElement<HTMLElement>('.modal__title', this.container);
        this.basketList = ensureElement<HTMLElement>('.basket__list', this.container);
        this.basketButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
        this.basketPrice = ensureElement<HTMLElement>('.basket__price', this.container);

        if (actions?.onBuy) {
            this.basketButton.addEventListener('click', actions.onBuy);
        };
    };

    set buttonText(value: string) {
        this.basketButton.textContent = String(value);
    };

    set buttonDisabled(value: boolean) {
        this.basketButton.disabled = value;
    };

    set basket(items: HTMLElement[]) {
        if (items.length > 0) {
            this.buttonDisabled = false;
            this.buttonText = 'Оформить';
            this.basketList.replaceChildren(...items);
        } else {
            const emptyCart = document.createElement('p');
            emptyCart.textContent = 'Корзина пуста';
            this.buttonDisabled = true;
            this.buttonText = 'Оформить';
            this.basketList.replaceChildren(emptyCart);
        }
        
    };

    set total(value: number) {
        this.basketPrice.textContent = `${value} синапсов`;
    };
};
