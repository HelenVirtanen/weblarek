import './scss/styles.scss';
import { Catalog } from './components/Models/Catalog';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';
import { ApiCommunication } from './components/Models/ApiCommunication';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { ensureElement, cloneTemplate } from './utils/utils';
import { Gallery } from './components/Views/Gallery';
import { Header } from './components/Views/Header';
import { CardCatalog } from './components/Views/Card/CardCatalog';
import { IOrderRequest, IOrderResult, IProduct } from './types';
import { CardPreview } from './components/Views/Card/CardPreview';
import { Modal } from './components/Views/Modal';
import { Basket } from './components/Views/Basket';
import { CardBasket } from './components/Views/Card/CardBasket';
import { FormOrder } from './components/Views/Form/FormOrder';
import { FormContacts } from './components/Views/Form/FormContacts';
import { Success } from './components/Views/Success';

const events = new EventEmitter();

const catalogModel = new Catalog();
const cartModel = new Cart();
const buyerModel = new Buyer();

const apiCommunication = new ApiCommunication(API_URL);

const header = new Header(ensureElement<HTMLElement>('.header'), events);
const gallery = new Gallery(ensureElement<HTMLElement>('.page__wrapper'));
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const modal = new Modal(ensureElement<HTMLElement>('.modal'), events);
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketButton = ensureElement<HTMLButtonElement>('.header__basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const formOrderTemplate = ensureElement<HTMLTemplateElement>('#order');
const formContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

basketButton.addEventListener('click', () => {
    events.emit('cart:open');
});

events.on('catalog:changed', () => {
    const itemCards = catalogModel.getProducts().map((item) => {
        const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
            onClick: () => {
                events.emit('card:select', item);
            },
        });
        return card.render(item);
    });
    gallery.render({ catalog: itemCards })
});

events.on('card:select', (product: IProduct) => {
    catalogModel.setSelectedProduct(product.id);
    const productInCart = cartModel.isProductInCart(product.id);
    
    const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            if (productInCart) {
                events.emit('card:remove-product', product);
            } else {
                events.emit('card:add-product', product);
            }
        },
    });

    if (product.price === null) { 
        card.buttonText = 'Недоступно'; 
        card.buttonDisabled = true; 
    } else { 
        card.buttonText = productInCart ? 'Удалить из корзины' : 'Купить'; 
        card.buttonDisabled = false; 
    }

    modal.render({ content: card.render(product) });
    modal.open(); 
})

events.on('card:add-product', (product: IProduct) => {
    cartModel.addProductToCart(product);
    events.emit('cart-counter:changed');
    events.emit('card:select', product);
})

events.on('card:remove-product', (product: IProduct) => {
    cartModel.removeProductFromCart(product);
    events.emit('cart-counter:changed');
    events.emit('card:select', product);
    modal.close();
})

events.on('cart-counter:changed', () => {
    header.counter = cartModel.getTotalCartProducts();
});

events.on('cart:open', () => {
    const basket = new Basket(cloneTemplate(basketTemplate), {
        onBuy: () => {
            events.emit('cart:order');
        },
    });

    const basketList = cartModel.getCartProducts();

    const basketItems = basketList.map((item, index) => {
        const basketProduct = new CardBasket(cloneTemplate(cardBasketTemplate), {
            onRemove: () => {
                events.emit('card:remove-product', item);
                events.emit('cart:open');
            }
        })

        basketProduct.index = index + 1;
        basketProduct.title = item.title;
        basketProduct.price = item.price;

        return basketProduct.render(item);
    })

    basket.basket = basketItems;
    basket.total = cartModel.getTotalCartPrice();

    modal.render({ content: basket.render()});
    modal.open();
})

events.on('cart:order', () => {
    const order = new FormOrder(cloneTemplate(formOrderTemplate), {
        onSubmit: (event) => {
            event.preventDefault();
            const orderDetails = order.orderData;
            buyerModel.setBuyerData({
                payment: orderDetails.payment,
                address: orderDetails.address,
            });
            events.emit('cart:contacts', orderDetails);
        },

        onPaymentSelect: (payment) => {
            buyerModel.setBuyerData({ payment });
        },
        onAddressInput: (address) => {
            buyerModel.setBuyerData({ address });
        },
    });

    order.payment = buyerModel.getBuyerData()?.payment || 'card';
    order.address = buyerModel.getBuyerData()?.address || '';

    modal.render({ content: order.render() });
    modal.open();
})

events.on('cart:contacts', () => {
    const contacts = new FormContacts(cloneTemplate(formContactsTemplate), {
        onSubmit: async (event) => {
            event.preventDefault();
            const contactsDetails = contacts.contactsData;
            buyerModel.setBuyerData({
                email: contactsDetails.email,
                phone: contactsDetails.phone,
            });

            const orderData: IOrderRequest = {
                payment: buyerModel.getBuyerData()?.payment ?? 'card',
                email: contactsDetails.email,
                phone: contactsDetails.phone,
                address: buyerModel.getBuyerData()?.address ?? 'test',
                total: cartModel.getTotalCartPrice(),
                items: cartModel.getCartProducts().map(p => p.id),
            };


            try {
                const result = await apiCommunication.createOrder(orderData);
                console.log('RESULT', result);
                console.log('Order success:', result);
                events.emit('cart:success', result);
            } catch (err) {
                console.error(err);
            }
        },

        onEmailInput: (email) => {
            buyerModel.setBuyerData({ email });
        },
        onPhoneInput: (phone) => {
            buyerModel.setBuyerData({ phone });
        },
    });

    modal.render({ content: contacts.render() });
    modal.open();
})

events.on('cart:success', (result: IOrderResult) => {
    const success = new Success(cloneTemplate(successTemplate), {
        onOrdered: () => {
            modal.close();
            cartModel.clearCart();
            buyerModel.clearBuyerData();
        }
    })
;
    success.total = result.total ?? cartModel.getTotalCartPrice();
    
    modal.render({ content: success.render() });
    modal.open();
})

apiCommunication.getCatalog()
    .then(catalog => catalog.items.map(product => (
        { ...product, image: `${CDN_URL}/${product.image}` }
    )))
    .then(productsWithImages => {
        catalogModel.setProducts(productsWithImages);
        events.emit('catalog:changed');
    })
    .catch(error => console.error('Ошибка загрузки каталога', error));
