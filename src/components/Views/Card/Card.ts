import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";

export interface ICard extends Partial<IProduct> {
    index?: number;
};

export abstract class Card<T extends ICard> extends Component <T> {
    protected cardTitle: HTMLElement;
    protected cardPrice: HTMLElement;
    protected data?: T; 

    constructor(container: HTMLElement) {
        super(container);

        this.cardTitle = ensureElement<HTMLElement>('.card__title', this.container);
        this.cardPrice = ensureElement<HTMLElement>('.card__price', this.container);
    };

    set title(value: string) {
        this.cardTitle.textContent = String(value);
    };

    set price(value: number | null) {
        if (value === null) {
            this.cardPrice.textContent = 'Бесценно';
        } else {
            this.cardPrice.textContent = `${value} синапсов`;
        };
    };
};
