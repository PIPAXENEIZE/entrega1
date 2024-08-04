import Cart from '../managers/mongo/cart.testeo.js'

const getProductsCartById = async (req, res) => {
    const cartId = req.params.cartId;

    try {
        const cart = await Cart.findById(cartId);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el carrito', error: error.message });
    }
};

export default getProductsCartById
