import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { ISuccessActions } from '../../types';

export interface ISpent {
    total: number;
}

export class Success extends Component<ISpent>{
    protected successDescription: HTMLElement;
    protected successButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ISuccessActions) {
        super(container);

        this.successDescription = ensureElement<HTMLElement>('.order-success__description', this.container);
        this.successButton =  ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        if (actions?.onOrdered) {
            this.successButton.addEventListener('click', actions.onOrdered);
        }
    };

    set total(value: number) {
        this.successDescription.textContent = `Списано ${value} синапсов`;
    };
};
