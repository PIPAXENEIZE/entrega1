import { Router } from "express";
import productModel from "../managers/mongo/products.testeo.js";

const router = Router();



router.post('/', async(req,res)=>{
    const body = req.body;
    const newProduct = {
        title:body.title,
        description:body.description,
        code:body.code,
        price:body.price,
        quantity:body.quantity,
        category:body.category,
        status:body.status
    }
    const result = await productModel.create(newProduct)
    res.sendStatus(200);
})



export default router;