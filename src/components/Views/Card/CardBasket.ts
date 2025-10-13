import { ensureElement } from "../../../utils/utils";
import { IBasketRemoveActions } from "../../../types";
import { Card, ICard } from "./Card";


export class CardBasket extends Card<ICard> {
    protected cardItemIndex: HTMLElement;
    protected cardDeleteItem: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: IBasketRemoveActions) {
        super(container);

        this.cardItemIndex = ensureElement<HTMLElement>(
            '.basket__item-index',
            this.container
        );
        this.cardDeleteItem = ensureElement<HTMLButtonElement>(
            '.basket__item-delete',
            this.container
        );

        if (actions?.onRemove) {
            this.cardDeleteItem.addEventListener('click', actions.onRemove);
        };
    };

    set index(value: number) {
        this.cardItemIndex.textContent = String(value);
    };
};
