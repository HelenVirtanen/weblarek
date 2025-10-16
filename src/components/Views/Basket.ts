import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

interface BasketData {
    products: HTMLElement[];
    total: number;
}

export class Basket extends Component<BasketData> {
    protected basketTitle: HTMLElement;
    protected basketList: HTMLElement;
    protected basketButton: HTMLButtonElement;
    protected basketPrice: HTMLElement;

    constructor(container: HTMLElement, protected events?: IEvents) {
        super(container);

        this.basketTitle = ensureElement<HTMLElement>('.modal__title', this.container);
        this.basketList = ensureElement<HTMLElement>('.basket__list', this.container);
        this.basketButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
        this.basketPrice = ensureElement<HTMLElement>('.basket__price', this.container);

        this.basketButton.addEventListener('click', () => {
            this.events?.emit('cart:order');
        });
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
