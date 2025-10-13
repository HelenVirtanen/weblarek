import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';
import { IEvents } from '../../base/Events';

interface ModalContent {
    content: HTMLElement;
};

export abstract class Modal extends Component<ModalContent> {
    protected closeButton: HTMLButtonElement;
    protected modalElement: HTMLElement;
    protected page: HTMLElement;
    isOpen: boolean = false;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
        this.modalElement = ensureElement<HTMLElement>('.modal__content', this.container);
        this.page = ensureElement<HTMLElement>('.page-wrapper', this.container);

        this.closeButton.addEventListener('click', () => {
            this.container.classList.remove('modal_active');
            this.isOpen = false;
            this.events.emit('modal:close');
        });
    };

    set content(elem: HTMLElement) {
        this.modalElement.replaceChildren(elem); 
    }
};