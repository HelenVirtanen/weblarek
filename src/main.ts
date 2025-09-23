import './scss/styles.scss';
import { Catalog } from './components/Models/Catalog';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';
import { apiProducts } from './utils/data';
import { IProduct } from './types';
import { ApiCommunication } from './components/Models/ApiCommunication';
import { API_URL, CDN_URL } from './utils/constants';


const catalogModel = new Catalog();
catalogModel.setProducts(apiProducts.items);

console.log("Массив товаров из каталога: ", catalogModel.getProducts());

const cartModel = new Cart();

const newProduct: IProduct = {
    id: "5",
    description: "Test product",
    image: "testimage.png",
    title: "Test product add to cart",
    category: "Test category",
    price: 500
};

cartModel.addProductToCart(newProduct);
console.log("Добавлен тестовый новый продукт:", newProduct);

catalogModel.setSelectedProduct("854cef69-976d-4c2a-a18c-2aa45046c390");
const selectedProduct = catalogModel.getSelectedProduct();
if (selectedProduct) {
    cartModel.addProductToCart(selectedProduct);
    console.log("Добавлен продукт из каталога, выбранный по id");
} else {
    console.log("Выбранный товар в каталоге отсутствует");
}

const secondProductFromCatalog = catalogModel.getProducts()[1];
cartModel.addProductToCart(secondProductFromCatalog);
console.log("Добавлен второй продукт из каталога:", secondProductFromCatalog);

const buyer1 = new Buyer();

buyer1.setBuyerData({
    payment: 'cash',
    email: 'test@gmail.com',
    phone: '89112345678',
    address: 'Test Street, 5, 100500'
})

console.log("Добавлен новый покупатель со всеми данными:", buyer1.getBuyerData());

const buyer2 = new Buyer();
buyer2.setBuyerData({
    email: 'test@yandex.ru',
    address: 'Test City, 8, 209036'
})

console.log("Добавлен новый покупатель с частью данных:", buyer2.getBuyerData());

const apiCommunication = new ApiCommunication(API_URL);

try {
    const catalog = await apiCommunication.getCatalog();

    console.log("Получен каталог с сервера через апи-коммуникатор:", catalog);
} catch (error) {
    console.error("Ошибка получения каталога:", error);
}

try {
    const catalog = await apiCommunication.getCatalog();
    const catalogWithFullPathImages = catalog.items.map(product => ({
    ...product, image: `${CDN_URL}/${product.image}`}));
    console.log("Сформированы полные пути изображений товаров в каталоге", catalogWithFullPathImages);
    catalogModel.setProducts(catalogWithFullPathImages);
    console.log("Сформирован каталог с полными путями к изображениям товаров", catalogModel);
} catch (error) {
    console.error("Ошибка формирования полных путей изображений товаров в каталоге", error);
}
