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


const events = new EventEmitter();

const catalogModel = new Catalog();
const cartModel = new Cart();
const buyerModel = new Buyer();

buyerModel.setBuyerData({
    payment: 'cash',
    email: 'test@gmail.com',
    phone: '89112345678',
    address: 'Test Street, 5, 100500'
})

console.log("Добавлен новый покупатель со всеми данными:", buyerModel.getBuyerData());

const apiCommunication = new ApiCommunication(API_URL);

const header = new Header(ensureElement<HTMLElement>('.header'), events);
const gallery = new Gallery(ensureElement<HTMLElement>('.page__wrapper'));
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');

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

events.on('cart-counter:changed', () => {
    header.counter = cartModel.getTotalCartProducts();
});

apiCommunication.getCatalog()
    .then(catalog => catalog.items.map(product => (
        { ...product, image: `${CDN_URL}/${product.image}` }
    )))
    .then(productsWithImages => {
        catalogModel.setProducts(productsWithImages);
        events.emit('catalog:changed');
        events.emit('cart-counter:changed');
    })
    .catch(error => console.error('Ошибка загрузки каталога', error));
