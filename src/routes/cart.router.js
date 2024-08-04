import { Router } from 'express';
import __dirname from '../utils.js';
import { getProductsCart, getProductsCartById, addProductCart, putProduct, putProductQuantity, deleteAllProduct, deleteProductFromCart, getProducts } from '../controllers/index.js';
import mongoose from 'mongoose';


const router = Router();

const connection = mongoose.connect('mongodb+srv://codertest:coder@coder.rhkkhfv.mongodb.net/college?retryWrites=true&w=majority&appName=Coder')


router.get('/', (req, res) => {
    res.send("cart component STARTED");
});

// Ruta GET para obtener un producto por su ObjectId desde MongoDB
router.get("/products/all", getProducts)
router.get("/detail", getProductsCart)
router.get('/:cartId', getProductsCartById)

router.post("/", addProductCart)

router.put("/:productId", putProduct)
router.put("/:cid/products/:pid", putProductQuantity)

router.delete("/:cartId", deleteAllProduct)
router.delete('/:cartId/products/:productId', deleteProductFromCart)

export default router;
