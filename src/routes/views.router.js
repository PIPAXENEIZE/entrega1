import { Router } from "express";
import model from '../managers/mongo/products.testeo.js';

const router = Router();


router.get('/', async(req,res)=>{
    const paginationData = await model.paginate({},{page:parseInt(req.query.page)||1, limit:5, lean:true});
    const products = paginationData.docs

    const {hasPrevPage, hasNextPage, prevPage,nextPage, page:currentPage} = paginationData;

    console.log(paginationData);
    res.render('products',{
        products,
        currentPage,
        page:currentPage,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage
    });
})

export default router;