import Cart from '../managers/mongo/cart.testeo.js';
import Product from '../managers/mongo/products.testeo.js';

const deleteProductFromCart = async (req, res) => {
    const { cartId, productId } = req.params;

    try {
        // Buscamos el carrito por su ID
        const cart = await Cart.findById(cartId);

        if (!cart) {
            return res.status(404).json({ mensaje: "Carrito no encontrado" });
        }

        // Verificamos si el producto está en el carrito
        const productInCart = cart.products.find(product => product._id.toString() === productId);

        if (!productInCart) {
            return res.status(404).json({ mensaje: "Producto no encontrado en el carrito" });
        }

        // Eliminamos el producto del carrito
        cart.products = cart.products.filter(product => product._id.toString() !== productId);

        // Guardamos el carrito actualizado
        await cart.save();

        // Actualizamos la propiedad inCart del producto en la base de datos
        const product = await Product.findByIdAndUpdate(
            productId,
            { inCart: false },
            { new: true }
        );

        res.json({
            mensaje: `El producto ${product.title} fue eliminado del carrito`,
            cart
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Hubo un error", error });
    }
};

export default deleteProductFromCart;