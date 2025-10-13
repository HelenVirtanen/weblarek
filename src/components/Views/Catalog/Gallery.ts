import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';

interface CatalogData {
    catalog: HTMLElement[];
}

export class Gallery extends Component<CatalogData> {
    protected catalogElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.catalogElement = ensureElement<HTMLElement>('.gallery', this.container);
    };

    set catalog(items: HTMLElement[]) {
        this.catalogElement.replaceChildren(...items);
    };
};