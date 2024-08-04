import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import __dirname from '../utils.js';
import productModel from '../managers/mongo/products.model.js';

const router = Router();
const productsPath = path.resolve(__dirname, 'products.json');
const cartsPath = path.resolve(__dirname, 'carts.json');

// Función para obtener los ids de los productos de products.json
const getProductIds = () => {
    const data = fs.readFileSync(productsPath, 'utf-8');
    const products = JSON.parse(data);
    return products.map(product => product.id);
};

// Función para obtener todos los carritos
const getCarts = () => {
    if (!fs.existsSync(cartsPath)) {
        return [];
    }
    const data = fs.readFileSync(cartsPath, 'utf-8');
    const carts = JSON.parse(data);

    // Iterar sobre cada carrito y cargar los productos completos
    carts.forEach(cart => {
        cart.products = cart.products.map(item => ({
            product: getProductById(item.product),  // Función para obtener el producto completo por ID
            quantity: item.quantity
        }));
    });

    return carts;
};

// Función para guardar los carritos
const saveCarts = (carts) => {
    fs.writeFileSync(cartsPath, JSON.stringify(carts, null, 2));
};

// Función para obtener un producto por su ID desde `products.json`
const getProductById = (productId) => {
    const data = fs.readFileSync(productsPath, 'utf-8');
    const products = JSON.parse(data);
    return products.find(product => product.id === productId);
};

router.get('/', (req, res) => {
    res.send("cart component STARTED");
});

// Ruta GET para obtener un producto por su ObjectId desde MongoDB
router.get('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }
        res.json(product);
    } catch (error) {
        res.status(500).send('Error del servidor');
    }
});

// Ruta POST para crear un nuevo carrito
router.post('/', (req, res) => {
    const productIds = getProductIds();
    const carts = getCarts();

    // Generar un id único que no duplique los ids de los carritos
    let newCartId;
    do {
        newCartId = Math.floor(Math.random() * 1000000); // Genera un id aleatorio
    } while (carts.some(cart => cart.id === newCartId));

    const newCart = {
        id: newCartId,
        products: [] // Array vacío que contendrá los objetos de productos
    };

    carts.push(newCart);
    saveCarts(carts);

    res.status(201).json(newCart);
});

// Ruta POST para agregar un producto a un carrito
router.post('/:cid/product/:pid', (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const carts = getCarts();
    const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

    const cart = carts.find(c => c.id === parseInt(cid));
    if (!cart) {
        return res.status(404).send("Carrito no encontrado");
    }

    const product = products.find(p => p.id === parseInt(pid));
    if (!product) {
        return res.status(404).send("Producto no encontrado");
    }

    const existingProduct = cart.products.find(p => p.product.id === parseInt(pid));
    if (existingProduct) {
        existingProduct.quantity += quantity ? parseInt(quantity) : 1;
    } else {
        cart.products.push({
            product: getProductById(parseInt(pid)),
            quantity: quantity ? parseInt(quantity) : 1
        });
    }

    saveCarts(carts);

    res.status(201).json(cart);
});

// Ruta PUT para actualizar carrito con nuevos productos
router.put('/:cid', (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;

    const carts = getCarts();
    const cart = carts.find(c => c.id === parseInt(cid));
    if (!cart) {
        return res.status(404).send("Carrito no encontrado");
    }

    cart.products = products.map(item => ({
        product: getProductById(parseInt(item.product)),
        quantity: parseInt(item.quantity)
    }));

    saveCarts(carts);

    res.status(200).json(cart);
});

// Ruta PUT para actualizar cantidad de productos en el carrito
router.put('/:cid/products/:pid', (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const carts = getCarts();
    const cart = carts.find(c => c.id === parseInt(cid));
    if (!cart) {
        return res.status(404).send("Carrito no encontrado");
    }

    const productIndex = cart.products.findIndex(p => p.product.id === parseInt(pid));
    if (productIndex === -1) {
        return res.status(404).send("Producto no encontrado en el carrito");
    }

    cart.products[productIndex].quantity = parseInt(quantity);

    saveCarts(carts);

    res.status(200).json(cart);
});

// Ruta DELETE para eliminar producto del carrito
router.delete('/:cid/products/:pid', (req, res) => {
    const { cid, pid } = req.params;

    const carts = getCarts();
    const cart = carts.find(c => c.id === parseInt(cid));
    if (!cart) {
        return res.status(404).send("Carrito no encontrado");
    }

    const index = cart.products.findIndex(p => p.product.id === parseInt(pid));
    if (index === -1) {
        return res.status(404).send("Producto no encontrado en el carrito");
    }

    cart.products.splice(index, 1);
    saveCarts(carts);

    res.status(200).json(cart);
});

// Ruta DELETE para eliminar todos los productos del carrito
router.delete('/:cid', (req, res) => {
    const { cid } = req.params;

    const carts = getCarts();
    const cartIndex = carts.findIndex(c => c.id === parseInt(cid));
    if (cartIndex === -1) {
        return res.status(404).send("Carrito no encontrado");
    }

    carts[cartIndex].products = [];
    saveCarts(carts);

    res.status(200).json(carts[cartIndex]);
});

export default router;
