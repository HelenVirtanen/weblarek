import { ensureElement } from "../../../utils/utils";
import { IProduct, ICardActions } from "../../../types";
import { Card, ICard } from "./Card";
import { categoryMap } from "../../../utils/constants";

type CategoryKey = keyof typeof categoryMap;
export type TCardCatalog = Pick <IProduct, 'image' | 'category'>; 

export class CardPreview extends Card<ICard> {
    protected cardImage: HTMLImageElement;
    protected cardCategory: HTMLElement;
    protected cardText: HTMLElement;
    protected cardButton: HTMLButtonElement;
    inCart: boolean = false;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.cardImage = ensureElement<HTMLImageElement>(
            '.card__image',
            this.container
        );
        
        this.cardCategory = ensureElement<HTMLElement>(
            '.card__category', 
            this.container
        );

        this.cardText = ensureElement<HTMLElement>(
            '.card__text', 
            this.container
        );

        this.cardButton = ensureElement<HTMLButtonElement>(
            '.card__button', 
            this.container
        );

        if (actions?.onClick) {
            this.cardButton.addEventListener('click', actions.onClick);
        };
    };

    set category(value: string) {
        this.cardCategory.textContent = String(value);

        for (const key in categoryMap) {
            this.cardCategory.classList.toggle(
                categoryMap[key as CategoryKey], 
                key === value
            );
        };
    };

    set image(value: string) {
        this.setImage(this.cardImage, value, this.title);
    };

    set description(value: string) {
        this.cardText.textContent = String(value);
    }

    set buttonText(value: string) {
        if (this.inCart) {
            this.cardButton.textContent = 'Удалить из корзины';
        } else {
            this.cardButton.textContent = value || 'Купить';
        }
    }

    set buttonDisabled(value: boolean) {
        this.cardButton.disabled = value;
    };
};
