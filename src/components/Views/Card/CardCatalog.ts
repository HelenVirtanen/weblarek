import { ensureElement } from "../../../utils/utils";
import { IProduct, ICardActions } from "../../../types";
import { Card } from "./Card";
import { categoryMap } from "../../../utils/constants";

type CategoryKey = keyof typeof categoryMap;
export type TCardCatalog = Pick <IProduct, 'image' | 'category'>; 

export class CardCatalog extends Card<TCardCatalog> {
    protected cardImage: HTMLImageElement;
    protected cardCategory: HTMLElement;

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

        if (actions?.onClick) {
            this.container.addEventListener('click', actions.onClick);
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
};
