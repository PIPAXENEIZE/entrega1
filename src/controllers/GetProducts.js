import Product from '../managers/mongo/products.testeo.js';

const getProducts = async (req,res) => {
    const products = await Product.find();

    if (products) {
        res.json({ products })
    } else {
        res.json({ mensaje: "no hay productos" })
    }
}

export default getProducts;
