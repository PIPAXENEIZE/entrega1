// deleteallproducts.js

import Cart from '../managers/mongo/cart.testeo.js';
import Product from '../managers/mongo/products.testeo.js';

const deleteAllProducts = async (req, res) => {
  const { cartId } = req.params;

  try {
    // Buscamos el carrito por su ID
    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res.status(404).json({ mensaje: "Carrito no encontrado" });
    }

    // Verificamos si el carrito tiene productos antes de continuar
    if (!cart.products || cart.products.length === 0) {
      return res.status(400).json({ mensaje: "El carrito no tiene productos para eliminar" });
    }

    // Asignamos un array vacío para vaciar el array de productos del carrito
    cart.products = [];

    // Guardamos el carrito actualizado
    await cart.save();

    // Actualizamos la propiedad inCart de cada producto en la base de datos
    await Product.updateMany(
      { _id: { $in: cart.products.map(product => product._id) } },
      { inCart: false }
    );

    res.json({
      mensaje: "Todos los productos fueron eliminados del carrito",
      cart
    });
  } catch (error) {
    console.log(`Error: ${error}`);
    res.status(500).json({ mensaje: "Hubo un error", error });
  }
};

export default deleteAllProducts;
