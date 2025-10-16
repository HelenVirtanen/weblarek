import { ensureElement } from "../../../utils/utils";
import { IProduct } from "../../../types";
import { Card, ICard } from "./Card";
import { categoryMap } from "../../../utils/constants";
import { IEvents } from "../../base/Events";

type CategoryKey = keyof typeof categoryMap;
export class CardPreview extends Card<ICard> {
    protected cardImage: HTMLImageElement;
    protected cardCategory: HTMLElement;
    protected cardText: HTMLElement;
    protected cardButton: HTMLButtonElement;
    protected inCart: boolean = false;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.cardCategory = ensureElement<HTMLElement>('.card__category', this.container);
        this.cardText = ensureElement<HTMLElement>('.card__text', this.container);
        this.cardButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

        this.cardButton.addEventListener('click', () => {
            if (!this.data) return;

            this.inCart = !this.inCart;
            this.cardButton.textContent = this.inCart ? 'Удалить из корзины' : 'Купить';
            
            const eventInCart = this.inCart ? 'card:add-product' : 'card:remove-product';
            this.events.emit(eventInCart, this.data);
        });
    }

    render(data: IProduct, inCart = false): HTMLElement {
        this.data = data;
        this.inCart = inCart;
        this.title = data.title;
        this.price = data.price;
        this.category = data.category;
        this.image = data.image;
        this.description = data.description;

        if (data.price === null) {
            this.cardButton.disabled = true;
            this.cardButton.textContent = 'Недоступно';
        } else {
            this.cardButton.disabled = false;
            this.cardButton.textContent = this.inCart ? 'Удалить из корзины' : 'Купить';
        }

        return super.render(data);
    }

    set category(value: string) {
        this.cardCategory.textContent = String(value);

        for (const key in categoryMap) {
            this.cardCategory.classList.toggle(
                categoryMap[key as CategoryKey], 
                key === value
            );
        }
    }

    set image(value: string) {
        this.setImage(this.cardImage, value, this.title);
    }

    set description(value: string) {
        this.cardText.textContent = String(value);
    }
};
