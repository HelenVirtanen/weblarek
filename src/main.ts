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
import { IProduct } from './types';
import { CardPreview } from './components/Views/Card/CardPreview';
import { Modal } from './components/Views/Modal';
import { Basket } from './components/Views/Basket';
import { CardBasket } from './components/Views/Card/CardBasket';
import { FormOrder } from './components/Views/Form/FormOrder';

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
                email: buyerModel?.getBuyerData()?.email || 'test@email.com',
                phone: buyerModel?.getBuyerData()?.phone || '89112345678',
            });
            events.emit('order-details:submit', orderDetails);
        },

        onPaymentSelect: (payment) => {
            buyerModel.setBuyerData({payment});
        },
        onAddressInput: (address) => {
            buyerModel.setBuyerData({address});
        },
    });

    order.payment = buyerModel.getBuyerData()?.payment || 'card';
    order.address = buyerModel.getBuyerData()?.address || '';

    modal.render({ content: order.render() });
    modal.open();
})

events.on('order-details:submit', () => {
    console.log('следующее окно');
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
