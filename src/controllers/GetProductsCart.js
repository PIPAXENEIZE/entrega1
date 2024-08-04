import Cart from '../managers/mongo/cart.testeo.js';

const getProductsCart = async (req, res) => {
    try {
        const productsCart = await Cart.find().populate('products.productId');

        if (productsCart) {
            res.render('carrito', { productsCart }); // Renderizar la vista 'detail' con los datos
        } else {
            res.json({ mensaje: "no hay productos en el carrito" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
};

export default getProductsCart
