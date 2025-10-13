import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';
import { IEvents } from '../../base/Events';

interface CartCount {
    count: number;
};

export class Header extends Component<CartCount> {
    cartCounter: HTMLElement;
    cartButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.cartCounter = ensureElement<HTMLElement>('.header__basket-counter', this.container);
        this.cartButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);

        this.cartButton.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    };

    set counter(value: number) {
        this.cartCounter.textContent = String(value);
    };
};