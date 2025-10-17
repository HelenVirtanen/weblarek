import { ensureElement } from '../../../utils/utils';
import { IFormActions, IContactsActions } from '../../../types/index';
import { Form } from './Form';

export interface IFormContactsActions extends IFormActions, IContactsActions {};

export interface IContacts {
    email: string;
    phone: string;
}
export class FormContacts extends Form {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(container: HTMLElement, actions?: IFormContactsActions) {
        super(container, actions);

        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

        this.emailInput.addEventListener('input', () => {
            if (actions?.onEmailInput) {
                actions.onEmailInput(this.emailInput.value);
            };
        });

        this.phoneInput.addEventListener('input', () => {
            if (actions?.onPhoneInput) {
                actions.onPhoneInput(this.phoneInput.value);
            };
        });
    };

    set email(value: string) {
        this.emailInput.value = value;
    };

    get email(): string {
        return this.emailInput.value;
    }
    
    set phone(value: string) {
        this.phoneInput.value = value;
    };

    get phone(): string {
        return this.phoneInput.value;
    }

    isContactsValid(errors?: {[key: string]: string}): void {
        this.checkErrors(errors || {});
    }

    get contactsData(): IContacts {
        return {
            email: this.email,
            phone: this.phone,
        };
    };
};
