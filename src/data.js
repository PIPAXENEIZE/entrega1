import fs from 'fs';
import __dirname from './utils.js';

let productsData = JSON.parse(fs.readFileSync(`${__dirname}/products.json`, 'utf-8'));

export const getProductsData = () => productsData;

export const setProductsData = (data) => {
    productsData = data;
    fs.writeFileSync(`${__dirname}/products.json`, JSON.stringify(productsData, null, 2));
};
