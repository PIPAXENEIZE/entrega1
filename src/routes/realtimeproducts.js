import { Router } from "express";
import { getProductsData } from '../data.js';

const router = Router();

router.get('/', (req, res) => {
    res.render('realTimeProducts', { products: getProductsData() });
});

export default router;
