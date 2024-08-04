import Cart from '../managers/mongo/cart.testeo.js';

const putProductQuantity = async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    // Buscar el carrito por su id
    const cart = await Cart.findById(cid);

    if (!cart) {
      return res.status(404).json({ mensaje: "Carrito no encontrado" });
    }

    // Encontrar el producto dentro del carrito
    const product = cart.products.find(p => p.productId.toString() === pid);

    if (!product) {
      return res.status(404).json({ mensaje: "Producto no encontrado en el carrito" });
    }

    // Actualizar la cantidad del producto
    product.quantity = quantity;

    // Guardar el carrito actualizado
    await cart.save();

    res.json({
      mensaje: `La cantidad del producto "${product.title}" ha sido actualizada`,
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Hubo un error al intentar actualizar la cantidad del producto en el carrito",
      error: error.message,
    });
  }
};

export default putProductQuantity;
