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
import { IOrderRequest, IProduct } from './types';
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
const modal = new Modal(ensureElement<HTMLElement>('.modal'), events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const formOrderTemplate = ensureElement<HTMLTemplateElement>('#order');
const formContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

events.on('catalog:changed', () => {
    const itemCards = catalogModel.getProducts().map((item) => {
        const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), events);
        return card.render(item);
    });
    gallery.render({ catalog: itemCards })
});

events.on('card:select', (product: IProduct) => {
    catalogModel.setSelectedProduct(product.id);
    const productInCart = cartModel.isProductInCart(product.id);
    const card = new CardPreview(cloneTemplate(cardPreviewTemplate), events);
    
    modal.render({ content: card.render(product, productInCart) });
    modal.open(); 
})

events.on('card:add-product', (product: IProduct) => {
    cartModel.addProductToCart(product);
    header.counter = cartModel.getTotalCartProducts();
})

events.on('card:remove-product', (product: IProduct) => {
    cartModel.removeProductFromCart(product);
    header.counter = cartModel.getTotalCartProducts();
})

events.on('cart-counter:changed', () => {
    header.counter = cartModel.getTotalCartProducts();
});

events.on('cart:open', () => {
    const basket = new Basket(cloneTemplate(basketTemplate), events); 

    const basketList = cartModel.getCartProducts();

    const basketItems = basketList.map((item, index) => {
        const basketProduct = new CardBasket(cloneTemplate(cardBasketTemplate), events);

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
        onSubmit: () => {;
            const orderDetails = order.orderData;
            buyerModel.setBuyerData({
                payment: orderDetails.payment,
                address: orderDetails.address,
            });
            events.emit('cart:contacts');
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
        onSubmit: () => {
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
            
            console.log('Отправляем заказ на сервер:', orderData);

            try {
                const result = apiCommunication.createOrder(orderData);
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

events.on('cart:success', () => {
    const success = new Success(cloneTemplate(successTemplate), {
        onOrdered: () => {
            modal.close();
            cartModel.clearCart();
            header.counter = cartModel.getTotalCartProducts();
            buyerModel.clearBuyerData();
        }
    })
;
    success.total = cartModel.getTotalCartPrice();
    
    modal.render({ content: success.render() });
    modal.open();
})

apiCommunication.getCatalog()
    .then(catalog => catalog.items.map(product => (
        { ...product, image: `${CDN_URL}/${product.image}`.replace('svg', 'png') }
    )))
    .then(productsWithImages => {
        catalogModel.setProducts(productsWithImages);
        events.emit('catalog:changed');
    })
    .catch(error => console.error('Ошибка загрузки каталога', error));
