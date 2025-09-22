import './scss/styles.scss';
import { Catalog } from './components/Models/Catalog';
import { Cart } from './components/Models/Cart';
import { Customer } from './components/Models/Customer';
import { apiProducts } from './utils/data';
import { IProduct } from './types';

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

const customer1 = new Customer();

customer1.setCustomerData({
    payment: 'cash',
            email: 'test@gmail.com',
            phone: '89112345678',
            address: 'Test Street, 5, 100500'
})

console.log("Добавлен новый покупатель со всеми данными:", customer1.getCustomerData());

const customer2 = new Customer();
customer2.setCustomerData({
            email: 'test@yandex.ru',
            address: 'Test City, 8, 209036'
})

console.log("Добавлен новый покупатель с частью данных:", customer2.getCustomerData());