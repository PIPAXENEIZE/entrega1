import { Router } from "express";
import __dirname from "../utils.js"; // Importar __dirname desde utils.js
import productModel from "../managers/mongo/products.testeo.js";


const router = Router();

// obtiene los productos

router.get('/', async(req,res)=>{
  const paginationData = await productModel.paginate({},{page:parseInt(req.query.page)||1, limit:5, lean:true});
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


// Ruta para agregar un nuevo producto
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
