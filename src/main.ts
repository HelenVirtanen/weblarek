import './scss/styles.scss';
import { Catalog } from './components/Models/Catalog';
import { apiProducts } from './utils/data';

const productsModel = new Catalog();
productsModel.setProducts(apiProducts.items);

console.log("Массив товаров из каталога: ", productsModel.getProducts());