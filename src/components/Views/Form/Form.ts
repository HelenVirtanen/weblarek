import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';
import { IFormActions } from '../../../types/index';

export abstract class Form extends Component<{}> {
    protected errorsInfo: HTMLElement;
    protected submitButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: IFormActions) {
        super(container);

        this.errorsInfo = ensureElement<HTMLElement>('.form__errors', this.container);
        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);

        if (actions?.onSubmit) {
            this.container.addEventListener('submit', (event) => {
                event.preventDefault();
                actions.onSubmit!(event);
            });
        }
    };

    set errors(value: string) {
        this.errorsInfo.textContent = String(value);
    };

    set submitButtonDisabled(value: boolean) {
        this.submitButton.disabled = value;
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    };

    removeErrors() {
        this.errorsInfo.textContent = '';
    }
};