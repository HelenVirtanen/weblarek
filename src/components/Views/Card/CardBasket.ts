import { ensureElement } from "../../../utils/utils";
import { Card, ICard } from "./Card";
import { IEvents } from "../../base/Events";
import { IProduct } from "../../../types";


export class CardBasket extends Card<ICard> {
    protected cardItemIndex: HTMLElement;
    protected cardDeleteItem: HTMLButtonElement;

    constructor(container: HTMLElement, protected events?: IEvents) {
        super(container);

        this.cardItemIndex = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.cardDeleteItem = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        this.cardDeleteItem.addEventListener('click', () => {
            if (this.data) {
                this.events?.emit('card:remove-product', this.data);
                this.events?.emit('cart:open');
            }
        });
    };

    set index(value: number) {
        this.cardItemIndex.textContent = String(value);
    };

    render(data: IProduct) {
        this.data = data;
        return super.render(data);
    }
};
