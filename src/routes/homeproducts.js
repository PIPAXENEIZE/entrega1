import { Router } from "express";
import { getProductsData } from "../data.js";

const router = Router()

router.get('/', (req, res) => {
    res.render('home', { products: getProductsData() });
})

export default router